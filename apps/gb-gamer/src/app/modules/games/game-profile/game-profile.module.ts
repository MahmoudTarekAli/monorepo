import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameProfileRoutingModule } from './game-profile-routing.module';
import { GameProfileComponent } from './game-profile.component';
import {BannerCardComponent} from "../../../shared/components/banner-card/banner-card.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {AppModule} from "../../../app.module";
import {CardListComponent} from "../../../shared/components/card-list/card-list.component";
import {LeaderboardComponent} from "../../../shared/components/leaderboard/leaderboard.component";
import {ResponsiveImagePipe} from "../../../shared/pipes/responsive-image.pipe";
import {FilterPopoverComponent} from "../../../shared/components/filter-popover/filter-popover.component";
import {SectionComponent} from "../../../components/section/section.component";
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";
import {TranslateModule} from "@ngx-translate/core";
import {NzSpaceModule} from "ng-zorro-antd/space";

@NgModule({
  declarations: [
    GameProfileComponent
  ],
  imports: [
    CommonModule,
    GameProfileRoutingModule,
    BannerCardComponent,
    ButtonComponent,
    NzTabsModule,
    CardListComponent,
    LeaderboardComponent,
    ResponsiveImagePipe,
    FilterPopoverComponent,
    SectionComponent,
    LoadingIndicatorComponent,
    TranslateModule,
    NzSpaceModule,
  ]
})
export class GameProfileModule { }
