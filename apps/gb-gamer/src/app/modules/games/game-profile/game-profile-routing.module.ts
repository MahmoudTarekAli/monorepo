import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameProfileComponent} from "./game-profile.component";

const routes: Routes = [
  { path: '',  component:GameProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameProfileRoutingModule { }
