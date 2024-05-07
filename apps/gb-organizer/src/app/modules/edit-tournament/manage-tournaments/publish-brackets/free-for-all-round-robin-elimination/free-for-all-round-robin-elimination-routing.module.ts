import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FreeForAllRoundRobinEliminationComponent} from "./free-for-all-round-robin-elimination.component";

const routes: Routes = [
  {
    path: '',
    component: FreeForAllRoundRobinEliminationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FreeForAllRoundRobinEliminationRoutingModule {
}
