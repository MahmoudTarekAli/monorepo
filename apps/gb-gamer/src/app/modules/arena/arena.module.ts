import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArenaRoutingModule } from './arena-routing.module';
import { ArenaComponent } from './arena.component';
import {NgxsModule} from "@ngxs/store";
import {GamesState} from "../games/state/games.state";
import {HomeState} from "../home/state/home.state";
import {ArenasState} from "./state/arenas.state";
import {ArenaGuard} from "./guards/arena-guard";
import {CustomArenasState} from "./custom-arenas/state/custom-arenas.state";


@NgModule({
  declarations: [
    ArenaComponent,
  ],
  imports: [
    CommonModule,
    ArenaRoutingModule,
    NgxsModule.forFeature([HomeState , ArenasState , CustomArenasState]),

  ],
  providers: [ArenaGuard]
})
export class ArenaModule { }
