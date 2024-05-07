import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TournamentRulesRoutingModule } from './tournament-rules-routing.module';
import { TournamentRulesComponent } from './tournament-rules.component';
import {SectionComponent} from "../../../components/section/section.component";
import {SafeHtmlPipe} from "../../../shared/pipes/safe-html";
import {QuillViewHTMLComponent} from "ngx-quill";
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [
    TournamentRulesComponent
  ],
    imports: [
        CommonModule,
        TournamentRulesRoutingModule,
        SectionComponent,
        SafeHtmlPipe,
        QuillViewHTMLComponent,
        TranslateModule
    ]
})
export class TournamentRulesModule { }
