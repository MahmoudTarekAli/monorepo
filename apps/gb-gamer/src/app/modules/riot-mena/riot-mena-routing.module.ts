import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RiotMenaComponent} from "./riot-mena.component";

const routes: Routes = [
  {path: '' , component: RiotMenaComponent , children: [
      {path: '' , redirectTo: 'home' , pathMatch: 'full'},
      {path: 'home' ,  loadComponent: () => import('./riot-home/riot-home.component').then(m => m.RiotHomeComponent)},
      {path: 'tournaments-challenges' ,  loadComponent: () => import('./tournament-challenges/tournament-challenges.component').then(m => m.TournamentChallengesComponent)},
      {path: 'cafes' , loadComponent: () => import('./riot-cafe/riot-cafe.component').then(m => m.RiotCafeComponent)},
      {path: 'rules' , loadComponent: () => import('./rules/rules.component').then(m => m.RulesComponent)},
      {path: 'achievements' , loadComponent: () => import('./riot-achievement/riot-achievement.component').then(m => m.RiotAchievementComponent)},
    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiotMenaRoutingModule { }
