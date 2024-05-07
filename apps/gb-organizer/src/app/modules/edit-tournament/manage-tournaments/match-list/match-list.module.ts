import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatchListRoutingModule} from './match-list-routing.module';
import {MatchListComponent} from './match-list.component';
import {SharedModule} from "../../../../shared/shared.module";
import {LoadingIndicatorModule} from "../../../../shared/components/loading-indicator/loading-indicator.module";
import {NgxsModule} from "@ngxs/store";
import {MatchListState} from "./state/match-list.state";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {A11yModule} from "@angular/cdk/a11y";
import {ManageTournamentsModule} from "../manage-tournaments.module";
import {FreeForAllComponent} from './free-for-all/free-for-all.component';
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {SetScoreComponent} from './set-score/set-score.component';
import {NzModalRef} from "ng-zorro-antd/modal";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {ReplacePlayerComponent} from './replace-player/replace-player.component';
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {NzListModule} from "ng-zorro-antd/list";
import {TeamViewComponent} from "../../../../shared/components/team-view/team-view.component";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {AgVirtualScrollModule} from "ag-virtual-scroll";
import {NzImageModule, NzImageService} from "ng-zorro-antd/image";
import {ParticipantsState} from "../participants/state/participants.state";

@NgModule({
  declarations: [
    MatchListComponent,
    FreeForAllComponent,
    SetScoreComponent,
    ReplacePlayerComponent],
  imports: [
    CommonModule,
    MatchListRoutingModule,
    SharedModule,
    LoadingIndicatorModule,
    NgxsModule.forFeature([MatchListState, ParticipantsState]),
    FormsModule,
    // A11yModule,
    ManageTournamentsModule,
    NzInputNumberModule,
    ReactiveFormsModule,
    NzCollapseModule,
    NzDescriptionsModule,
    NzListModule,
    NzUploadModule,
    AgVirtualScrollModule,
    NzImageModule,
  ],
  providers: [NzImageService]
})
export class MatchListModule {
}
