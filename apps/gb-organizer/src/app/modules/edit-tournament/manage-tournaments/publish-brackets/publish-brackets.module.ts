import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PublishBracketsRoutingModule} from './publish-brackets-routing.module';
import {PublishBracketsComponent} from './publish-brackets.component';
import {PublishTopbarComponent} from "./publish-topbar/publish-topbar.component";
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import {PublishBracketGuard} from "../services/publish-bracket.guard";


@NgModule({
  declarations: [
    PublishBracketsComponent,
    PublishTopbarComponent
  ],
  imports: [
    CommonModule,
    PublishBracketsRoutingModule,
    NzPageHeaderModule,
    NzIconModule,
    NzButtonModule
  ],
  providers: [PublishBracketGuard]
})
export class PublishBracketsModule {
}
