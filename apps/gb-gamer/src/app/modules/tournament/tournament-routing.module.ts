import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TournamentComponent} from "./tournament.component";
import {TeamSettingsGuard} from "./guards/team-settings.guard";

const routes: Routes = [
  {path: '', loadComponent: () => import('./tournaments-list/tournaments-list.component').then(m => m.TournamentsListComponent ) },
  {
    path: ':id',
    component: TournamentComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'summary'
      },
      {
        path: 'summary',
        loadChildren: () => import('src/app/modules/tournament/tournament-summary/tournament-summary.module').then(m => m.TournamentSummaryModule),
      },
      {
        path: 'participants',
        loadComponent: () => import('src/app/modules/tournament/tournament-participants/tournament-participants.component').then(m => m.TournamentParticipantsComponent),
      },
      {
        path: 'rules',
        loadChildren: () => import('src/app/modules/tournament/tournament-rules/tournament-rules.module').then(m => m.TournamentRulesModule),
      },
      {
        path: 'team-settings',
        loadComponent: () => import('src/app/modules/tournament/team-settings/team-settings.component').then(m => m.TeamSettingsComponent),
        canActivate: [TeamSettingsGuard]
      },
      {
        path: 'match-list',
        loadChildren: () => import('src/app/modules/tournament/match-list/match-list.module').then(m => m.MatchListModule),
      },
      {
        path: 'bracket',
        loadChildren: () => import('src/app/modules/tournament/brackets-view/brackets-view.module').then(m => m.BracketsViewModule),
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentRoutingModule {
}
