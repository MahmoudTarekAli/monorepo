import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FreeForAllRoundRobinEliminationRoutingModule } from './free-for-all-round-robin-elimination-routing.module';
import { FreeForAllRoundRobinEliminationComponent } from './free-for-all-round-robin-elimination.component';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzIconModule} from "ng-zorro-antd/icon";
import {LoadingIndicatorModule} from "../../../../../shared/components/loading-indicator/loading-indicator.module";
import {ManageTournamentsModule} from "../../manage-tournaments.module";
import {NzAffixModule} from "ng-zorro-antd/affix";


@NgModule({
  declarations: [
    FreeForAllRoundRobinEliminationComponent
  ],
  imports: [
    CommonModule,
    FreeForAllRoundRobinEliminationRoutingModule,
    NzTableModule,
    NzCheckboxModule,
    NzButtonModule,
    NzAvatarModule,
    NzToolTipModule,
    NzIconModule,
    LoadingIndicatorModule,
    ManageTournamentsModule,
    NzAffixModule
  ]
})
export class FreeForAllRoundRobinEliminationModule { }
