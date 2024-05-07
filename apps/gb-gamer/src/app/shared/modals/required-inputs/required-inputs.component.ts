import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {ButtonComponent} from "../../../components/button/button.component";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Select} from "@ngxs/store";
import {AuthenticationState} from "../../../modules/authentication/state/authentication.state";
import {Observable} from "rxjs";
import {User} from "../../../modules/authentication/models/user";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {GamerService} from "../../../modules/gamer/service/gamer.service";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {CountryISO, NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {LeagueAccountsComponent} from "../../components/league-accounts/league-accounts.component";
import {NzAlertModule} from "ng-zorro-antd/alert";

@Component({
  selector: 'app-required-inputs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzGridModule, NzFormModule, NzInputModule, FormsModule, ButtonComponent, NzStepsModule,
    NzDatePickerModule, NgxIntlTelInputModule, LeagueAccountsComponent, NzAlertModule],
  templateUrl: './required-inputs.component.html',
  styleUrls: ['./required-inputs.component.scss']
})
export class RequiredInputsComponent implements OnInit {
  requiredInputsForm: FormGroup;
  @Input() selectedRequiredInputs: any;
  @Input() connectedAccountsRequired: boolean;
  @Input() tournament: any;
  @Input() isTournament: boolean;
  @Select(AuthenticationState.getUser) user$: Observable<User>;
  profileForm: FormGroup;
  isAdditionalData = false
  isEdit = false;
  steps = []
  @Input() selectedAccount
  protected readonly CountryISO = CountryISO;
  @Input() userSlug: string;
  constructor(private formBuilder: FormBuilder, private modal: NzModalRef , private gamerService:GamerService) {
    this.requiredInputsForm = this.formBuilder.group({
      userSupportedRequiredInputsKey: formBuilder.array([], Validators.required)
    });
  }

  currentStep = 0;

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({})

    console.log(this.selectedRequiredInputs)
    if (this.selectedRequiredInputs.length > 0) {
      this.selectedRequiredInputs.forEach((item: any) => {
        this.addRequiredInputs(item)
      });
    }
    this.user$.subscribe(user => {
      if (user) {
        console.log(user)
        if (!user.birthdate) {
          this.addFormControl('birthdate')
        }
        if (!user.phone) {
          this.addFormControl('phone')
        }
        // if (!user.gender) {
        //   this.addFormControl('gender')
        // }
      }
      this.getStepsCount()

    })


  }

  addFormControl(control: string) {
    const newControl = new FormControl('' , Validators.required);
    this.profileForm.addControl(control, newControl);
    this.steps = [0 , 1]
    this.isAdditionalData = true
    console.log(this.profileForm)
  }

  RequiredInputs(): FormArray {
    return this.requiredInputsForm.get('userSupportedRequiredInputsKey') as FormArray
  }

  addRequiredInputs(payload: any) {
    const control = this.requiredInputsForm.get('userSupportedRequiredInputsKey') as FormArray;
    const newFormGroup = this.formBuilder.group(payload);
    // Set Validators.required for each form control in the group
    Object.keys(newFormGroup.controls).forEach((key) => {
      if (key == 'value') {
        newFormGroup.get(key).setValidators(Validators.required);
      }
    });

    control.push(newFormGroup);
  }
  updateProfile() {
    if (this.profileForm.invalid) {
      return
    }
    if (typeof this.profileForm.value.birthdate !== 'number' ) {
      this.profileForm.get('birthdate')?.setValue(this.profileForm.value.birthdate?.getTime())
    }
    this.profileForm.get('phone')?.setValue(this.profileForm?.value?.phone?.e164Number)
    const formData = new FormData()
    formData.append('data' ,  JSON.stringify(this.profileForm.value))
    this.gamerService.updateProfile(formData).subscribe(res => {
      if (this.currentStep === this.steps[this.steps.length - 1]){
        const data = {requiredInputs: this.RequiredInputs().value, required_accounts:this.selectedAccount ,  action: 'confirm'}
        this.modal.close(data)

      } else {
        this.currentStep += 1
      }
    })
  }
  submitRequiredInputs() {
    if (this.requiredInputsForm.invalid) {
      return
    }
    const data = {requiredInputs: this.RequiredInputs().value, required_accounts:this.selectedAccount ,  action: 'confirm'}
    this.modal.close(data)
  }
  submit() {
    const data = {requiredInputs: this.RequiredInputs().value, required_accounts:this.selectedAccount ,  action: 'confirm'}
    this.modal.close(data)
  }
  selectAccount(account: any) {
    this.selectedAccount = account
  }
  getStepsCount() {
    // get steps counts depends on this data
    const isAdditionalData = this.isAdditionalData && !this.isEdit ? 0 : false
    const isAccount = this.connectedAccountsRequired ? 1 : false
    const isRequiredInputs = this.selectedRequiredInputs.length > 0 ? 2 : false

    this.steps = [isAdditionalData  , isAccount, isRequiredInputs ]
    this.steps = this.steps.filter(item => (item === 0 || item !== false ))
    console.log(this.steps)
    this.currentStep = this.steps[0]

  }
  nextStep(isForced = false) {
    if (isForced) {
      this.currentStep += 1
      return;
    }
    if (this.selectedAccount) {
      this.currentStep += 1
      return;
    }
    return
  }
}
