import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {path: '', redirectTo: 'my-tournaments', pathMatch: 'full'},
  {
    path: 'my-tournaments',
    loadComponent: () => import('src/app/modules/home/my-tournaments/my-tournaments.component').then(m => m.MyTournamentsComponent),
  },  {
    path: 'my-challenges',
    loadComponent: () => import('src/app/modules/home/challenges-list/challenges-list.component').then(m => m.ChallengesListComponent),
  },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
