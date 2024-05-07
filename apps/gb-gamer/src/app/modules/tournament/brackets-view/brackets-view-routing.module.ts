import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BracketsViewComponent} from "./brackets-view.component";

const routes: Routes = [
  {
    path: '',
    component: BracketsViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BracketsViewRoutingModule {
}
