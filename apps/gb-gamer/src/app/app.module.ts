import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ArenaCardComponent} from "./shared/components/arena-card/arena-card.component";
import {NZ_I18N} from 'ng-zorro-antd/i18n';
import {en_US} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NzButtonModule} from "ng-zorro-antd/button";
import {CoreModule} from "./core/core.module";
import {AuthService} from "./modules/authentication/services/auth.service";
import {NgxsModule} from "@ngxs/store";
import {AuthenticationState} from "./modules/authentication/state/authentication.state";
import {GlobalState} from "./shared/state/global.state";
import {NzNotificationModule} from "ng-zorro-antd/notification";
import {HomeState} from "./modules/home/state/home.state";
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";
import {environment} from "../environments/environment";
import {NgxsResetPluginModule} from "ngxs-reset-plugin";
import {NgxsActionsExecutingModule} from "@ngxs-labs/actions-executing";
import {TranslateModule} from "@ngx-translate/core";
import {GlobalService} from "./shared/service/global.service";
import {SettingState} from "./store/setting_ngxs/setting.state.";
import {AngularFireModule} from "@angular/fire/compat";
import {MessengerState} from "./modules/messenger/state/messenger.state";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {ChatboxComponent} from "./modules/messenger/components/chatbox/chatbox.component";
import {LoadingIndicatorComponent} from "./shared/components/loading-indicator/loading-indicator.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgProgressComponent, NgProgressModule} from "ngx-progressbar";
import {NgProgressHttpModule} from "ngx-progressbar/http";
import {CanActivateViaAuthGuard} from "./modules/authentication/auth-guard/auth.guard";
import {GamerState} from "./modules/gamer/state/gamer.state";
import {SuperAdminGuard} from "./modules/authentication/auth-guard/superAdmin-guard";
import {GuestGuard} from "./modules/authentication/auth-guard/guest-guard";
import {UserGuard} from "./modules/authentication/auth-guard/user.guard";
import {NzAlertModule} from "ng-zorro-antd/alert";
// import {GbarenaNavbarModule} from "@gbarena/gbarena-navbar";
import {NotificationsState} from "./components/notifications/state/notifications.state";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CoreModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzButtonModule,
    NgxsModule.forRoot([AuthenticationState, GlobalState, HomeState, SettingState, GamerState]),
    NzNotificationModule,
    TranslateModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsResetPluginModule.forRoot(),
    // NgxsLoggerPluginModule.forRoot(),
    NgxsActionsExecutingModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    ChatboxComponent,
    NzPopoverModule,
    LoadingIndicatorComponent,
    NgProgressComponent,
    NgProgressModule.withConfig({
      thick: true,
      spinner: false,
      color: '#00DDBD',
    }),
    // NgProgressRouterModule,
    NgProgressHttpModule,
    NzAlertModule,
    // GbarenaNavbarModule.forRoot(environment),


  ],
  providers: [
    {provide: NZ_I18N, useValue: en_US},
    AuthService,
    GlobalService,
    NzModalService,
    CanActivateViaAuthGuard,
    GuestGuard,
    UserGuard,
    SuperAdminGuard

  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
