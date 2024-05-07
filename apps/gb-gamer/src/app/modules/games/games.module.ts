import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import {GamesService} from "./service/games.service";
import {LoadingIndicatorComponent} from "../../shared/components/loading-indicator/loading-indicator.component";
import {ButtonComponent} from "../../components/button/button.component";
import {GameCardComponent} from "../../shared/components/game-card/game-card.component";
import {NgxsModule} from "@ngxs/store";

import {GamesState} from "./state/games.state";
import {HomeState} from "../home/state/home.state";


@NgModule({
  declarations: [
    GamesComponent,
  ],
  imports: [
    CommonModule,
    GamesRoutingModule,
    LoadingIndicatorComponent,
    ButtonComponent,
    GameCardComponent,
    NgxsModule.forFeature([GamesState , HomeState]),

  ],
  providers: [
    GamesService
  ]
})
export class GamesModule { }
