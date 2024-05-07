import {Component} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-production-server-alert',
  standalone: true,
  templateUrl: './production-server-alert.component.html',
  imports: [
    NzAlertModule,
    NgIf
  ],
  styleUrls: ['./production-server-alert.component.scss']
})
export class ProductionServerAlertComponent {
  env = environment
  isProduction: boolean

  constructor() {
    this.isProduction = this.env.apiUrl.includes('staging')
  }

}
