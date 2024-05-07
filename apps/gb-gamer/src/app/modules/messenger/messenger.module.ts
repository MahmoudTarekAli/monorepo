import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessengerRoutingModule } from './messenger-routing.module';
import { MessengerComponent } from './messenger.component';
import {SectionComponent} from "../../components/section/section.component";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {MarqueeComponent} from "../../shared/components/marquee/marquee.component";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {ChatboxComponent} from "./components/chatbox/chatbox.component";
import {ChatListComponent} from "./components/chat-list/chat-list.component";
import {ConversationListComponent} from "./components/conversation-list/conversation-list.component";
import {LoadingIndicatorComponent} from "../../shared/components/loading-indicator/loading-indicator.component";
import {PlaceHolderComponent} from "../../shared/components/place-holder/place-holder.component";
import {NzInputModule} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    MessengerComponent
  ],
    imports: [
        CommonModule,
        MessengerRoutingModule,
        SectionComponent,
        NzDividerModule,
        ChatboxComponent,
        MarqueeComponent,
        NzTypographyModule,
        ChatListComponent,
        ConversationListComponent,
        LoadingIndicatorComponent,
        PlaceHolderComponent,
        NzInputModule,
        FormsModule,
        TranslateModule
    ]
})
export class MessengerModule { }

