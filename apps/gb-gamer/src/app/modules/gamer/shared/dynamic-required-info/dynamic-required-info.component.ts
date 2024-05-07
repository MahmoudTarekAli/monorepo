import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzSelectModule} from "ng-zorro-antd/select";
import {TranslateModule} from "@ngx-translate/core";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {ButtonComponent} from "../../../../components/button/button.component";
import {GamerService} from "../../service/gamer.service";

@Component({
  selector: 'app-dynamic-required-info',
  standalone: true,
  imports: [CommonModule, NzSelectModule, TranslateModule, ReactiveFormsModule, NzFormModule, NzInputModule, ButtonComponent, FormsModule],
  templateUrl: './dynamic-required-info.component.html',
  styleUrls: ['./dynamic-required-info.component.scss']
})
export class DynamicRequiredInfoComponent implements OnInit {
  gameAccountsForm: FormGroup;

  userRequiredInputs: any
  gamerRequiredInputs: any;
  constructor(private readonly fb: FormBuilder , private gamerService:GamerService) {
    this.gameAccountsForm = fb.group({
      user_accounts: this.fb.array([])
    });  }

  ngOnInit() {
    this.gamerService.getRequiredInputs().subscribe(res => {
      this.gamerRequiredInputs = res;
      this.gamerService.getUsersRequiredInputs().subscribe(data => {
        this.userRequiredInputs = data;
        this.addGameAccount()
      })
    })

  }
  get user_accounts(): FormArray {
    return this.gameAccountsForm.get('user_accounts') as FormArray
  }
  addGameAccount() {
    const control = (this.gameAccountsForm.get('user_accounts') as FormArray)
    if (control.length > 0) {
      control.push(this.fb.group ({...this.gamerRequiredInputs[control.length] , value : ''}))

    } else {
      if (this.gamerRequiredInputs.length) {
        control.push(this.fb.group ({...this.gamerRequiredInputs[0] , value : ''}))

      }

    }
    console.log(this.gameAccountsForm.get('user_accounts'))
  }
  deleteItem(index: number) {
    this.user_accounts.removeAt(index)
  }

  saveRequiredInfo(){

  }

}
