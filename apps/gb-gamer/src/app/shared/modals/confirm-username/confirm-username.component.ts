import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzInputModule} from "ng-zorro-antd/input";
import {RouterLink} from "@angular/router";
import {ButtonComponent} from "../../../components/button/button.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {Store} from "@ngxs/store";
import {HandleError, SetNotifications} from "../../state/global.action";
import {UpdateUser} from "../../../modules/authentication/state/authentication.action";
import {GamerService} from "../../../modules/gamer/service/gamer.service";

@Component({
  selector: 'app-confirm-username',
  standalone: true,
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, NzGridModule, NzInputModule, FormsModule, RouterLink, ButtonComponent],
  templateUrl: './confirm-username.component.html',
  styleUrls: ['./confirm-username.component.scss']
})
export class ConfirmUsernameComponent implements OnInit{
  @Input() username: string;
  @Input() referenceNumber: string;
  constructor(private modalService: NzModalService , private store:Store , private gamerService:GamerService) { }
  ngOnInit() {
  }
  closeModal() {
    this.modalService.closeAll()
  }
  updateUsername() {
    const payload = {username: this.username}
    this.gamerService.changeCustomUpdate(payload).subscribe(res => {
      this.closeModal()
      this.store.dispatch(new SetNotifications('Success', 'your username is updated successfully', 'success'))
      this.store.dispatch(new UpdateUser(res))

    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }
}
