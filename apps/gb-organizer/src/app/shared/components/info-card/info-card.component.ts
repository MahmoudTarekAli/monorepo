import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgForOf, NgIf, UpperCasePipe} from "@angular/common";

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  standalone: true,
  imports: [
    UpperCasePipe,
    NgIf,
    NgForOf
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
