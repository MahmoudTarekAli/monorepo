import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChallengesComponent} from "./challenges.component";

const routes: Routes = [
  {
    path: '', component: ChallengesComponent, children: [
      {path: '', redirectTo: 'create', pathMatch: 'full'},
      {path: 'create', loadComponent: () => import('src/app/modules/challenges/create-edit-challenge/create-edit-challenge.component').then(m => m.CreateEditChallengeComponent)},
      {path: ':id', loadComponent: () => import('src/app/modules/challenges/create-edit-challenge/create-edit-challenge.component').then(m => m.CreateEditChallengeComponent)},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChallengesRoutingModule {
}
