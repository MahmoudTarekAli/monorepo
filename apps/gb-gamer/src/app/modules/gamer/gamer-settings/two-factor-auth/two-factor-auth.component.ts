import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../authentication/services/auth.service";
import {GamerService} from "../../service/gamer.service";
import {HandleError, SetNotifications} from "../../../../shared/state/global.action";
import {Select, Store} from "@ngxs/store";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {ButtonComponent} from "../../../../components/button/button.component";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {TranslateModule} from "@ngx-translate/core";
import {NzListModule} from "ng-zorro-antd/list";
import {NzCardModule} from "ng-zorro-antd/card";
import {AuthenticationState} from "../../../authentication/state/authentication.state";
import {Observable} from "rxjs";
import {User} from "../../../authentication/models/user";
import {SectionComponent} from "../../../../components/section/section.component";
import {NzDividerModule} from "ng-zorro-antd/divider";
// import {NgPasswordValidatorModule, NgPasswordValidatorOptions} from "@gbarena/password-validator";

@Component({
  selector: 'app-two-factor-auth',
  standalone: true,
  imports: [CommonModule, NzStepsModule, ReactiveFormsModule, NzRadioModule, NzGridModule, NzTypographyModule, ButtonComponent, NgxIntlTelInputModule, NzFormModule, NzInputModule, TranslateModule, NzListModule, NzCardModule, SectionComponent, NzDividerModule],
  templateUrl: './two-factor-auth.component.html',
  styleUrls: ['./two-factor-auth.component.scss']
})
export class TwoFactorAuthComponent {
  enable2fa: FormGroup;
  verify2fa: FormGroup;
  changePasswordForm: FormGroup;
  qrImage: string;
  secretKey: string
  backup_codes: any
  isKeyDownloaded = false
  is2faEnabled: boolean;
  isAuthorized: boolean
  currentIndex = 0
  // options:NgPasswordValidatorOptions = {
  //   'placement': 'bottom',
  //   successMessage: ' ',
  //   'rules': {
  //     'password': {
  //       'type': "range",
  //       'min': 8,
  //       'max': 70
  //       // No need to pass min and max
  //     }
  //   },
  //   'shadow': false,
  //   'offset': 15,
  // }
  @Select(AuthenticationState.getUser) user$: Observable<User>;
  hasPassword: boolean

  constructor(private fb: FormBuilder, private gamerService: GamerService, private store: Store) {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;':"<>?]).{8,}$/)]],
    })
  }

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.is2faEnabled = user['2fa_enabled']
        this.hasPassword = user.has_password
        if (user.has_password) {
          this.changePasswordForm.addControl('current_password', this.fb.control('', Validators.required));
        }
      }

    })
    this.enable2fa = this.fb.group({
      otp_method: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.verify2fa = this.fb.group({
      code: ['', [Validators.required]],
    })


  }

  changeUserPassword() {
    if (this.changePasswordForm.invalid){
      return
    }

    this.gamerService.changeUserPassword(this.changePasswordForm.value).subscribe(data => {
      console.log(data)
      this.store.dispatch(new SetNotifications('Success', 'Password Updated Successfully', 'success'))
      this.changePasswordForm.reset()
    }, error => {
      this.store.dispatch(new HandleError(error))

    })
  }

  enableUser2fa() {
    this.gamerService.enableUser2fa(this.enable2fa.value).subscribe(data => {
      this.nextStep()
      if (this.enable2fa.value.otp_method === 'app') {
        this.qrImage = data.qr_code;
        this.secretKey = data.secret
      } else {
        this.store.dispatch(new SetNotifications('Success', 'Success', 'success'))
      }
    })

  }

  verifyUser2fa() {
    this.gamerService.verifyUser2fa(this.verify2fa.value).subscribe(data => {
      this.nextStep()
      this.backup_codes = data.backup_codes;
    })
  }

  downloadKeys() {
    const textDoc = document.createElement('a');
    textDoc.href = 'data:attachment/text,' + encodeURI(this.backup_codes.join('\n'));
    textDoc.target = '_blank';
    textDoc.download = 'GBarena_receovery_code.txt';
    textDoc.click();
    this.isKeyDownloaded = true
  }


  disabled2fa() {
    this.gamerService.disableUser2fa().subscribe(data => {
      this.enable2fa.reset()
      this.verify2fa.reset()
      this.is2faEnabled = false
      this.currentIndex = 0
    })
  }


  moveToIndex(index: number) {
    if (this.currentIndex > index) {
      this.currentIndex = index
    }
  }

  nextStep() {
    this.currentIndex++
  }
}
