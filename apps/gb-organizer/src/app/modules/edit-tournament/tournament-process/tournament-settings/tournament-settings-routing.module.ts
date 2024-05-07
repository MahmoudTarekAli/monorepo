import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentSettingsComponent } from './tournament-settings.component'

const routes: Routes = [
  {
    path: '',
    component: TournamentSettingsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentSettingsRoutingModule { }
