import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomEventsRoutingModule } from './custom-events-routing.module';
import {NgxsModule} from "@ngxs/store";
import {EventState} from "../events/state/event.state";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomEventsRoutingModule,
    NgxsModule.forFeature([EventState]),
  ]

})
export class CustomEventsModule { }
