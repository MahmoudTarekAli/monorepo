import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {OpenChatBox, SetActiveChat} from "./state/messenger.action";
import {HomeService} from "../home/service/home.service";
import {user} from "@angular/fire/auth";
import {Chat, chatbox} from "./modal/messenger";
import {User} from "../authentication/models/user";
import {MessengerState} from "./state/messenger.state";
import {Observable, skip, switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireFunctions} from "@angular/fire/compat/functions";

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss']
})
export class MessengerComponent implements OnInit, AfterViewInit {
  @Select(MessengerState.getChatList) chatList$: Observable<chatbox[]>;
  @Select(MessengerState.getActiveChat) activeChat$: Observable<Chat>;
  @Select(MessengerState.getMessages) messagesList$: Observable<Chat[]>;
  chatboxesLength: number
  chatId: string
  isMobileView: boolean
  messageSent: string
  isSendingMessage: boolean
  @ViewChild('myInput') myInput: ElementRef;

  constructor(private activatedRoute: ActivatedRoute,
              public fns: AngularFireFunctions,
              private store: Store, private router: Router, public db: AngularFirestore,) {
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting
      this.isMobileView = state.isMobileView;
    });
  }

  ngOnInit() {
    this.chatList$.subscribe((chatboxes: chatbox[]) => {
      this.chatboxesLength = chatboxes.length
    })
    this.activatedRoute.params.pipe(
      switchMap(params => {
        this.chatId = params['id'];
        return this.messagesList$
      })
    ).subscribe(chatList => {
      if (chatList.length > 0) {
        const chat = chatList.find(chat => chat.id === this.chatId);
        if (this.chatId) {
          this.store.dispatch(new SetActiveChat(chat))
        } else {
          this.router.navigateByUrl(`/messages/${chatList[0].id}`)
          this.store.dispatch(new SetActiveChat(chatList[0]))
        }
      }
    });
  }

  ngAfterViewInit() {

  }

  chatCreated(){
    console.log('sdhss')
    this.myInput.nativeElement.focus();
  }
  sendMessage(message?: any) {
    if (!this.isSendingMessage) {

      const data = this.fns.httpsCallable('sendMessage');
      this.isSendingMessage = true
      data({
        authorization: 'Bearer ' + localStorage.getItem('token'),
        type: 'private',
        author: 'user',
        message: this.messageSent,
        group_id: this.chatId
      }).subscribe(res => {
        this.messageSent = ''
        this.isSendingMessage = false
      }, error => {
        // this.messages.value[isMessageFound]['failed'] = true;
      });
    }
  }

}
