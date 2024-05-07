import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TeamGuard} from "./guards/team-guard";
import {GamerComponent} from "../gamer/gamer.component";
import {TeamsComponent} from "./teams.component";

const routes: Routes = [
  {
    path: '', component: TeamsComponent, children: [

      {
        path: 'create',
        loadComponent: () => import('./create-update-team/create-update-team.component').then(m => m.CreateUpdateTeamComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./create-update-team/create-update-team.component').then(m => m.CreateUpdateTeamComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./team-profile/team-profile.component').then(m => m.TeamProfileComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./team-profile/team-members/team-members.component').then(m => m.TeamMembersComponent)
          },
          {
            path: 'stats',
            loadComponent: () => import('./team-profile/team-stats/team-stats.component').then(m => m.TeamStatsComponent)
          },
          {
            path: 'matches',
            loadComponent: () => import('./team-profile/team-matches/team-matches.component').then(m => m.TeamMatchesComponent)
          },
          {
            path: 'joined-tournaments',
            loadComponent: () => import('./team-profile/team-tournaments/team-tournaments.component').then(m => m.TeamTournamentsComponent)
          },
          {
            path: 'add-members',
            loadComponent: () => import('./team-profile/team-add-member/team-add-member.component').then(m => m.TeamAddMemberComponent)
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }
