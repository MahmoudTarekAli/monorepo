import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WinnersRoutingModule } from './winners-routing.module';
import { WinnersComponent } from './winners.component';
import {SharedModule} from "../../../../shared/shared.module";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {FormsModule} from "@angular/forms";
import {NzListModule} from "ng-zorro-antd/list";
import {NgxsModule} from "@ngxs/store";
import {ParticipantsState} from "../participants/state/participants.state";


@NgModule({
  declarations: [
    WinnersComponent
  ],
    imports: [
        CommonModule,
        WinnersRoutingModule,
        SharedModule,
        NzBadgeModule,
        NzPopoverModule,
        FormsModule,
        NzListModule,
        NgxsModule.forFeature([ParticipantsState]),

    ]
})
export class WinnersModule { }
