import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RiotRamadanComponent} from "./riot-ramadan.component";
import * as path from "path";

const routes: Routes = [
  {
    path: '',
    component: RiotRamadanComponent,
    children: [
      {path: '', loadComponent: () => import('./riot-ramadan-home/riot-ramadan-home.component').then(m => m.RiotRamadanHomeComponent)},
      {
        path: 'challenges',
        loadComponent: () => import('./riot-challenges-list/riot-challenges-list.component').then(m => m.RiotChallengesListComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiotRamadanRoutingModule { }
