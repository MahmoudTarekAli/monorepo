import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GamesComponent} from "./games.component";

const routes: Routes = [
  { path: '',  component: GamesComponent , children:[
      {path:'' , loadComponent: () => import('./games-list/games-list.component').then(m=> m.GamesListComponent)},
      {path:':code', loadChildren: () => import('./game-profile/game-profile.module').then(m => m.GameProfileModule)},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesRoutingModule { }
