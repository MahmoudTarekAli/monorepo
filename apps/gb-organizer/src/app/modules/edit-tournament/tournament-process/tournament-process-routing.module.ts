import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TournamentProcessComponent} from './tournament-process.component';
import {CanActivateUserAuthority} from "../../authentication/auth-guard/is-user-approved.guard";

const routes: Routes = [
  {
    path: '',
    component: TournamentProcessComponent,
    children: [
      {
        path: '',
        redirectTo: 'tournament-progress',
        pathMatch: 'full'
      },
      {
        path: 'tournament-info',
        loadChildren: () => import('src/app/modules/edit-tournament/tournament-process/tournament-info/tournament-info.module').then(m => m.TournamentInfoModule),
        canActivate: [CanActivateUserAuthority],

      },
      {
        path: 'tournament-bracket',
        loadChildren: () => import('src/app/modules/edit-tournament/tournament-process/tournament-bracket/tournament-bracket.module').then(m => m.TournamentBracketModule),
        canActivate: [CanActivateUserAuthority],
      },
      {
        path: 'participants',
        loadChildren: () => import('src/app/modules/edit-tournament/tournament-process/tournament-participants/participants.module').then(m => m.ParticipantsModule),
        canActivate: [CanActivateUserAuthority],

      },
      {
        path: 'tournament-settings',
        loadChildren: () => import('src/app/modules/edit-tournament/tournament-process/tournament-settings/tournament-settings.module').then(m => m.TournamentSettingsModule),
        canActivate: [CanActivateUserAuthority],

      },
      {
        path: 'prizes',
        loadChildren: () => import('src/app/modules/edit-tournament/tournament-process/tournament-prizes/prizes.module').then(m => m.PrizesModule),
        canActivate: [CanActivateUserAuthority],

      },
      {
        path: 'tournament-progress',
        loadChildren: () => import('src/app/modules/edit-tournament/tournament-process/tournament-progress/tournament-progress.module').then(m => m.TournamentProgressModule),

      }, {
        path: 'rules',
        loadChildren: () => import('src/app/modules/edit-tournament/tournament-process/tournament-rules/tournament-rules.module').then(m => m.TournamentRulesModule),
        canActivate: [CanActivateUserAuthority],
      },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentProcessRoutingModule {
}
