import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TournamentSummaryComponent} from "./tournament-summary.component";

const routes: Routes = [
  {
    path: '',
    component: TournamentSummaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentSummaryRoutingModule {
}
