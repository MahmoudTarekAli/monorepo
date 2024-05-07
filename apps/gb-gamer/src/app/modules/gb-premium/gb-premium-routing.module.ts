import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GbPremiumComponent} from "./gb-premium.component";

const routes: Routes = [
  { path: '',component: GbPremiumComponent, children: [
      {path:'',loadComponent: () => import('./gb-premium-main/gb-premium-main.component').then(m => m.GbPremiumMainComponent)},

    ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GbPremiumRoutingModule { }
