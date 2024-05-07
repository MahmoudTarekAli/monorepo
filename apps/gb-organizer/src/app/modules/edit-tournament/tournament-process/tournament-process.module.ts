import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TournamentProcessRoutingModule} from './tournament-process-routing.module';
import { NgxsModule } from '@ngxs/store'
import { TournamentProcessState, TournamentProcessStateModel } from './state/tournament-process.state';
import { TournamentProcessComponent } from './tournament-process.component';
import {ManageTournamentState} from "../manage-tournaments/state/manage-tournament.state";
import {CanActivateUserAuthority} from "../../authentication/auth-guard/is-user-approved.guard";


@NgModule({
  declarations: [
    TournamentProcessComponent,
  ],
  imports: [
    CommonModule,
    TournamentProcessRoutingModule,
  ],
  providers: [CanActivateUserAuthority]
})
export class TournamentProcessModule {
}
