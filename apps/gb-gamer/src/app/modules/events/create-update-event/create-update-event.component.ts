import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzInputModule} from "ng-zorro-antd/input";
import {TranslateModule} from "@ngx-translate/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {CountryISO} from "ngx-intl-tel-input";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {UploadPhotosComponent} from "../../../shared/components/upload-photos/upload-photos.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {GlobalState} from "../../../shared/state/global.state";
import {GamesState} from "../../games/state/games.state";
import {Arena} from "../../../shared/models/arena";
import {ArenasState} from "../../arena/state/arenas.state";
import {GetGamesList} from "../../games/state/games.action";
import {CreateEvent, GetArenas, GetEvent, UpdateEvent} from "../state/event.action";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {EventsService} from "../service/events.service";
import {EventState} from "../state/event.state";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {GlobalService} from "../../../shared/service/global.service";

@Component({
  selector: 'app-create-update-event',
  standalone: true,
  imports: [CommonModule, UploadPhotosComponent, NzGridModule, NzDividerModule, NgxIntlTelInputModule, NzSelectModule, NzInputModule, TranslateModule, ReactiveFormsModule, RouterLink, ButtonComponent, NzFormModule, NzDatePickerModule, NzRadioModule],
  templateUrl: './create-update-event.component.html',
  styleUrls: ['./create-update-event.component.scss']
})
export class CreateUpdateEventComponent {
  [key: string]: any;

  avatar: string;
  cover: string;
  eventForm: FormGroup
  @Select(GlobalState.getCountriesList) Countries: Observable<any>;
  @Select(GamesState.getAllGames) Games$: Observable<any>;
  @Select(EventState.getEvent) Event$: Observable<Arena>;
  @Select(EventState.getMyArenas) myArenas$: Observable<Arena[]>;

  protected readonly CountryISO = CountryISO;
  isEdit: boolean;
  imageSelected: any
  statusList = ['To be started', 'Cancelled', 'In Progress', 'Finished']
  eventId: string
  isCustomUrl: boolean

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private store: Store, private router: Router,
              private action$: Actions, private eventService: EventsService, private globalService:GlobalService) {
    this.eventForm = fb.group({
      name: ['', Validators.compose([Validators.required])],
      country: [''],
      game_code: [[], Validators.compose([Validators.required])],
      start_at: ['', Validators.required],
      status: [''],
      slogan: [''],
      description: [''],
      type: ['default'],
      arena_ids: []
    })

    if (this.activatedRoute.snapshot.params['id']) {
      this.isEdit = true
      this.eventId = this.activatedRoute.snapshot.params['id'];
      this.eventForm.addControl('status', this.fb.control(''));

    }
  }

  ngOnInit() {
    this.store.dispatch(new GetGamesList())
    this.store.dispatch(new GetArenas())

    if (this.isEdit) {
      this.store.dispatch(new GetEvent(this.eventId))
      this.patchValueArena()
    }
  }

  patchValueArena() {
    this.Event$.subscribe((res: any) => {
      this.eventForm.patchValue(res)
      console.log(res.games)
      this.eventForm.get('game_code').setValue(res.games.map(game => game.code))
      this.eventForm.get('arena_ids').setValue(res.arenas.map(game => game.id))
      this.avatar = res?.profile_picture;
      this.cover = res?.cover_picture;
      console.log(this.eventForm.controls)
    })
  }

  submitEvent() {
    const formValue = this.eventForm.value;
    const formData = new FormData();
    console.log(this.imageSelected)
    if (this.imageSelected?.avatar) {
      formData.append('profile_picture', this.imageSelected.avatar);
    }
    if (this.imageSelected?.cover) {
      formData.append('cover_picture', this.imageSelected.cover);
    }
    if (this.isEdit) {
      this.globalService.removeEmptyKeys(formValue)
      formData.append('data', JSON.stringify(formValue));
      this.store.dispatch(new UpdateEvent(formData, this.eventId))
    } else {
      formData.append('data', JSON.stringify(formValue));
      this.store.dispatch(new CreateEvent(formData))
    }
    // this.action$.pipe(ofActionSuccessful(UpdateArena)).subscribe(() => {
    //   this.patchValueArena()
    // })
  }

  deleteEvent() {
    this.eventService.deleteEvent('gb').subscribe(data => {
    })
  }

  selectImages($event: any) {
    this.imageSelected = {...this.imageSelected, ...$event}
    if ($event?.avatarImageHolder) {
      this.avatar = $event.avatarImageHolder
    }
    if ($event?.coverImageHolder) {
      this.cover = $event.coverImageHolder
    }
  }

  onselectionchange(event) {
    console.log(event)
    if (event === 'custom') {
      this.isCustomUrl = true
      this.eventForm.addControl('custom_url', this.fb.control('', Validators.required));

    } else {
      this.isCustomUrl = false
      this.eventForm.removeControl('custom_url')
    }

  }
}
