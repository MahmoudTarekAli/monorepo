import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BracketsViewRoutingModule} from './brackets-view-routing.module';
import {BracketsViewComponent} from './brackets-view.component';
import {NgxsModule} from "@ngxs/store";
import {MatchListState} from "../match-list/state/match-list.state";
import {BracketViewState} from "./state/bracket-view.state";
import {SharedModule} from "../../../../shared/shared.module";
import {ManageTournamentsModule} from "../manage-tournaments.module";
import {FormsModule} from "@angular/forms";
import {LoadingIndicatorModule} from "../../../../shared/components/loading-indicator/loading-indicator.module";
import {MatchListModule} from "../match-list/match-list.module";


@NgModule({
  declarations: [
    BracketsViewComponent
  ],
  imports: [
    CommonModule,
    BracketsViewRoutingModule,
    NgxsModule.forFeature([MatchListState, BracketViewState]),
    SharedModule,
    ManageTournamentsModule,
    FormsModule,
    LoadingIndicatorModule,
    MatchListModule
  ]
})
export class BracketsViewModule {
}
