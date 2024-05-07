import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParticipantsComponent } from '../tournament-participants/participants.component'
import { PrizesComponent } from './prizes.component'
import {PendingChangesGuard} from "../../../../shared/guards/pendingChanges";

const routes: Routes = [
  {
    path: '',
    component: PrizesComponent,
    canDeactivate: [PendingChangesGuard]

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrizesRoutingModule { }
