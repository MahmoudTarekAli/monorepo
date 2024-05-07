import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ButtonComponent} from "../../../../components/button/button.component";
import {TranslateModule} from "@ngx-translate/core";
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-show-password',
  templateUrl: './show-password.component.html',
  styleUrls: ['./show-password.component.scss'],
  imports: [
    FormsModule,
    ButtonComponent,
    TranslateModule
  ],
  standalone: true
})
export class ShowPasswordComponent {
  challengePassword: string = '';
  constructor(private modal:NzModalRef) { }

  confirmChallengeCode() {

    this.modal.close({challengePassword: this.challengePassword , confirm: 'Confirmed'})
  }
}
