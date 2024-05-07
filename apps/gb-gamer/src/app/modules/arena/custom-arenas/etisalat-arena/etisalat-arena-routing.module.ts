import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EtisalatArenaComponent} from "./etisalat-arena.component";

const routes: Routes = [
  {path: '', loadComponent: () => import('./etisalat-arena.component').then(m => m.EtisalatArenaComponent)}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtisalatArenaRoutingModule { }
