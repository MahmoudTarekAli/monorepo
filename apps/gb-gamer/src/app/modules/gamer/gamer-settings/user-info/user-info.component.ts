import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {CountryISO} from "ngx-intl-tel-input";
import {NzInputModule} from "ng-zorro-antd/input";
import {TranslateModule} from "@ngx-translate/core";
import {Select, Store} from "@ngxs/store";
import {AuthenticationState} from "../../../authentication/state/authentication.state";
import {Observable} from "rxjs";
import {User} from "../../../authentication/models/user";
import {DefaultImagePipe} from "../../../../shared/pipes/default-image.pipe";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzModalModule, NzModalService} from "ng-zorro-antd/modal";
import {base64ToFile, ImageCropperModule} from "ngx-image-cropper";
import {ButtonComponent} from "../../../../components/button/button.component";
import {GamerService} from "../../service/gamer.service";
import {UpdateUser} from "../../../authentication/state/authentication.action";
import {UploadPhotosComponent} from "../../../../shared/components/upload-photos/upload-photos.component";
import {HandleError, SetNotifications} from "../../../../shared/state/global.action";
import {VerifyPasswordComponent} from "../../../../shared/modals/verify-password/verify-password.component";
import {NzSelectModule} from "ng-zorro-antd/select";
import {GlobalState} from "../../../../shared/state/global.state";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {GlobalService} from "../../../../shared/service/global.service";
import {CountryNamePipe} from "../../../../shared/pipes/country-name.pipe";


@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, NzFormModule, ReactiveFormsModule, NzDatePickerModule, NgxIntlTelInputModule, NzInputModule, TranslateModule, DefaultImagePipe, NzButtonModule, NzModalModule, ImageCropperModule, ButtonComponent, UploadPhotosComponent, NzSelectModule, NzDividerModule, CountryNamePipe],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit{
  [key: string]: any;
  profileForm: FormGroup;
  protected readonly CountryISO = CountryISO;
  avatar: any
  cover: any
  imageSelected:any
  @Select(AuthenticationState.getUser) userData$: Observable<User>;
  @Select(GlobalState.getCountriesList) Countries: Observable<any>;
  oneYearLater:any;
  userChangeNameDate: any;
  isFormDirty: boolean = true
  changeUserNameAvailability: boolean = false;
  customUpdatesForm:FormGroup
  constructor(private fb:FormBuilder , private gamerService:GamerService , private store:Store , private modalService: NzModalService, private globalService:GlobalService) {
    this.profileForm = fb.group({
      // username: ['' , Validators.compose([Validators.required])],
      email: ['' ,Validators.compose([Validators.email])],
      phone: [null],
      bio: [''],
      birthdate: [''],
      country: ['']
    })
    this.customUpdatesForm = fb.group({
      username: ['' ],
      reference_number: ['']

    })
  }


  ngOnInit() {
    this.userData$.subscribe(data => {
      this.profileForm.patchValue(data)
      this.avatar = data.avatar
      this.cover = data.cover_picture
      const userNameChangeDate = new Date(data.username_changed_at)
      const oneYearLater = new Date(userNameChangeDate);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      this.changeUserNameAvailability = userNameChangeDate < oneYearLater
      console.log(this.changeUserNameAvailability)

      }
    )
    this.profileForm.valueChanges.subscribe(data => {
      if (data.phone === null && this.isFormDirty) {
        this.profileForm.markAsPristine()
        this.isFormDirty = false
      }
      // console.log(this.profileForm.dirty)

    })
  }



  getChangedFormValues(): any {
    const changedValues: any = {};
    for (const controlName in this.profileForm.controls) {
      const control = this.profileForm.get(controlName);

      if (control?.dirty) {
        changedValues[controlName] = control.value;
      }
    }
    return changedValues;
  }

  submitProfile() {
    if(this.profileForm.invalid || !this.profileForm.dirty) {
      return
    }

    if (typeof this.profileForm.value.birthdate !== 'number' ) {
      this.profileForm.get('birthdate')?.setValue(this.profileForm.value.birthdate?.getTime())
    }

    this.profileForm.get('phone')?.setValue(this.profileForm?.value?.phone?.e164Number)

    const formData = new FormData();
    if(this.imageSelected?.avatar ){
      formData.append('avatar', this.imageSelected.avatar);
    }
    if(this.imageSelected?.cover ){
      formData.append('cover', this.imageSelected.cover);
    }
    if(this.profileForm.get('email')?.dirty && this.profileForm.get('email')?.value !== ''){
      this.modalService.create({
        nzContent: VerifyPasswordComponent,
        nzClassName:'challenge-modal h-auto',
        nzFooter: null,
        nzCentered: true,
        nzWidth: '600px',
      }).afterClose.subscribe((result: any) => {
        if(result?.action === 'confirm') {
          // add current_password to profileForm
          this.profileForm.get('phone')?.setValue(this.profileForm.value?.phone?.e164Number)
          this.profileForm.value.current_password = result.current_password
          console.log(this.profileForm.value)
          formData.append('data', JSON.stringify(this.profileForm.value));
          this.updateProfile(formData)
        }
      })
    } else {
      formData.append('data', JSON.stringify(this.getChangedFormValues()));

      this.updateProfile(formData)
    }
    console.log(this.getChangedFormValues())

  }

  updateProfile(formData:any) {
    this.gamerService.updateProfile(formData).subscribe(res => {
      console.log(res)
      const payload = {
        ...this.profileForm.value,
        avatar: this.avatar,
        cover_picture: this.cover,
      }
      this.store.dispatch(new SetNotifications('Success', 'your profile is updated successfully', 'success'))
      this.store.dispatch(new UpdateUser(res))

    } , error => {
      this.store.dispatch(new HandleError(error))
    })
  }
  changeCustomUpdates(){
    console.log(this.customUpdatesForm.invalid , !this.customUpdatesForm.dirty)
    if(this.customUpdatesForm.invalid || !this.customUpdatesForm.dirty) {
      console.log('here')
      return
    }
    this.globalService.removeEmptyKeys(this.customUpdatesForm.value)

    this.gamerService.changeCustomUpdate(this.customUpdatesForm.value).subscribe(res => {
      this.store.dispatch(new SetNotifications('Success', 'your profile is updated successfully', 'success'))
      this.store.dispatch(new UpdateUser(res))

    } , error => {
      console.log(error)
      this.store.dispatch(new HandleError(error))
    })
  }
  selectImages($event: any) {
    this.imageSelected = {...this.imageSelected , ...$event}
    console.log(this.imageSelected)
    if($event?.avatarImageHolder){
      this.avatar = $event.avatarImageHolder
    }
    if($event?.coverImageHolder){
      this.cover = $event.coverImageHolder
    }

  }

}
