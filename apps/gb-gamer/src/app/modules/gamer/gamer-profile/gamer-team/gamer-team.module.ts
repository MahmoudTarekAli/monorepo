import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamerTeamRoutingModule } from './gamer-team-routing.module';
import { GamerTeamComponent } from './gamer-team.component';
import {TeamState} from "../../../teams/state/team.state";
import {NgxsModule} from "@ngxs/store";


@NgModule({
  declarations: [
    GamerTeamComponent
  ],
  imports: [
    CommonModule,
    GamerTeamRoutingModule,
    NgxsModule.forFeature([TeamState])
  ]
})
export class GamerTeamModule { }
