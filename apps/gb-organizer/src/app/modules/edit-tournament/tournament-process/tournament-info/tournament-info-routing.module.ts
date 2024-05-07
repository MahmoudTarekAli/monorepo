import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TournamentInfoComponent} from "./tournament-info.component";

const routes: Routes = [
  {
    path: '',
    component: TournamentInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentInfoRoutingModule {
}
