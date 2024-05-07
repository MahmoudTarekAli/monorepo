import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TournamentProgressRoutingModule } from './tournament-progress-routing.module';
import { TournamentProgressComponent } from './tournament-progress.component';
import {SharedModule} from "../../../../shared/shared.module";
import {FormsModule} from "@angular/forms";
import {WinnersModalComponent} from "./winners-modal/winners-modal.component";


@NgModule({
  declarations: [
    TournamentProgressComponent,
    WinnersModalComponent
  ],
  imports: [
    CommonModule,
    TournamentProgressRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class TournamentProgressModule { }
