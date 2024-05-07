import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Pipe} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {Select, Store} from "@ngxs/store";
import {MessengerState} from "../../state/messenger.state";
import {distinctUntilChanged, Observable, skip, switchMap} from "rxjs";
import {Chat, chatbox} from "../../modal/messenger";
import {OpenChatBox, SetActiveChat} from "../../state/messenger.action";
import {HomeService} from "../../../home/service/home.service";
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from "@angular/router";
import {TimeAgoExtendsPipe} from "../../../../shared/pipes/timeAgo.pipe";
import {User} from "../../../authentication/models/user";
import {AngularFireFunctions} from "@angular/fire/compat/functions";
import {TruncatePipe} from "../../../../shared/pipes/truncate.pipe";
import {PlaceHolderComponent} from "../../../../shared/components/place-holder/place-holder.component";
import {TranslateModule} from "@ngx-translate/core";


@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule, NzTypographyModule, TimeAgoExtendsPipe, RouterLink, TruncatePipe, PlaceHolderComponent, TranslateModule],
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss'],

})
export class ConversationListComponent implements OnInit {
  @Select(MessengerState.getMessages) messagesList$: Observable<Chat[]>;
  @Input() chatId: string
  chat: Chat | undefined
  @Output() chatClick = new EventEmitter();
  @Input() selectedChat: Chat | undefined
  user: User
  @Select(MessengerState.getChatList) chatList$: Observable<chatbox[]>;
  chatboxes: chatbox[]
  @Input() link = true
  isMobileView: boolean

  constructor(private store: Store, private homeService: HomeService, private router: Router,
              private activatedRoute: ActivatedRoute, public fns: AngularFireFunctions,) {
  }

  ngOnInit() {
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting
      this.isMobileView = state.isMobileView;
    });
    this.store.select(state => state.user.user).subscribe(user => {
      this.user = user
    })
    this.chatList$.subscribe((chatboxes: chatbox[]) => {
      this.chatboxes = chatboxes

    })
  }


  openChat(chat: Chat) {
    console.log(chat)
    this.chat = chat
    this.store.dispatch(new SetActiveChat(this.chat))
    if (this.isMobileView) {
      this.router.navigateByUrl(`/messages/${chat.id}/chat-list`)

    } else {
      if (!this.router.url.includes('messages')) {
        console.log('here')
        this.chatClick.emit()
        if (!this.chatboxes.some(chatBoxes => chatBoxes.chat.id === chat.id)) {
          this.store.dispatch(new OpenChatBox(<chatbox>{chat: chat, show: true}))
        }
      } else {
        this.router.navigateByUrl(`/messages/${chat.id}`)

      }
    }
    const data = this.fns.httpsCallable('readMessage');
    data({
      authorization: 'Bearer ' + localStorage.getItem('token'),
      group_id: chat.id,
    }).subscribe(res => {

      return res;
    })
  }


  protected readonly console = console;
}
