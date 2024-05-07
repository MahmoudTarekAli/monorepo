import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GamerComponent} from "./gamer.component";
import {AccountOwnerGuard} from "./guards/account-owner.guard";

const routes: Routes = [
  { path: '',  component: GamerComponent , children:[
      {path:'' , loadChildren: () => import('./gamer-profile/gamer-profile.module').then(m=> m.GamerProfileModule)},
      {path:'settings' , loadChildren: () => import('./gamer-settings/gamer-settings.module').then(m=> m.GamerSettingsModule) , canActivate:[AccountOwnerGuard]},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamerRoutingModule { }
