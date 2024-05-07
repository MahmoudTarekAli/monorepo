import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TournamentRulesRoutingModule } from './tournament-rules-routing.module';
import { TournamentRulesComponent } from './tournament-rules.component';
import { SharedModule } from '../../../../shared/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CKEditorModule } from '@ckeditor/ckeditor5-angular'
import {NzCollapseModule} from "ng-zorro-antd/collapse";


@NgModule({
  declarations: [
    TournamentRulesComponent
  ],
    imports: [
        CommonModule,
        TournamentRulesRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        CKEditorModule,
        NzCollapseModule
    ]
})
export class TournamentRulesModule { }
