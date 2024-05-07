import {importProvidersFrom, NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./components/layout/layout.component";
import {VerifyEmailComponent} from "./components/verify-email/verify-email.component";
import {AuthGuard} from "@angular/fire/auth-guard";
import {CanActivateViaAuthGuard} from "./modules/authentication/auth-guard/auth.guard";
import {AuthResolver} from "./modules/authentication/auth.resolver";
import {NgxsModule} from "@ngxs/store";
import {GamerState} from "./modules/gamer/state/gamer.state";
import {GuestGuard} from "./modules/authentication/auth-guard/guest-guard";
import {UserGuard} from "./modules/authentication/auth-guard/user.guard";

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    resolve: {
      authUser: AuthResolver, // Resolve the 'authUser' data before navigating to this route
    },
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/modules/home/home.module').then(m => m.HomeModule),

      },
      {
        path: 'search',
        loadChildren: () => import('src/app/modules/search/search.module').then(m => m.SearchModule),
      },
      {
        path: 'tournaments',
        loadChildren: () => import('src/app/modules/tournament/tournament.module').then(m => m.TournamentModule),

      },
      {
        path: ':arena/tournaments',
        loadChildren: () => import('src/app/modules/tournament/tournament.module').then(m => m.TournamentModule),
      },
      {
        path: 'games',
        loadChildren: () => import('src/app/modules/games/games.module').then(m => m.GamesModule),
      },
      {
        path: 'challenges',
        loadChildren: () => import('src/app/modules/challenges/challenges.module').then(m => m.ChallengesModule),
      },
      // {
      //   path: ':id/challenges',
      //   loadChildren: () => import('src/app/modules/challenges/challenges.module').then(m => m.ChallengesModule),
      // },
      {
        path: 'gamer/:slug',
        loadChildren: () => import('src/app/modules/gamer/gamer.module').then(m => m.GamerModule),
      },
      {
        path: 'teams',
        loadChildren: () => import('src/app/modules/teams/teams.module').then(m => m.TeamsModule),
      },
      {
        path: 'arenas',
        loadChildren: () => import('src/app/modules/arena/arena.module').then(m => m.ArenaModule),
      },
      {
        path: 'invitations/:code',
        loadComponent: () => import('src/app/modules/teams/invitations/invitations.component').then(m => m.InvitationsComponent),
        providers: [
          importProvidersFrom(
            NgxsModule.forFeature([GamerState])
          )
        ],
        canActivate: [CanActivateViaAuthGuard]
      },

      {
        path: 'events',
        loadChildren: () => import('src/app/modules/events/events.module').then(m => m.EventsModule),
      },
      {
        path: 'messages',
        loadChildren: () => import('src/app/modules/messenger/messenger.module').then(m => m.MessengerModule),
        canActivate: [UserGuard]

      },
      {
        path: 'notifications',
        loadComponent: () => import('src/app/components/notifications/notifications.component').then(m => m.NotificationsComponent),
      },
      {
        path: 'riot-mena',
        loadChildren: () => import('src/app/modules/riot-mena/riot-mena.module').then(m => m.RiotMenaModule),
      },
      {
        path: 'prime',
        loadChildren: () => import('src/app/modules/gb-premium/gb-premium.module').then(m => m.GbPremiumModule),
      },
      {
        path: 'etisalat-gaming-eg',
        loadChildren: () => import('src/app/modules/arena/custom-arenas/etisalat-arena/etisalat-arena.module').then(m => m.EtisalatArenaModule)
      },
      {
        path: 'match',
        loadChildren: () => import('src/app/modules/match-profile/match-profile.module').then(m => m.MatchProfileModule),
      },
      {
        path: 'verifyEmail',
        component: VerifyEmailComponent
      },
      {
        path: '404',
        loadComponent: () => import('src/app/components/not-found/not-found.component').then(m => m.NotFoundComponent),
      },
      {
        path: 'terms-conditions',
        loadComponent: () => import('src/app/components/terms-conditions/terms-conditions.component').then(m => m.TermsConditionsComponent),
      },
      {
        path: 'privacy',
        loadComponent: () => import('src/app/components/privacy/privacy.component').then(m => m.PrivacyComponent),
      },
      {
        path: 'playgrounds',
        loadChildren: () => import('src/app/modules/custom-events/custom-events.module').then(m => m.CustomEventsModule),
      },
      {
        path: 'riot-ramadan-quests',
        loadChildren: () => import('src/app/modules/riot-ramadan/riot-ramadan.module').then(m => m.RiotRamadanModule),
      }

    ],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
