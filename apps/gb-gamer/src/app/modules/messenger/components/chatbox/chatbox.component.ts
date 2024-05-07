import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzInputModule} from "ng-zorro-antd/input";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzGridModule} from "ng-zorro-antd/grid";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {NzIconModule} from "ng-zorro-antd/icon";
import {ca_ES} from "ng-zorro-antd/i18n";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {Observable} from "rxjs";
import {Select} from "@ngxs/store";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzImageModule} from "ng-zorro-antd/image";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {Chat} from "../../modal/messenger";
import {AuthenticationState} from "../../../authentication/state/authentication.state";
import {ChatListComponent} from "../chat-list/chat-list.component";
import {set} from "@angular/fire/database";

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule, NzInputModule, NgxIntlTelInputModule, NzFormModule, NzGridModule, ReactiveFormsModule, TranslateModule, NzIconModule, NzAvatarModule, NzImageModule, NzTypographyModule, ChatListComponent, FormsModule],
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss']
})
export class ChatboxComponent implements AfterViewInit {
  @Input() chat: Chat
  show = true
  @Output() closeChat = new EventEmitter();
  message: string
  isSendingMessage: boolean
  @ViewChild('myInput') myInput: ElementRef;

  constructor(public db: AngularFirestore, public fns: AngularFireFunctions,) {
  }

  showOrHide() {
    this.show = !this.show
  }


  closeChatBox(id: any) {
    this.closeChat.emit(id)
  }

  ngAfterViewInit() {
    if (this.myInput) {
      this.myInput.nativeElement.focus();

    }
  }

  sendMessage() {
    if (!this.isSendingMessage) {
      const data = this.fns.httpsCallable('sendMessage');
      this.isSendingMessage = true
      data({
        authorization: 'Bearer ' + localStorage.getItem('token'),
        type: 'private',
        author: 'user',
        message: this.message,
        group_id: this.chat.id
      }).subscribe(res => {
        this.message = ''
        this.isSendingMessage = false
      }, error => {
        // this.messages.value[isMessageFound]['failed'] = true;
      });
    }
  }
}
