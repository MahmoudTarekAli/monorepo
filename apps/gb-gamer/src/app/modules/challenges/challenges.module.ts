import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChallengesRoutingModule } from './challenges-routing.module';
import { ChallengesComponent } from './challenges.component';
import { ChallengeProfileComponent } from './challenge-profile/challenge-profile.component';
import { ChallengesListComponent } from './challenges-list/challenges-list.component';
import {CardListComponent} from "../../shared/components/card-list/card-list.component";
import {
  RadioButtonsFiltersComponent
} from "../../shared/components/radio-buttons-filters/radio-buttons-filters.component";
import {NgxsModule} from "@ngxs/store";
import {ChallengesState} from "./state/challenges.state";
import { ShowPasswordComponent } from './modal/show-password/show-password.component';
import {GamerState} from "../gamer/state/gamer.state";
import {TournamentState} from "../tournament/state/tournament.state";


@NgModule({
  declarations: [
    ChallengesComponent,
  ],
  imports: [
    CommonModule,
    ChallengesRoutingModule,
    RadioButtonsFiltersComponent,
    NgxsModule.forFeature([ChallengesState , GamerState, TournamentState]),

  ]
})
export class ChallengesModule { }
