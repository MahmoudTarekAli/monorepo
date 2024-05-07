import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TournamentLogsRoutingModule } from './tournament-logs-routing.module';
import { TournamentLogsComponent } from './tournament-logs.component';
import { NzStepsModule } from 'ng-zorro-antd/steps'
import { SharedModule } from '../../../../shared/shared.module'
import { LoadingIndicatorModule } from '../../../../shared/components/loading-indicator/loading-indicator.module'
import {DaysAgoPipe} from "../pipes/days-ago.pipe";
import {NzListModule} from "ng-zorro-antd/list";


@NgModule({
  declarations: [
    TournamentLogsComponent ,
    DaysAgoPipe
  ],
    imports: [
        CommonModule,
        TournamentLogsRoutingModule,
        NzStepsModule,
        SharedModule,
        LoadingIndicatorModule,
        NzListModule,
    ],
})
export class TournamentLogsModule { }
