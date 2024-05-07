import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatchListRoutingModule} from './match-list-routing.module';
import {MatchListComponent} from './match-list.component';
import {NgxsModule} from "@ngxs/store";
import {MatchListState} from "./state/match-list.state";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {A11yModule} from "@angular/cdk/a11y";
import {FreeForAllComponent} from './free-for-all/free-for-all.component';
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {NzListModule} from "ng-zorro-antd/list";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzImageModule, NzImageService} from "ng-zorro-antd/image";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {
  MatchListContainerComponent
} from "../../../shared/components/match-list-container/match-list-container.component";
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {ShowHideRoundsPipe} from "../../../shared/pipes/show-hide-rounds.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {FilterPipe} from "../../../shared/pipes/filter.pipe";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {MatchesPipe} from "../../../shared/pipes/matches.pipe";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {MarqueeComponent} from "../../../shared/components/marquee/marquee.component";
import {CountryPipe} from "../../../shared/pipes/country.pipe";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzIconModule} from "ng-zorro-antd/icon";
import {ConvertNumToCharPipe} from "../../../shared/pipes/convert-num-to-char.pipe";
import {NzDrawerService} from "ng-zorro-antd/drawer";
import {RemoveSpacesPipe} from "../../../shared/pipes/remove-spaces.pipe";
import {ButtonComponent} from "../../../components/button/button.component";
import {UserTimezoneComponent} from "../../../components/user-timezone/user-timezone.component";

@NgModule({
  declarations: [
    MatchListComponent,
    FreeForAllComponent,
  ],
  imports: [
    CommonModule,
    MatchListRoutingModule,
    NgxsModule.forFeature([MatchListState]),
    FormsModule,
    // A11yModule,
    NzInputNumberModule,
    ReactiveFormsModule,
    NzCollapseModule,
    NzDescriptionsModule,
    NzListModule,
    NzUploadModule,
    NzImageModule,
    NzInputModule,
    NzFormModule,
    NzDatePickerModule,
    MatchListContainerComponent,
    LoadingIndicatorComponent,
    NzRadioModule,
    NzDividerModule,
    NzTabsModule,
    ShowHideRoundsPipe,
    TranslateModule,
    FilterPipe,
    NzPaginationModule,
    MatchesPipe,
    NzCheckboxModule,
    NzAvatarModule,
    MarqueeComponent,
    CountryPipe,
    NzToolTipModule,
    NzDropDownModule,
    NzModalModule,
    NzButtonModule,
    NzSelectModule,
    NzPageHeaderModule,
    NzTableModule,
    NzIconModule,
    ConvertNumToCharPipe,
    RemoveSpacesPipe,
    ButtonComponent,
    UserTimezoneComponent,
  ],
  providers: [NzImageService, NzDrawerService]
})
export class MatchListModule {
}
