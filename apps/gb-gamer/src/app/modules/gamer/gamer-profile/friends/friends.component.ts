import { Component } from '@angular/core';
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {LoadingIndicatorComponent} from "../../../../shared/components/loading-indicator/loading-indicator.component";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: 'app-friends',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.scss'],
  imports: [
    NzTabsModule,
    LoadingIndicatorComponent,
    NgIf,
    RouterLink,
    TranslateModule
  ],
    standalone: true

})
export class FriendsComponent {

}
