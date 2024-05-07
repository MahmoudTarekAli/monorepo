import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TournamentsComponent} from "./tournaments.component";
import {CanActivateViaAuthGuard} from "../authentication/auth-guard/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: TournamentsComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/tournaments/create-tournament/create-tournament.module').then(m => m.CreateTournamentModule),
        canActivate: [CanActivateViaAuthGuard],
      },

    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentsRoutingModule {
}
