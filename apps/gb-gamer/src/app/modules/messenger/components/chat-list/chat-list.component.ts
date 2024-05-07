import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {Chat, ChatMessage} from "../../modal/messenger";
import {Select, Store} from "@ngxs/store";
import {AuthenticationState} from "../../../authentication/state/authentication.state";
import {BehaviorSubject, Observable, ReplaySubject, Subject, Subscription, takeUntil} from "rxjs";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzImageModule} from "ng-zorro-antd/image";
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from "@angular/router";
import {QuillViewHTMLComponent} from "ngx-quill";
import {NzInputModule} from "ng-zorro-antd/input";
import {GlobalService} from "../../../../shared/service/global.service";
// import {VirtualScrollerComponent} from "ngx-virtual-scroller";
import {LoadingIndicatorComponent} from "../../../../shared/components/loading-indicator/loading-indicator.component";
import {set} from "@angular/fire/database";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {TimeAgoExtendsPipe} from "../../../../shared/pipes/timeAgo.pipe";
import {FormsModule} from "@angular/forms";
import {MessengerState} from "../../state/messenger.state";

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule, NzAvatarModule, NzImageModule, QuillViewHTMLComponent, NzInputModule, LoadingIndicatorComponent, NzDividerModule, TimeAgoExtendsPipe, FormsModule, RouterLink],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {
  @Input() chat: Chat | any
  messages: ChatMessage[] = []
  @Select(AuthenticationState.getUser) getUser: Observable<any>;
  link = false
  chatId: string
  private messageListenerSubscription: () => void;
  // @ViewChild(VirtualScrollerComponent) private virtualScroller: VirtualScrollerComponent;
  loading: boolean
  isMobileView: boolean
  @Input() isChatbox: boolean
  messageSent: string
  isSendingMessage: boolean
  @Output() chatCreated = new EventEmitter();
  @Select(MessengerState.getActiveChat) activeChat$: Observable<Chat>;

  constructor(public db: AngularFirestore,
              private router: Router,
              private globalService: GlobalService,
              private activatedRoute: ActivatedRoute,
              public fns: AngularFireFunctions,
              private cdRef: ChangeDetectorRef,
              private store: Store
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.messages = []
      if (this.router.url.includes('messages')) {
        this.chatId = params['id']
        this.unsubscribeFromMessageListener(); // Unsubscribe from previous listener
        this.getChatList(params['id'])
      }
    });
  }

  ngOnInit() {
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting
      this.isMobileView = state.isMobileView;
    });

    if (this.isMobileView) {
      this.activeChat$.subscribe(data => {
      })
      this.db.collection('groups').doc(this.activatedRoute.snapshot.params['id']).ref.onSnapshot(snapshot => {
        this.chat = snapshot.data()
        this.db.collection('tournaments').doc(snapshot.get('tournament_code')).ref.onSnapshot(res => {
          this.chat.avatar = res.get('avatar')
          this.chat.name = res.get('name')
        })
        let userData: any
        const userId = parseInt(localStorage.getItem('User'));
        if (snapshot.data()['members'].find((num: any) => num !== userId)) {
          this.globalService.getUsersByIds([snapshot.data()['members'].find((num: any) => num !== userId)]).then(user => {
            this.chat = {
              ...this.chat, ...(user !== undefined && {
                name: user[0].username,
                avatar: user[0].avatar,
                userId: user[0].id
              })
            }
          });

        } else {
          if (this.chat.type === 'tournament_message') {
            this.chat = {
              ...this.chat, ...({
                name: 'Tournament Message',
                // avatar: user[0].avatar,
                // userId: user[0].id
              })
            }
          }
          if (this.chat.type === 'marketing') {
            this.chat = {
              ...this.chat, ...({
                name: 'Promoted Message',
                // avatar: user[0].avatar,
                // userId: user[0].id
              })
            }
          }

        }

      })
    }
    this.link = this.router.url.includes('messages')
    if (!this.router.url.includes('messages')) {
      this.getChatList(this.chat.id)
    }
  }


  getChatList(id: string) {
    this.loading = true
    this.messageListenerSubscription = this.db.collection('message').doc(id).collection('messages').ref.orderBy('created_at', 'asc').limitToLast(20).onSnapshot(res => {
      res.docChanges().forEach(data => {
        if (data.type === 'added') {
          if (!this.router.url.includes('messages')) {
            this.messages.push(<ChatMessage>data.doc.data())
          } else {
            if (data.doc.ref.parent.parent?.id === this.chatId) {
              this.messages.push(<ChatMessage>data.doc.data())
              this.chatCreated.emit()

            }
          }
        }
      })
      // Stop loading here after receiving messages
      this.loading = false;
      // Call focusOnAnItem function after receiving messages
      this.focusOnAnItem();
    })

    const data = this.fns.httpsCallable('readMessage');
    data({
      authorization: 'Bearer ' + localStorage.getItem('token'),
      group_id: id,
    }).subscribe(res => {
      return res;
    })
  }

  focusOnAnItem() {
    // if (this.virtualScroller) {
    //   this.virtualScroller.scrollToIndex(this.messages.length - 1);
    //   this.cdRef.detectChanges(); // Manually trigger change detection
    //
    // }
  }

  unsubscribeFromMessageListener() {
    if (this.messageListenerSubscription) {
      this.messageListenerSubscription();
      // this.messages = [];
    }
  }


  sendMessage(message?: any) {
    if (!this.isSendingMessage) {

      this.isSendingMessage = true
      const data = this.fns.httpsCallable('sendMessage');
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
