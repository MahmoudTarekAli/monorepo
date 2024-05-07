import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TournamentSummaryRoutingModule } from './tournament-summary-routing.module';
import { TournamentSummaryComponent } from './tournament-summary.component';
import {AdBannerComponent} from "../../../shared/components/ad-banner/ad-banner.component";
import {InfoCardComponent} from "../../../shared/components/info-card/info-card.component";
import {SectionComponent} from "../../../components/section/section.component";
import {ParticipantCardComponent} from "../../../shared/components/participant-card/participant-card.component";
import {SafeHtmlPipe} from "../../../shared/pipes/safe-html";
import {OrdinalNumbers} from "../../../shared/pipes/ordinal-numbers";
import {NzListModule} from "ng-zorro-antd/list";
import {ButtonComponent} from "../../../components/button/button.component";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {PrizeCardComponent} from "../../../shared/components/prize-card/prize-card.component";
import {QuillViewHTMLComponent} from "ngx-quill";
import {TimelineComponent} from "../../../shared/components/timeline/timeline.component";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzModalModule} from "ng-zorro-antd/modal";
import {WinnersComponent} from "../winners/winners.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgScrollbar} from "ngx-scrollbar";


@NgModule({
  declarations: [
    TournamentSummaryComponent
  ],
  imports: [
    CommonModule,
    TournamentSummaryRoutingModule,
    AdBannerComponent,
    InfoCardComponent,
    SectionComponent,
    ParticipantCardComponent,
    SafeHtmlPipe,
    OrdinalNumbers,
    NzListModule,
    ButtonComponent,
    NzStepsModule,
    PrizeCardComponent,
    QuillViewHTMLComponent,
    TimelineComponent,
    NzIconModule,
    NzButtonModule,
    NzWaveModule,
    NzModalModule,
    WinnersComponent,
    TranslateModule,
    NgScrollbar
  ]
})
export class TournamentSummaryModule { }
