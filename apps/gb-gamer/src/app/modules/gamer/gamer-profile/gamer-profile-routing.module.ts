import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', loadComponent: () => import('./gamer-profile.component').then(m => m.GamerProfileComponent), children: [
      {path: '', redirectTo: 'my-activity', pathMatch: 'full'},
      {path: 'my-activity', loadComponent: () => import('./my-activity/my-activity.component').then(m => m.MyActivityComponent)},
      {path: 'esports', loadComponent: () => import('./esports/esports.component').then(m => m.EsportsComponent)},
      // {path: 'friends', loadComponent: () => import('./friends/friends.component').then(m => m.FriendsComponent)},
      {path: 'rules', loadComponent: () => import('./rules/rules.component').then(m => m.RulesComponent)},
      {path: 'prizes', loadComponent: () => import('./prizes/prizes.component').then(m => m.PrizesComponent)},
      {path: 'teams', loadChildren: () => import('./gamer-team/gamer-team.module').then(m => m.GamerTeamModule)},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamerProfileRoutingModule { }
