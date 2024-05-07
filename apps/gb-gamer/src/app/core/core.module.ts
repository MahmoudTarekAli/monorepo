import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'

import {JwtInterceptor, NgZoneHttpInterceptor} from './interceptor/JwtInterceptor'

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  declarations: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {provide: HTTP_INTERCEPTORS, useClass: NgZoneHttpInterceptor, multi: true}

  ],
  exports: [RouterModule],
})
export class CoreModule {
}
