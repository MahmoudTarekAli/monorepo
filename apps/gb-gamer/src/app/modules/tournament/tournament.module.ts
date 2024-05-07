import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TournamentRoutingModule} from './tournament-routing.module';
import {TournamentComponent} from "./tournament.component";
import {ButtonComponent} from "../../components/button/button.component";
import {SectionComponent} from "../../components/section/section.component";
import {BannerCardComponent} from "../../shared/components/banner-card/banner-card.component";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NgxsModule} from "@ngxs/store";
import {TournamentState} from "./state/tournament.state";
import {NzModalModule, NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {JoinTournamentComponent} from "../../shared/components/join-tournament/join-tournament.component";
import {JoinTournamentState} from "./state/join-tournament/join-tournament.state";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {SafeHtmlPipe} from "../../shared/pipes/safe-html";
import {AngularEditorModule} from "@kolkov/angular-editor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {QuillViewComponent, QuillViewHTMLComponent} from "ngx-quill";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzFormModule} from "ng-zorro-antd/form";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {
  ConnectLeagueAccountsComponent
} from "../../shared/components/connect-league-accounts/connect-league-accounts.component";
import {LeagueAccountsComponent} from "../../shared/components/league-accounts/league-accounts.component";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {TournamentService} from "./service/tournament.service";
import {TeamState} from "../teams/state/team.state";
import {ResponsiveImagePipe} from "../../shared/pipes/responsive-image.pipe";
import {HomeState} from "../home/state/home.state";
import {GamerState} from "../gamer/state/gamer.state";
import {GamesState} from "../games/state/games.state";
import {CountdownPipe} from "../../shared/pipes/countdown.pipe";
import {MarqueeComponent} from "../../shared/components/marquee/marquee.component";
import {DefaultImagePipe} from "../../shared/pipes/default-image.pipe";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {UserTimezoneComponent} from "../../components/user-timezone/user-timezone.component";
import {TranslateModule} from "@ngx-translate/core";
import {FilterPipe} from "../../shared/pipes/arena-router.pipe";


@NgModule({
  declarations: [
    TournamentComponent,
  ],
    imports: [
        CommonModule,
        TournamentRoutingModule,
        ButtonComponent,
        SectionComponent,
        BannerCardComponent,
        NzTabsModule,
        NgxsModule.forFeature([TournamentState, JoinTournamentState, TeamState, GamesState, GamerState]),
        NzStepsModule,
        SafeHtmlPipe,
        AngularEditorModule,
        FormsModule,
        QuillViewComponent,
        QuillViewHTMLComponent,
        NzInputModule,
        ReactiveFormsModule,
        NzDatePickerModule,
        NzFormModule,
        NgxIntlTelInputModule,
        ConnectLeagueAccountsComponent,
        LeagueAccountsComponent,
        NzRadioModule,
        ResponsiveImagePipe,
        NzModalModule,
        CountdownPipe,
        MarqueeComponent,
        DefaultImagePipe,
        NzAvatarModule,
        NzCheckboxModule,
        UserTimezoneComponent,
        TranslateModule,
        FilterPipe,
    ],
  providers: [NzModalService, TournamentService]
})
export class TournamentModule {
}
