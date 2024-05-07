import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChallengesComponent} from "../challenges/challenges.component";

const routes: Routes = [
  { path: '', loadComponent: () => import('./playgrounds/playgrounds.component').then(m=> m.PlaygroundsComponent) , children:[
      {path:''  , loadComponent: () => import('./playgrounds/playground-home/playground-home.component').then(m=> m.PlaygroundHomeComponent)},
      {path:':game'  , loadComponent: () => import('./playgrounds/playground-game/playground-game.component').then(m=> m.PlaygroundGameComponent) , children:[
          {path: '' , redirectTo: 'tournaments', pathMatch: 'full'},
          {path:'tournaments' , loadComponent: () => import('./playgrounds/playground-game/tournaments-playground/tournaments-playground.component').then(m=> m.TournamentsPlaygroundComponent)},
          {path:'faq' , loadComponent: () => import('./playgrounds/playground-game/faq-playgrounds/faq-playgrounds.component').then(m=> m.FaqPlaygroundsComponent)},
          {path:'prizes' , loadComponent: () => import('./playgrounds/playground-game/prizes-playgrounds/prizes-playgrounds.component').then(m=> m.PrizesPlaygroundsComponent)},
    ]},]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomEventsRoutingModule { }
