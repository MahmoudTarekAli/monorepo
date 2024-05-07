import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentRulesComponent } from './tournament-rules.component'

const routes: Routes = [
  {
    path: '',
    component: TournamentRulesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentRulesRoutingModule { }
