import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadPhotosComponent} from "../../../../shared/components/upload-photos/upload-photos.component";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzInputModule} from "ng-zorro-antd/input";
import {TranslateModule} from "@ngx-translate/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {GlobalState} from "../../../../shared/state/global.state";
import {Observable} from "rxjs";
import {GamesState} from "../../../games/state/games.state";

import {GetGamesList} from "../../../games/state/games.action";
import {CountryISO} from "ngx-intl-tel-input";
import {ArenasState} from "../../state/arenas.state";
import {Arena} from "../../../../shared/models/arena";
import {ButtonComponent} from "../../../../components/button/button.component";
import {NzFormModule} from "ng-zorro-antd/form";
import {CreateArena, GetArena, UpdateArena} from "../../state/arenas.action";
import {ArenaService} from "../../service/arena.service";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {GetArenas} from "../../../events/state/event.action";

@Component({
  selector: 'app-create-update-arena',
  standalone: true,
  imports: [CommonModule, UploadPhotosComponent, NzGridModule,NzDividerModule, NgxIntlTelInputModule, NzSelectModule, NzInputModule, TranslateModule, ReactiveFormsModule, RouterLink, ButtonComponent, NzFormModule],
  templateUrl: './create-update-arena.component.html',
  styleUrls: ['./create-update-arena.component.scss']
})
export class CreateUpdateArenaComponent {
  [key: string]: any;

  avatar: string;
  cover: string;
  arenaForm: FormGroup
  @Select(GlobalState.getCountriesList) Countries: Observable<any>;
  @Select(GamesState.getAllGames) Games$: Observable<any>;
  @Select(ArenasState.getArena) Arena$: Observable<Arena>;

  protected readonly CountryISO = CountryISO;
  isEdit: boolean;
  imageSelected: any

  constructor(private fb: FormBuilder, private store: Store,  private router: Router, private arenaService: ArenaService, private action$: Actions) {
    this.arenaForm = fb.group({
      name: ['', Validators.compose([Validators.required])],
      country: [''],
      // game_code: ['', Validators.compose([Validators.required])],
      bio: [''],
      description: [''],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      mobile: [null],
      arena_ids: []
    })
    this.isEdit = this.router.url.includes('manage');

  }

  ngOnInit() {
    this.store.dispatch(new GetGamesList())
    if (this.isEdit) {
      this.patchValueArena()
    }
  }

  patchValueArena() {
    this.Arena$.subscribe((res: any) => {
      console.log(res)
      this.arenaForm.patchValue(res)
      this.avatar = res?.profile_picture;
      this.cover = res?.cover_picture;
      this.arenaForm.markAsPristine()
      //check if the form-control mobile is dirty


      console.log(this.arenaForm.controls)
    })
  }
  submitArena() {
    const formValue = this.arenaForm.value;
    console.log(formValue)
    formValue.mobile = formValue.mobile?.e164Number
    const formData = new FormData();
    console.log(this.imageSelected)
    if (this.imageSelected?.avatar) {
      formData.append('profile_picture', this.imageSelected.avatar);

    }
    if (this.imageSelected?.cover) {
      formData.append('cover_picture', this.imageSelected.cover);
    }
    formData.append('data', JSON.stringify(formValue));
    console.log(this.arenaForm.value)
    if (this.isEdit) {
      this.store.dispatch(new UpdateArena(this.arenaService.arenaSlug, formData))
    } else {
      this.store.dispatch(new CreateArena(formData))
    }
    this.action$.pipe(ofActionSuccessful(UpdateArena)).subscribe(() => {
      this.patchValueArena()
    })
  }

  selectImages($event: any) {
    this.imageSelected = {...this.imageSelected , ...$event}
    if($event?.avatarImageHolder){
      this.avatar = $event.avatarImageHolder
    }
    if($event?.coverImageHolder){
      this.cover = $event.coverImageHolder
    }
  }
}
