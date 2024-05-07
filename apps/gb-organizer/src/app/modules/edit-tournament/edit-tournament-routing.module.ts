import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditTournamentComponent } from './edit-tournament.component'
import {CanActivateUserAuthority} from "../authentication/auth-guard/is-user-approved.guard";

const routes: Routes = [
  {
    path: '', component: EditTournamentComponent, children: [
      {path: '', redirectTo: 'process', pathMatch: 'full'},
      {
        path: 'process',
        loadChildren: () => import('src/app/modules/edit-tournament/tournament-process/tournament-process.module').then(m => m.TournamentProcessModule),

        // canActivate: [CanActivateViaAuthGuard],
      }, {
        path: 'manage',
        loadChildren: () => import('src/app/modules/edit-tournament/manage-tournaments/manage-tournaments.module').then(m => m.ManageTournamentsModule),
      },
      ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditTournamentRoutingModule { }
