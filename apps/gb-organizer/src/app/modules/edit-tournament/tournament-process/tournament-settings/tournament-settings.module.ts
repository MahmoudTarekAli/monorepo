import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TournamentSettingsRoutingModule } from './tournament-settings-routing.module';
import { TournamentSettingsComponent } from './tournament-settings.component';
import { SharedModule } from '../../../../shared/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ObjectValuePipe } from '../../../../shared/pipes/object-value.pipe'
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";


@NgModule({
    declarations: [
        TournamentSettingsComponent,
        ObjectValuePipe,

    ],
    imports: [
        CommonModule,
        TournamentSettingsRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgxIntlTelInputModule
    ],
    exports: [
    ]
})
export class TournamentSettingsModule { }
