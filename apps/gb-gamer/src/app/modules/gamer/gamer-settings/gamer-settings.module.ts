import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamerSettingsRoutingModule } from './gamer-settings-routing.module';
import {NgxsModule} from "@ngxs/store";
import {GamerState} from "../state/gamer.state";
import {GamerSettingsState} from "./state/gamer-settings.state";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GamerSettingsRoutingModule,
    NgxsModule.forFeature([GamerSettingsState]),

  ]
})
export class GamerSettingsModule { }
