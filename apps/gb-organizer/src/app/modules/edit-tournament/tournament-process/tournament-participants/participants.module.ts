import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParticipantsRoutingModule } from './participants-routing.module';
import { ParticipantsComponent } from './participants.component';
import { SharedModule } from '../../../../shared/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { LoadingIndicatorModule } from '../../../../shared/components/loading-indicator/loading-indicator.module'


@NgModule({
  declarations: [
    ParticipantsComponent
  ],
  imports: [
    CommonModule,
    ParticipantsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingIndicatorModule,

  ],
})
export class ParticipantsModule { }
