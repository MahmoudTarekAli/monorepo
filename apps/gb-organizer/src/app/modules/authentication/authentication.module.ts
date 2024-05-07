import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AuthenticationRoutingModule} from './authentication-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {LayoutModule} from '../../components/cleanui/layout/layout.module';
import {SharedModule} from '../../shared/shared.module';
import {MatInputModule} from '@angular/material/input';
import { NgxsModule } from '@ngxs/store'
import { AuthenticationState } from './state/authentication.state'
import {SettingState} from "../../store/setting_ngxs/setting.state.";

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule,
    SharedModule,
    LayoutModule,
    MatInputModule,
  ],
})
export class AuthenticationModule {
}
