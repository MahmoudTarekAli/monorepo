import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrizesRoutingModule } from './prizes-routing.module';
import { PrizesComponent } from './prizes.component';
import { SharedModule } from '../../../../shared/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzCollapseModule} from "ng-zorro-antd/collapse";


@NgModule({
  declarations: [
    PrizesComponent
  ],
    imports: [
        CommonModule,
        PrizesRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NzAlertModule,
        NzCollapseModule
    ],
})
export class PrizesModule { }
