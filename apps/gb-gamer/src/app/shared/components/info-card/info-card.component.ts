import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  standalone: true,
  imports: [
    UpperCasePipe,
    NgIf,
    NgForOf,
    TranslateModule
  ],
  styleUrls: ['./info-card.component.scss'],

})
export class InfoCardComponent {
  @Input() icon: string
  @Input() title: string
  @Input() subTitle: any
  @Input() subTitles: any
  @Input() type: any
}
