import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssuesClaimsRoutingModule } from './issues-claims-routing.module';
import { IssuesClaimsComponent } from './issues-claims.component';
import {SharedModule} from "../../../../shared/shared.module";
import {NgxsModule} from "@ngxs/store";
import {IssuesClaimsState} from "./state/issues-claims.state";
import {LoadingIndicatorModule} from "../../../../shared/components/loading-indicator/loading-indicator.module";
import {MatchListState} from "../match-list/state/match-list.state";
import {NzImageService} from "ng-zorro-antd/image";


@NgModule({
  declarations: [
    IssuesClaimsComponent
  ],
  imports: [
    CommonModule,
    IssuesClaimsRoutingModule,
    SharedModule,
    NgxsModule.forFeature([IssuesClaimsState , MatchListState]),
    LoadingIndicatorModule,

  ],
  providers: [NzImageService]

})
export class IssuesClaimsModule { }
