import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import {SectionComponent} from "../../components/section/section.component";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NgxsModule} from "@ngxs/store";
import {SearchState} from "./state/search.state";
import {ParticipantCardComponent} from "../../shared/components/participant-card/participant-card.component";
import {ButtonComponent} from "../../components/button/button.component";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {TournamentCardComponent} from "../../shared/components/tournament-card/tournament-card.component";
import {ArenaCardComponent} from "../../shared/components/arena-card/arena-card.component";
import {GameCardComponent} from "../../shared/components/game-card/game-card.component";
import {SliceArrayPipe} from "../../shared/pipes/sliceArray.pipe";
import {FormsModule} from "@angular/forms";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {LoadingIndicatorComponent} from "../../shared/components/loading-indicator/loading-indicator.component";
import {NzInputModule} from "ng-zorro-antd/input";
import {EventCardComponent} from "../../shared/components/event-card/event-card.component";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {TranslateModule} from "@ngx-translate/core";
import {NgScrollbar} from "ngx-scrollbar";


@NgModule({
  declarations: [
    SearchComponent
  ],
    imports: [
        CommonModule,
        SearchRoutingModule,
        SectionComponent,
        NzRadioModule,
        NgxsModule.forFeature([SearchState]),
        ParticipantCardComponent,
        ButtonComponent,
        NzDividerModule,
        TournamentCardComponent,
        ArenaCardComponent,
        GameCardComponent,
        SliceArrayPipe,
        FormsModule,
        NzPaginationModule,
        LoadingIndicatorComponent,
        NzInputModule,
        EventCardComponent,
        NzButtonModule,
        NzIconModule,
        TranslateModule,
        NgScrollbar,
    ]
})
export class SearchModule { }
