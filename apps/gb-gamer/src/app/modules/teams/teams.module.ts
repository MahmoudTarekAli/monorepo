import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamsRoutingModule } from './teams-routing.module';
import {NgxsModule} from "@ngxs/store";
import {TeamState} from "./state/team.state";
import {GamesState} from "../games/state/games.state";
import {AuthenticationState} from "../authentication/state/authentication.state";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    NgxsModule.forFeature([TeamState, GamesState, AuthenticationState])
  ]
})
export class TeamsModule { }
