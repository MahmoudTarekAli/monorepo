import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiotRamadanRoutingModule } from './riot-ramadan-routing.module';
import { RiotRamadanComponent } from './riot-ramadan.component';
import {QuestsComponent} from "./components/quests/quests.component";
import {TournamentCardComponent} from "../../shared/components/tournament-card/tournament-card.component";
import {NgxsModule} from "@ngxs/store";
import {EventState} from "../events/state/event.state";
import {ChallengeCardComponent} from "../../shared/components/gb-card/challenge-card.component";
import {ButtonComponent} from "../../components/button/button.component";
import {ProductCardComponent} from "../../shared/components/product-card/product-card.component";
import {SectionComponent} from "../../components/section/section.component";
import {TranslateModule} from "@ngx-translate/core";
import {LoadingIndicatorComponent} from "../../shared/components/loading-indicator/loading-indicator.component";
import { RiotChallengesListComponent } from './riot-challenges-list/riot-challenges-list.component';
import {FaqComponent} from "./components/faq/faq.component";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzWaveModule} from "ng-zorro-antd/core/wave";


@NgModule({
  declarations: [
    RiotRamadanComponent
  ],
  imports: [
    CommonModule,
    RiotRamadanRoutingModule,
    QuestsComponent,
    TournamentCardComponent,
    NgxsModule.forFeature([EventState]),
    ChallengeCardComponent,
    ButtonComponent,
    ProductCardComponent,
    SectionComponent,
    TranslateModule,
    LoadingIndicatorComponent,
    FaqComponent,
    NzButtonModule,
    NzWaveModule,
  ]
})
export class RiotRamadanModule { }
