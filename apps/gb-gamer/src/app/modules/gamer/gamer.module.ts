import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamerRoutingModule } from './gamer-routing.module';
import { GamerComponent } from './gamer.component';
import { GamerProfileComponent } from './gamer-profile/gamer-profile.component';
import {RouterModule} from "@angular/router";
import {NgxsModule} from "@ngxs/store";
import {GamesState} from "../games/state/games.state";
import {GamerState} from "./state/gamer.state";
import {GamerService} from "./service/gamer.service";
import {LoadingIndicatorComponent} from "../../shared/components/loading-indicator/loading-indicator.component";
import {AuthenticationState} from "../authentication/state/authentication.state";
import {CanActivateViaAuthGuard} from "../authentication/auth-guard/auth.guard";
import {AccountOwnerGuard} from "./guards/account-owner.guard";


@NgModule({
  declarations: [
    GamerComponent,
  ],
  imports: [
    CommonModule,
    GamerRoutingModule,
    RouterModule,
    NgxsModule.forFeature([GamerState , AuthenticationState]),
    LoadingIndicatorComponent,

  ],
  providers: [GamerService , CanActivateViaAuthGuard , AccountOwnerGuard ]

})
export class GamerModule { }
