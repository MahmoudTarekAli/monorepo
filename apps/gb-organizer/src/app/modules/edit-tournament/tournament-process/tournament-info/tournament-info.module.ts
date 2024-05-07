import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TournamentInfoRoutingModule } from './tournament-info-routing.module';
import { TournamentInfoComponent } from './tournament-info.component';
import {CreateTournamentModule} from "../../../tournaments/create-tournament/create-tournament.module";


@NgModule({
  declarations: [
    TournamentInfoComponent
  ],
  imports: [
    CommonModule,
    TournamentInfoRoutingModule,
    CreateTournamentModule
  ]
})
export class TournamentInfoModule { }
