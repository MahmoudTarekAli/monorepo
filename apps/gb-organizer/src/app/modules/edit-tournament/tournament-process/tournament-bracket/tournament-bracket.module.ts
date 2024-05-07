import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TournamentBracketRoutingModule} from './tournament-bracket-routing.module';
import {TournamentBracketComponent} from './tournament-bracket.component';
import {SharedModule} from "../../../../shared/shared.module";
import {SingleEliminationComponent} from './single-elimination/single-elimination.component';
import {DoubleEliminationComponent} from './double-elimination/double-elimination.component';
import {RoundRobinComponent} from './round-robin/round-robin.component';
import {FreeForAllComponent} from './free-for-all/free-for-all.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzAffixModule} from "ng-zorro-antd/affix";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import { ViewBracketTemplateComponent } from './view-bracket-template/view-bracket-template.component';


@NgModule({
    declarations: [
        TournamentBracketComponent,
        SingleEliminationComponent,
        DoubleEliminationComponent,
        RoundRobinComponent,
        FreeForAllComponent,
        ViewBracketTemplateComponent
    ],
    exports: [
        FreeForAllComponent
    ],
  imports: [
    CommonModule,
    TournamentBracketRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NzInputNumberModule,
    NzAlertModule,
    NzAffixModule,
    NzCollapseModule
  ]
})
export class TournamentBracketModule {
}
