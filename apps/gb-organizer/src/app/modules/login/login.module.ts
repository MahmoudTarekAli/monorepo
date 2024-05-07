import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "../../shared/shared.module";
import {LayoutModule} from "../../components/cleanui/layout/layout.module";
import {EchoSystemComponent} from "../../components/cleanui/layout/Topbar/echo-system/echo-system.component";


@NgModule({
  declarations: [
    LoginComponent
  ],
    imports: [
        CommonModule,
        LoginRoutingModule,
        TranslateModule,
        SharedModule,
        LayoutModule,
        EchoSystemComponent
    ]
})
export class LoginModule { }
