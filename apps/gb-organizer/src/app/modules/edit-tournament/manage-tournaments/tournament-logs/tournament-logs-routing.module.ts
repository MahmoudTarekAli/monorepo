import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentLogsComponent } from './tournament-logs.component'

const routes: Routes = [
  {path: '' , component: TournamentLogsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentLogsRoutingModule { }
