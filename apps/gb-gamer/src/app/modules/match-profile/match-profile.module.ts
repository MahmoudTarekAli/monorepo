import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatchProfileRoutingModule } from './match-profile-routing.module';
import {MatchChatComponent} from "./match-chat/match-chat.component";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzDividerModule} from "ng-zorro-antd/divider";
// import {VirtualScrollerModule} from "ngx-virtual-scroller";
import {NzInputModule} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzResultModule} from "ng-zorro-antd/result";
import {NzImageModule} from "ng-zorro-antd/image";
import {NzIconModule} from "ng-zorro-antd/icon";
import {TranslateModule} from "@ngx-translate/core";
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {TruncatePipe} from "../../shared/pipes/truncate.pipe";
import {LoadingIndicatorComponent} from "../../shared/components/loading-indicator/loading-indicator.component";
import {NgxsModule} from "@ngxs/store";
import {MatchListState} from "../tournament/match-list/state/match-list.state";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {ButtonComponent} from "../../components/button/button.component";
import {CountryPipe} from "../../shared/pipes/country.pipe";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {NzGridModule} from "ng-zorro-antd/grid";
import {RemoveSpacesPipe} from "../../shared/pipes/remove-spaces.pipe";
import {DefaultImagePipe} from "../../shared/pipes/default-image.pipe";
import {MarqueeComponent} from "../../shared/components/marquee/marquee.component";
import {UserTimezoneComponent} from "../../components/user-timezone/user-timezone.component";


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
        NzSpaceModule,
        NzResultModule,
        NzImageModule,
        NzIconModule,
        TranslateModule,
        NzPageHeaderModule,
        TruncatePipe,
        LoadingIndicatorComponent,
        NgxsModule.forFeature([MatchListState]),
        NzToolTipModule,
        ButtonComponent,
        CountryPipe,
        NzTypographyModule,
        NzGridModule,
        RemoveSpacesPipe,
        DefaultImagePipe,
        MarqueeComponent,
        UserTimezoneComponent,

    ]
})
export class MatchProfileModule { }
