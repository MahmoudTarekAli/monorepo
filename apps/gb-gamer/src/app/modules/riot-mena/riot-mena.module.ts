import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RiotMenaRoutingModule } from './riot-mena-routing.module';
import { RiotMenaComponent } from './riot-mena.component';
import {NgxsModule} from "@ngxs/store";
import {EventState} from "../events/state/event.state";


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RiotMenaRoutingModule,
    NgxsModule.forFeature([EventState]),

  ]
})
export class RiotMenaModule { }
