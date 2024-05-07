import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GbPremiumRoutingModule } from './gb-premium-routing.module';
import { GbPremiumComponent } from './gb-premium.component';


@NgModule({
  declarations: [
    GbPremiumComponent
  ],
  imports: [
    CommonModule,
    GbPremiumRoutingModule
  ]
})
export class GbPremiumModule { }
