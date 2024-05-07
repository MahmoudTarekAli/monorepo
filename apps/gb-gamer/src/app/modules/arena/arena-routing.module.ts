import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ArenaComponent} from "./arena.component";
import {ArenaGuard} from "./guards/arena-guard";

const routes: Routes = [
  {
    path: '', component: ArenaComponent, children: [
      {path: '', loadComponent: () => import('./arenas-list/arenas-list.component').then(m => m.ArenasListComponent)},
      {
        path: 'create',
        loadComponent: () => import('./arena-settings/create-update-arena/create-update-arena.component').then(m => m.CreateUpdateArenaComponent)
      },
      {
        path: ':code',
        loadComponent: () => import('./arena-profile/arena-profile.component').then(m => m.ArenaProfileComponent)
      },
      {
        path: ':code/manage',
        loadComponent: () => import('./arena-settings/arena-settings.component').then(m => m.ArenaSettingsComponent) , canActivate:[ArenaGuard] ,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'info'
          },
          {
            path: 'info',
            loadComponent: () => import('./arena-settings/create-update-arena/create-update-arena.component').then(m => m.CreateUpdateArenaComponent)
          },
          {
            path: 'social-media',
            loadComponent: () => import('./arena-settings/social-media/social-media.component').then(m => m.SocialMediaComponent)
          },
          {
            path: 'add-moderator',
            loadComponent: () => import('./arena-settings/add-moderator/add-moderator.component').then(m => m.AddModeratorComponent)
          },

        ]
      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArenaRoutingModule {
}
