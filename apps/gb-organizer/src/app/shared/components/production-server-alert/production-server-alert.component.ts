import {Component} from '@angular/core';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-production-server-alert',
  templateUrl: './production-server-alert.component.html',
  styleUrls: ['./production-server-alert.component.scss']
})
export class ProductionServerAlertComponent {
  env = environment
  isProduction: boolean

  constructor() {
    this.isProduction = this.env.apiUrl.includes('staging')
  }

}
