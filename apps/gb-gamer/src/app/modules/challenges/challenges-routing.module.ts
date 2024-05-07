import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GamesComponent} from "../games/games.component";
import {ChallengesComponent} from "./challenges.component";

const routes: Routes = [
  { path: '',  component: ChallengesComponent , children:[
      {path:'' , loadComponent: () => import('./challenges-list/challenges-list.component').then(m=> m.ChallengesListComponent)},
      {path:':code' , loadComponent: () => import('./challenge-profile/challenge-profile.component').then(m=> m.ChallengeProfileComponent)}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChallengesRoutingModule { }
