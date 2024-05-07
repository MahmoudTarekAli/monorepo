import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParticipantsRoutingModule } from './participants-routing.module';
import { ParticipantsComponent } from './participants.component';
import { NzTableModule } from 'ng-zorro-antd/table'
import { NzButtonModule } from 'ng-zorro-antd/button'
import { ParticipantsService } from './services/participants.service'
import { LoadingIndicatorModule } from '../../../../shared/components/loading-indicator/loading-indicator.module'
import { NzTabsModule } from 'ng-zorro-antd/tabs'
import { SharedModule } from '../../../../shared/shared.module'
import { NgxsModule } from '@ngxs/store'

import { ParticipantsState } from './state/participants.state'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NzTagModule } from 'ng-zorro-antd/tag'
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {NzListModule} from "ng-zorro-antd/list";
import {TeamViewComponent} from "../../../../shared/components/team-view/team-view.component";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzBadgeModule} from "ng-zorro-antd/badge";


@NgModule({
  declarations: [
    ParticipantsComponent,
  ],
    imports: [
        CommonModule,
        ParticipantsRoutingModule,
        NzTableModule,
        NzButtonModule,
        LoadingIndicatorModule,
        NzTabsModule,
        SharedModule,
        NgxsModule.forFeature([ParticipantsState]),
        ReactiveFormsModule,
        FormsModule,
        NzTagModule,
        NzCollapseModule,
        NzListModule,
        NzPopoverModule,
        NzBadgeModule,


    ],
  providers: [ParticipantsService]
})
export class ParticipantsModule { }
