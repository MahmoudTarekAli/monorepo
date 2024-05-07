import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditTournamentRoutingModule } from './edit-tournament-routing.module';
import { EditTournamentComponent } from './edit-tournament.component';
import { SharedService } from './service/shared.service'
import { NgxsModule } from '@ngxs/store'
import { TournamentProcessState } from './tournament-process/state/tournament-process.state'
import { ManageTournamentState } from './manage-tournaments/state/manage-tournament.state'
import {MatchListState} from "./manage-tournaments/match-list/state/match-list.state";
import {ShareModalComponent} from "../../shared/dialogs/share-modal/share-modal.component";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule} from "@angular/forms";
// import {ShareButtonModule} from "ngx-sharebuttons/button";
// import {ShareButtonModule} from "ngx-sharebuttons/button";
// import {ShareButtonsModule} from "ngx-sharebuttons/buttons";
import { ShareModule } from 'ngx-sharebuttons';
import {CanActivateUserAuthority} from "../authentication/auth-guard/is-user-approved.guard";

@NgModule({
  declarations: [
    EditTournamentComponent,
    ShareModalComponent
  ],
  imports: [
    CommonModule,
    EditTournamentRoutingModule,
    NgxsModule.forFeature([TournamentProcessState, ManageTournamentState, MatchListState]),
    SharedModule,
    FormsModule,
    ShareModule,
    // ShareButtonsModule ,
  ],
  providers: [SharedService]
})
export class EditTournamentModule { }
