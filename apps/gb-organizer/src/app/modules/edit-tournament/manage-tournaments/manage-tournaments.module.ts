import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ManageTournamentsRoutingModule} from './manage-tournaments-routing.module';
import {ManageTournamentsComponent} from './manage-tournaments.component';
import { ConvertNumToCharPipe } from './pipes/convert-num-to-char.pipe';
import { SendMessageComponent } from './dialogs/send-message/send-message.component';
import {NzInputModule} from "ng-zorro-antd/input";
import {NzTagModule} from "ng-zorro-antd/tag";
import {FormsModule} from "@angular/forms";
import {NzButtonModule} from "ng-zorro-antd/button";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {TeamViewComponent} from "../../../shared/components/team-view/team-view.component";
import {NzListModule} from "ng-zorro-antd/list";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {SharedModule} from "../../../shared/shared.module";
import {AngularEditorModule} from "@kolkov/angular-editor";


@NgModule({
  declarations: [
    ManageTournamentsComponent,
    ConvertNumToCharPipe,
    SendMessageComponent,
    TeamViewComponent

  ],
  exports: [
    ConvertNumToCharPipe
  ],
  imports: [
    CommonModule,
    ManageTournamentsRoutingModule,
    NzInputModule,
    NzTagModule,
    FormsModule,
    NzButtonModule,
    CKEditorModule,
    NzListModule,
    NzCollapseModule,
    NzAvatarModule,
    SharedModule,
    AngularEditorModule,
  ],

})
export class ManageTournamentsModule {
}
