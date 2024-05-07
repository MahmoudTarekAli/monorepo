import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SingleDoubleBracketViewComponent} from "./single-double-bracket-view.component";

const routes: Routes = [
  {
    path: '',
    component: SingleDoubleBracketViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleDoubleBracketViewRoutingModule { }
