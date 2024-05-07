import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TournamentProcessComponent} from '../tournament-process/tournament-process.component'
import {ManageTournamentsComponent} from './manage-tournaments.component'
import {PublishBracketGuard} from "./services/publish-bracket.guard";

const routes: Routes = [{
  path: '',
  component: ManageTournamentsComponent,
  children: [
    {
      path: '',
      redirectTo: 'tournament-logs',
      pathMatch: 'full'
    },
    {
      path: 'tournament-logs',
      loadChildren: () => import('src/app/modules/edit-tournament/manage-tournaments/tournament-logs/tournament-logs.module').then(m => m.TournamentLogsModule),
    },
    {
      path: 'match-list',
      loadChildren: () => import('src/app/modules/edit-tournament/manage-tournaments/match-list/match-list.module').then(m => m.MatchListModule),
    },
    {
      path: 'publish-brackets',
      loadChildren: () => import('src/app/modules/edit-tournament/manage-tournaments/publish-brackets/publish-brackets.module').then(m => m.PublishBracketsModule),
    },
    {
      path: 'participants',
      loadChildren: () => import('src/app/modules/edit-tournament/manage-tournaments/participants/participants.module').then(m => m.ParticipantsModule),
    },
    {
      path: 'issues-claims',
      loadChildren: () => import('src/app/modules/edit-tournament/manage-tournaments/issues-claims/issues-claims.module').then(m => m.IssuesClaimsModule),
    },
    {
      path: 'brackets-view',
      loadChildren: () => import('src/app/modules/edit-tournament/manage-tournaments/brackets-view/brackets-view.module').then(m => m.BracketsViewModule),
    },
    {
      path: 'winners',
      loadChildren: () => import('src/app/modules/edit-tournament/manage-tournaments/winners/winners.module').then(m => m.WinnersModule),
    }
  ]

}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageTournamentsRoutingModule {
}
