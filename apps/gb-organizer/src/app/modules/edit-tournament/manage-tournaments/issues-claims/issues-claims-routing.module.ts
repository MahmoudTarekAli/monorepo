import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {IssuesClaimsComponent} from "./issues-claims.component";

const routes: Routes = [
  {
    path: '',
    component: IssuesClaimsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IssuesClaimsRoutingModule { }
