import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LayoutsModule} from 'src/app/layouts/layouts.module';
import {LayoutMainComponent} from 'src/app/layouts/Main/main.component';
import {CanActivateViaAuthGuard} from './modules/authentication/auth-guard/auth.guard';
import {GuestGuard} from "./modules/authentication/auth-guard/guest-guard";
import {NoSideMenuComponent} from "./layouts/no-side-menu/no-side-menu.component";
import {CheckAuthorityResolver} from "./modules/resolvers/check-authority.resolver";
import {OrganizerGuard} from "./modules/authentication/auth-guard/organizer-guard";

const routes: Routes = [
  {
    path: '',
    component: LayoutMainComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/home/home.module').then(m => m.HomeModule),
        canActivate: [CanActivateViaAuthGuard],
      },
      {
        path: 'create',
        loadChildren: () => import('src/app/modules/tournaments/tournaments.module').then(m => m.TournamentsModule),
        canActivate: [CanActivateViaAuthGuard],
      },
      {
        path: 'challenges',
        loadChildren: () => import('src/app/modules/challenges/challenges.module').then(m => m.ChallengesModule),
        canActivate: [CanActivateViaAuthGuard],
      },
      {
        path: 'tournament/:id',
        loadChildren: () => import('src/app/modules/edit-tournament/edit-tournament.module').then(m => m.EditTournamentModule),
        canActivate: [CanActivateViaAuthGuard , OrganizerGuard],
        // resolve: [CheckAuthorityResolver]
      }
    ],
  },
  {
    path: '',
    component: NoSideMenuComponent,
    children: [
      {
        path: 'match',
        loadChildren: () => import('src/app/modules/match-profile/match-profile.module').then(m => m.MatchProfileModule),
        canActivate: [CanActivateViaAuthGuard],
      },
    ],
  },

  {
    path: 'login',
    loadChildren: () => import('src/app/modules/login/login.module').then(m => m.LoginModule),
    canActivate: [GuestGuard]
  }
];
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, {
      useHash: false,
    }),
    RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'}),
    LayoutsModule,
  ],
  exports: [RouterModule],
})

export class AppRoutingModule {
}
