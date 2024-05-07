import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TournamentsRoutingModule} from './tournaments-routing.module';
import {TournamentsComponent} from './tournaments.component';
import {TournamentService} from "./services/tournament.service";


@NgModule({
  declarations: [
    TournamentsComponent
  ],
  imports: [
    CommonModule,
    TournamentsRoutingModule,

  ],
  providers: [TournamentService]
})

export class TournamentsModule {
}
