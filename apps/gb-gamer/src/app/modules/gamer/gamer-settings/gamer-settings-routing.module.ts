import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '',  loadComponent: () => import('./gamer-settings.component').then(m=> m.GamerSettingsComponent) , children:[
      {path: '', redirectTo: 'user-info', pathMatch: 'full'},
      {path:'user-info' , loadComponent: () => import('./user-info/user-info.component').then(m=> m.UserInfoComponent)},
      {path:'security-privacy' , loadComponent: () => import('./security-privacy/security-privacy.component').then(m=> m.SecurityPrivacyComponent)},
      // {path:'notifications' , loadComponent: () => import('./notifications/notifications.component').then(m=> m.NotificationsComponent)},
      {path:'connect-accounts' , loadComponent: () => import('./connect-accounts/connect-accounts.component').then(m=> m.ConnectAccountsComponent)},
      {path:'blocked-users' , loadComponent: () => import('./blocked-users/blocked-users.component').then(m=> m.BlockedUsersComponent)},
      {path:'third-parties' , loadComponent: () => import('./third-party-intergrations/third-party-intergrations.component').then(m=> m.ThirdPartyIntergrationsComponent)},
      ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamerSettingsRoutingModule { }
