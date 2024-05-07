import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatchProfileRoutingModule } from './match-profile-routing.module';
import {MatchChatComponent} from "./match-chat/match-chat.component";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {VirtualScrollerModule} from "ngx-virtual-scroller";
import {NzInputModule} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzButtonModule} from "ng-zorro-antd/button";
import {SharedModule} from "../../shared/shared.module";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzResultModule} from "ng-zorro-antd/result";
import {LoadingIndicatorModule} from "../../shared/components/loading-indicator/loading-indicator.module";
import {NzImageModule} from "ng-zorro-antd/image";
import {NzListModule} from "ng-zorro-antd/list";


@NgModule({
  declarations: [
    MatchChatComponent
  ],
    imports: [
        CommonModule,
        MatchProfileRoutingModule,
        NzAvatarModule,
        NzDividerModule,
        // VirtualScrollerModule,
        NzInputModule,
        FormsModule,
        NzModalModule,
        NzButtonModule,
        SharedModule,
        NzSpaceModule,
        NzResultModule,
        LoadingIndicatorModule,
        NzImageModule,
        NzListModule
    ]
})
export class MatchProfileModule { }
