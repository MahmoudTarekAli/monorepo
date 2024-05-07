import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CreateTournamentRoutingModule} from './create-tournament-routing.module';
import {CreateTournamentComponent} from './create-tournament.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../shared/shared.module";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {ImageCropperModule} from "ngx-image-cropper";
import {NzInputNumberModule} from 'ng-zorro-antd/input-number'
// import {OWL_DATE_TIME_FORMATS, OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {NzAffixModule} from "ng-zorro-antd/affix";
export const MY_NATIVE_FORMATS = {
  fullPickerInput: {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'},
  datePickerInput: {year: 'numeric', month: 'numeric', day: 'numeric'},
  timePickerInput: {hour: 'numeric', minute: 'numeric'},
  monthYearLabel: {year: 'numeric', month: 'short'},
  dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
  monthYearA11yLabel: {year: 'numeric', month: 'long'},
};

@NgModule({
  declarations: [
    CreateTournamentComponent
  ],
  exports: [
    CreateTournamentComponent
  ],
  imports: [
    CommonModule,
    CreateTournamentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ImageCropperModule,
    CKEditorModule,
    NzInputNumberModule,
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule,
    NzAffixModule,
    // NgxsFormPluginModule
    // NgxsModule.forFeature([TournamentProcessState])

  ],
  providers: [
    // {provide: OWL_DATE_TIME_FORMATS, useValue: MY_NATIVE_FORMATS},
  ],
})
export class CreateTournamentModule {
}
