import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzFormModule} from "ng-zorro-antd/form";
import {TranslateModule} from "@ngx-translate/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {GamerService} from "../../gamer/service/gamer.service";
import {Select, Store} from "@ngxs/store";
import {NzSelectModule} from "ng-zorro-antd/select";
import {GlobalState} from "../../../shared/state/global.state";
import {Observable} from "rxjs";
import {GamesState} from "../../games/state/games.state";
import {GetGamesList} from "../../games/state/games.action";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {CountryISO} from "ngx-intl-tel-input";
import {NzButtonModule} from "ng-zorro-antd/button";
import {DefaultImagePipe} from "../../../shared/pipes/default-image.pipe";
import {TeamsService} from "../service/teams.service";
import {NzModalModule, NzModalService} from "ng-zorro-antd/modal";
import {base64ToFile, ImageCropperModule} from "ngx-image-cropper";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {CreateTeam, GetTeam, UpdateTeam} from "../state/team.action";
import {TeamState} from "../state/team.state";
import {Team} from "../../../shared/models/team";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {ButtonComponent} from "../../../components/button/button.component";
import {UploadPhotosComponent} from "../../../shared/components/upload-photos/upload-photos.component";
import {GlobalService} from "../../../shared/service/global.service";
import {SetNotifications} from "../../../shared/state/global.action";
import {success} from "ng-packagr/lib/utils/log";
import {ConfirmationModalComponent} from "../../../shared/modals/confirmation-modal/confirmation-modal.component";

@Component({
  selector: 'app-create-update-team',
  standalone: true,
  imports: [CommonModule, NzFormModule, TranslateModule, ReactiveFormsModule, NzInputModule, NzSelectModule, NgxIntlTelInputModule, NzButtonModule, DefaultImagePipe, NzModalModule, ImageCropperModule, NzDividerModule, ButtonComponent, RouterLink, UploadPhotosComponent],
  templateUrl: './create-update-team.component.html',
  styleUrls: ['./create-update-team.component.scss']
})
export class CreateUpdateTeamComponent implements OnInit{
  [key: string]: any;
  avatar: string;
  cover: string;
  teamForm: FormGroup
  type = 'create'
  @Select(GlobalState.getCountriesList) Countries: Observable<any>;
  @Select(GamesState.getAllGames) Games$: Observable<any>;
  @Select(TeamState.getTeam) Team$: Observable<Team>;
  socialMedia = [
    { name: 'facebook', formName: 'facebook', placeholder: 'https://www.facebook.com/example' } ,
    { name: 'twitch', formName: 'twitch', placeholder: 'https://www.twitch.com/example' },
    { name: 'twitter', formName: 'twitter', placeholder: 'https://www.twitter.com/example' },
    { name: 'instagram', formName: 'instagram', placeholder: 'https://www.instagram.com/example' },
    { name: 'youtube', formName: 'youtube', placeholder: 'https://www.youtube.com/example' },
    { name: 'discord', formName: 'discord', placeholder: 'https://www.discord.com/example' },
   ]
  protected readonly CountryISO = CountryISO;
  isEdit: boolean;
  imageSelected:any
  constructor(private fb:FormBuilder , private store:Store, private teamService:TeamsService , private router:Router, private globalService:GlobalService,
              private activatedRoute: ActivatedRoute, private modalService: NzModalService) {
    this.teamForm = fb.group({
      name: ['', Validators.compose([Validators.required])],
      country: ['', Validators.required],
      game_code: ['' , Validators.compose([Validators.required])],
      bio: [''],
      description: [''],
      social: fb.group({
        facebook: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(facebook)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        twitch: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(twitch)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        twitter: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(twitter)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        youtube: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(youtube)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        discord: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(discord|discordapp)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
        instagram: [null, Validators.pattern('^(http(s?):\\/\\/)?(www\\.)?(instagram)(\\.[a-zA-Z]{2,3})+(\\/[a-zA-Z0-9\\_\\-\\s\\.\\/\\?\\%\\#\\&\\=]*)?$')],
      }),
      contact:fb.group({
        email: ['' , Validators.compose([Validators.required , Validators.email])],
        phone: [null],
      })
    })
  }

  ngOnInit() {
    this.isEdit = this.router.url.includes('edit');
    if(this.isEdit) {
      this.store.dispatch(new GetTeam(this.activatedRoute.snapshot.params['id']))
      this.Team$.subscribe((res: any) => {
        this.teamForm.patchValue(res)
        this.avatar = res?.avatar;
        this.cover = res?.cover;
        this.teamForm.get('game_code')!.setValue(res?.game?.data?.code);

      })

    }
    this.store.dispatch(new GetGamesList())
  }
  deleteTeam() {
    const gamer = JSON.parse(localStorage.getItem('userAuth') || '{}')
    console.log(gamer)
    this.modalService.create({
      nzContent: ConfirmationModalComponent,
      nzData: {
        title: 'Delete Team',
        message: 'Are you sure you want to delete this team?',
      },
      nzClassName: 'challenge-modal h-auto',
      nzFooter: null

    }).afterClose.subscribe((res: any) => {
      if(res === 'confirm') {
        this.teamService.deleteTeam(this.activatedRoute.snapshot.params['id']).subscribe((res: any) => {
          this.store.dispatch(new SetNotifications('success' , 'Team Deleted Successfully' , 'success'))
          this.router.navigateByUrl(`/gamer/${gamer.slug}/teams`)
        })
      }
    })

  }
  submitTeam() {
    this.teamForm.get('contact')?.get('phone')?.setValue(this.teamForm.get('contact')?.get('phone')?.value?.e164Number)
    const formData = new FormData();
    if(this.imageSelected?.avatar ){
      formData.append('avatar', this.imageSelected.avatar);
    }
    if(this.imageSelected?.cover ){
      formData.append('cover', this.imageSelected.cover);
    }
    formData.append('data', JSON.stringify(this.teamForm.value));
    console.log(this.teamForm.value)
    if(this.isEdit) {
      this.store.dispatch(new UpdateTeam( this.activatedRoute.snapshot.params['id'] , formData ))
    } else {
      this.store.dispatch(new CreateTeam(formData))
    }

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
