import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SectionComponent} from "../../../components/section/section.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {RouterLink} from "@angular/router";
import {NzModalRef} from "ng-zorro-antd/modal";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-premium-card-alert',
  standalone: true,
  imports: [CommonModule, SectionComponent, ButtonComponent, RouterLink, TranslateModule],
  templateUrl: './premium-card-alert.component.html',
  styleUrls: ['./premium-card-alert.component.scss']
})
export class PremiumCardAlertComponent {
  @Input() type: string;
  @Input() title: string;
  constructor(public modal:NzModalRef) {
  }
}
