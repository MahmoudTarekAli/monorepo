import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChallengesRoutingModule } from './challenges-routing.module';
import { ChallengesComponent } from './challenges.component';
import {NgxsModule} from "@ngxs/store";
import {ChallengesState} from "./state/challenges.state";
import {TournamentProcessState} from "../edit-tournament/tournament-process/state/tournament-process.state";


@NgModule({
  declarations: [
    ChallengesComponent
  ],
  imports: [
    CommonModule,
    ChallengesRoutingModule,
    NgxsModule.forFeature([ChallengesState , TournamentProcessState]),

  ]
})
export class ChallengesModule { }
