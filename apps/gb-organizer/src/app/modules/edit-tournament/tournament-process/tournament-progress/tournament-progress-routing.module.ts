import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TournamentProgressComponent} from './tournament-progress.component';

const routes: Routes = [
  {
    path: '',
    component: TournamentProgressComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentProgressRoutingModule {
}
