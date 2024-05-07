import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SingleDoubleBracketViewRoutingModule } from './single-double-bracket-view-routing.module';
import { SingleDoubleBracketViewComponent } from './single-double-bracket-view.component';
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {SharedModule} from "../../../../../shared/shared.module";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    SingleDoubleBracketViewComponent
  ],
    imports: [
        CommonModule,
        SingleDoubleBracketViewRoutingModule,
        NzAvatarModule,
        NzCheckboxModule,
        NzDividerModule,
        SharedModule,
        FormsModule
    ]
})
export class SingleDoubleBracketViewModule { }
