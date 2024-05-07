import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BracketsViewRoutingModule} from './brackets-view-routing.module';
import {BracketsViewComponent} from './brackets-view.component';
import {NgxsModule} from "@ngxs/store";
import {MatchListState} from "../match-list/state/match-list.state";
import {BracketViewState} from "./state/bracket-view.state";
import {FormsModule} from "@angular/forms";
import {MatchListModule} from "../match-list/match-list.module";
import {
  MatchListContainerComponent
} from "../../../shared/components/match-list-container/match-list-container.component";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzSelectModule} from "ng-zorro-antd/select";
import {
  ReactBracketViewWrapperComponent
} from "../../../shared/components/my-react-component/react-bracket-view-wrapper";
import {NzTableModule} from "ng-zorro-antd/table";
import {TranslateModule} from "@ngx-translate/core";
import {ConvertNumToCharPipe} from "../../../shared/pipes/convert-num-to-char.pipe";
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {NzIconModule} from "ng-zorro-antd/icon";


@NgModule({
  declarations: [
    BracketsViewComponent
  ],
  imports: [
    CommonModule,
    BracketsViewRoutingModule,
    NgxsModule.forFeature([MatchListState, BracketViewState]),
    FormsModule,
    MatchListModule,
    MatchListContainerComponent,
    NzRadioModule,
    NzDividerModule,
    NzSelectModule,
    ReactBracketViewWrapperComponent,
    NzTableModule,
    TranslateModule,
    ConvertNumToCharPipe,
    LoadingIndicatorComponent,
    ButtonComponent,
    NzIconModule
  ]
})
export class BracketsViewModule {
}
