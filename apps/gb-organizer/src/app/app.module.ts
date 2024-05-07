import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, LOCALE_ID} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsResetPluginModule} from 'ngxs-reset-plugin';
import {SettingState} from './store/setting_ngxs/setting.state.';
registerLocaleData(en);
import {CoreModule} from './core/core.module';
import {CanActivateViaAuthGuard} from './modules/authentication/auth-guard/auth.guard';
import {NZ_I18N, en_US} from 'ng-zorro-antd/i18n';
import {CanActivateIsViewerGuard} from "./modules/authentication/auth-guard/is-viewer.guard";
import {NgxsModule} from '@ngxs/store';
import {NgxsStoragePluginModule} from '@ngxs/storage-plugin';
import {NgxsActionsExecutingModule} from '@ngxs-labs/actions-executing';
import {GlobalState} from "./shared/state/global.state";
import {AuthenticationState} from './modules/authentication/state/authentication.state'
import {NgxsDispatchPluginModule} from '@ngxs-labs/dispatch-decorator';
import {TournamentState} from "./modules/tournaments/state/tournament.state";
import {CanActivateViaBracketGuard} from "./modules/edit-tournament/tournament-process/services/bracket.guard";
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import {LottieCacheModule, LottieModule} from 'ngx-lottie';
import player from 'lottie-web';
import {PendingChangesGuard} from "./shared/guards/pendingChanges";
import {GuestGuard} from "./modules/authentication/auth-guard/guest-guard";
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../environments/environment';
// import {VirtualScrollerModule} from "ngx-virtual-scroller";
// import {ScrollingModule} from "@angular/cdk/scrolling";
import {MatchListState} from "./modules/edit-tournament/manage-tournaments/match-list/state/match-list.state";
import {OrganizerGuard} from "./modules/authentication/auth-guard/organizer-guard";
import {RouterModule} from "@angular/router";
// import { GbarenaNavbarModule } from '@gbarena/gbarena-navbar';
import {NgProgressComponent, NgProgressModule} from "ngx-progressbar";
import {NgProgressHttpModule} from "ngx-progressbar/http";
import {AppComponent} from "./app.component";

const LOCALE_PROVIDERS = [
    {provide: LOCALE_ID, useValue: 'en'},
    {provide: NZ_I18N, useValue: en_US},
];

export function playerFactory() {
    return player;
}

// @ts-ignore
@NgModule({
    declarations: [AppComponent],
    imports: [
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        AppRoutingModule,
        CoreModule,
        // translate
        TranslateModule.forRoot(),
        NzDrawerModule,
        // ngrx
        // StoreModule.forRoot(reducers, {metaReducers}),
        // EffectsModule.forRoot([]),
        // StoreRouterConnectingModule.forRoot(),
        // nprogress
      NgProgressComponent,
      NgProgressModule.withConfig({
        thick: true,
        spinner: false,
        color: '#00DDBD',
      }),
      // NgProgressRouterModule,
      NgProgressHttpModule,
        NgxsDispatchPluginModule.forRoot(),
        // NgxsFormPluginModule.forRoot(),
        NgxsModule.forRoot([AuthenticationState, SettingState, GlobalState, TournamentState, MatchListState]),
        NgxsStoragePluginModule.forRoot({
            key: 'setting',
        }),
        LottieModule.forRoot({player: playerFactory}),
        LottieCacheModule.forRoot(),
        NgxsReduxDevtoolsPluginModule.forRoot({
            disabled: environment.production,
        }),
        NgxsResetPluginModule.forRoot(),
        // NgxsLoggerPluginModule.forRoot(),
        NgxsActionsExecutingModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
        // SharedModule,
        // VirtualScrollerModule,
        // ScrollingModule,
        // GbarenaNavbarModule.forRoot(environment),
    ],
    providers: [
        // auth services
        // fake http interceptors
        CanActivateViaAuthGuard,
        CanActivateIsViewerGuard,
        CanActivateViaBracketGuard,
        GuestGuard,
        OrganizerGuard,
        // locale providers2
        ...LOCALE_PROVIDERS,
        PendingChangesGuard,

    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
