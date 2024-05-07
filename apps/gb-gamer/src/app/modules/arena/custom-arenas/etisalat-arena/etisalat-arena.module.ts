import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtisalatArenaRoutingModule } from './etisalat-arena-routing.module';
import {NzModalService} from "ng-zorro-antd/modal";
import {NgxsModule} from "@ngxs/store";
import {ArenasState} from "../../state/arenas.state";
import {CustomArenasState} from "../state/custom-arenas.state";


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    EtisalatArenaRoutingModule,
    NgxsModule.forFeature([ ArenasState ,CustomArenasState]),
  ],
  providers: []
})
export class EtisalatArenaModule { }
