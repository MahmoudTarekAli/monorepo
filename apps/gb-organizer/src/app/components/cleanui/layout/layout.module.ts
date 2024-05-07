import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

import {TopbarComponent} from './Topbar/topbar.component';
import {TopbarActionsComponent} from './Topbar/Actions/actions.component';
import {TopbarSearchComponent} from './Topbar/Search/search.component';
import {TopbarUserMenuComponent} from './Topbar/UserMenu/user-menu.component';
import {MenuLeftComponent} from './Menu/MenuLeft/menu-left.component';
import {MenuTopComponent} from './Menu/MenuTop/menu-top.component';
import {FooterComponent} from './Footer/footer.component';
import {BreadcrumbsComponent} from './Breadcrumbs/breadcrumbs.component';
import {SidebarComponent} from './Sidebar/sidebar.component';
import {TopbarLanguageSwitcherComponent} from './Topbar/LanguageSwitcher/language-switcher.component';
import {SharedModule} from '../../../shared/shared.module';
import {LottieModule} from "ngx-lottie";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import { EchoSystemComponent } from './Topbar/echo-system/echo-system.component';
import {ButtonComponent} from "../../../shared/components/button/button.component";
import {FormatCoinsPipe} from "../../../shared/pipes/format-coins.pipe";
import {UserMenuComponent} from "../../../shared/components/user-menu/user-menu.component";
import {NgScrollbar} from "ngx-scrollbar";
// import {GbarenaNavbarComponent} from "@gbarena/gbarena-navbar";

const COMPONENTS = [
  TopbarLanguageSwitcherComponent,
  TopbarComponent,
  TopbarSearchComponent,
  TopbarUserMenuComponent,
  TopbarActionsComponent,
  MenuLeftComponent,
  MenuTopComponent,
  FooterComponent,
  BreadcrumbsComponent,
  SidebarComponent,
];

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        // PerfectScrollbarModule,
        LottieModule,
        NzBadgeModule,
        NzPopoverModule,
        ButtonComponent,
        EchoSystemComponent,
        FormatCoinsPipe,
        UserMenuComponent,
        NgScrollbar,
        // GbarenaNavbarComponent
    ],
  declarations: [...COMPONENTS],
    exports: [...COMPONENTS],
})
export class LayoutModule {
}
