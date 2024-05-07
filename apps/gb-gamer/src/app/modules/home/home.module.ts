import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import {SectionComponent} from "../../components/section/section.component";
import {ChallengeCardComponent} from "../../shared/components/gb-card/challenge-card.component";
import {ButtonComponent} from "../../components/button/button.component";
import {TournamentCardComponent} from "../../shared/components/tournament-card/tournament-card.component";
import {GameCardComponent} from "../../shared/components/game-card/game-card.component";
import {LoadingIndicatorComponent} from "../../shared/components/loading-indicator/loading-indicator.component";
import {ArenaCardComponent} from "../../shared/components/arena-card/arena-card.component";
import {SliceArrayPipe} from "../../shared/pipes/sliceArray.pipe";
import {MySwiperComponent} from "../../shared/components/slide/my-swiper.component";
import {NgxsModule} from "@ngxs/store";
import {GamerState} from "../gamer/state/gamer.state";
import {AuthenticationState} from "../authentication/state/authentication.state";
import {ArenasState} from "../arena/state/arenas.state";
import {CarouselModule} from "ngx-owl-carousel-o";
import {ProductCardComponent} from "../../shared/components/product-card/product-card.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgScrollbar} from "ngx-scrollbar";


@NgModule({
  declarations: [
    HomeComponent
  ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        SectionComponent,
        ChallengeCardComponent,
        ButtonComponent,
        TournamentCardComponent,
        GameCardComponent,
        LoadingIndicatorComponent,
        ArenaCardComponent,
        SliceArrayPipe,
        ProductCardComponent,
        NgxsModule.forFeature([ArenasState]),
        MySwiperComponent,
        CarouselModule,
        TranslateModule,
        NgScrollbar,
    ]
})
export class HomeModule { }
