import {NgModule} from '@angular/core';
import {LayoutModule} from '../components/cleanui/layout/layout.module';

import {LayoutMainComponent} from './Main/main.component';
import {SharedModule} from '../shared/shared.module';
import {NoSideMenuComponent} from "./no-side-menu/no-side-menu.component";
import {CommonModule} from "@angular/common";

const COMPONENTS = [LayoutMainComponent, NoSideMenuComponent];

@NgModule({
  imports: [SharedModule, LayoutModule , CommonModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class LayoutsModule {
}
