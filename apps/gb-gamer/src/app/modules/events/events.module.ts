import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EventsRoutingModule} from './events-routing.module';
import {SliceArrayPipe} from "../../shared/pipes/sliceArray.pipe";
import {EventCardComponent} from "../../shared/components/event-card/event-card.component";
import {EventDetailsComponent} from './event-details/event-details.component';
import {NgxsModule} from "@ngxs/store";
import {EventState} from "./state/event.state";
import {BannerCardComponent} from "../../shared/components/banner-card/banner-card.component";
import {AdBannerComponent} from "../../shared/components/ad-banner/ad-banner.component";
import {SectionComponent} from "../../components/section/section.component";
import {GameCardComponent} from "../../shared/components/game-card/game-card.component";
import {TournamentCardComponent} from "../../shared/components/tournament-card/tournament-card.component";
import {ChallengeCardComponent} from "../../shared/components/gb-card/challenge-card.component";
import {
  RadioButtonsFiltersComponent
} from "../../shared/components/radio-buttons-filters/radio-buttons-filters.component";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {FormsModule} from "@angular/forms";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {LoadingIndicatorComponent} from "../../shared/components/loading-indicator/loading-indicator.component";
import {GamesState} from "../games/state/games.state";
import {ButtonComponent} from "../../components/button/button.component";
import {TranslateModule} from "@ngx-translate/core";
import {CountdownPipe} from "../../shared/pipes/countdown.pipe";


@NgModule({
  declarations: [
    EventDetailsComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SliceArrayPipe,
    EventCardComponent,
    NgxsModule.forFeature([EventState, GamesState]),
    BannerCardComponent,
    AdBannerComponent,
    SectionComponent,
    GameCardComponent,
    TournamentCardComponent,
    ChallengeCardComponent,
    RadioButtonsFiltersComponent,
    NzRadioModule,
    FormsModule,
    NzPaginationModule,
    LoadingIndicatorComponent,
    ButtonComponent,
    TranslateModule,
    CountdownPipe
  ]
})
export class EventsModule {
}
