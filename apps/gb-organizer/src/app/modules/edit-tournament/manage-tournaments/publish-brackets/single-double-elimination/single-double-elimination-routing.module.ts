import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SingleDoubleEliminationComponent} from "./single-double-elimination.component";

const routes: Routes = [
  {
    path: '',
    component: SingleDoubleEliminationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleDoubleEliminationRoutingModule {
}
