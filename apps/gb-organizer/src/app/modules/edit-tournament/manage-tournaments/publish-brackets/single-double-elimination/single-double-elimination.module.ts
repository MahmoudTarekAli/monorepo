import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SingleDoubleEliminationRoutingModule } from './single-double-elimination-routing.module';
import { SingleDoubleEliminationComponent } from './single-double-elimination.component';
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {FormsModule} from "@angular/forms";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {LoadingIndicatorModule} from "../../../../../shared/components/loading-indicator/loading-indicator.module";


@NgModule({
  declarations: [
    SingleDoubleEliminationComponent
  ],
    imports: [
        CommonModule,
        SingleDoubleEliminationRoutingModule,
        NzDividerModule,
        NzAvatarModule,
        NzCheckboxModule,
        NzButtonModule,
        NzIconModule,
        FormsModule,
        NzToolTipModule,
        LoadingIndicatorModule
    ]
})
export class SingleDoubleEliminationModule { }
