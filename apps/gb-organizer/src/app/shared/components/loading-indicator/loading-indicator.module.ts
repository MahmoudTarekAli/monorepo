import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoadingIndicatorComponent} from './loading-indicator.component';
import {LottieModule} from "ngx-lottie";

@NgModule({
  imports: [
    CommonModule,
    LottieModule
  ],
  declarations: [LoadingIndicatorComponent],
  exports: [LoadingIndicatorComponent]
})
export class LoadingIndicatorModule {
}
