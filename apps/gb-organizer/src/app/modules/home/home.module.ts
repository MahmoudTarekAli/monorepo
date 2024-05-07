import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import {NgxsModule} from "@ngxs/store";
import {ChallengesState} from "../challenges/state/challenges.state";
import {TournamentProcessState} from "../edit-tournament/tournament-process/state/tournament-process.state";


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgxsModule.forFeature([ChallengesState , TournamentProcessState]),

  ]
})
export class HomeModule { }
