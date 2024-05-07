import {Component, Input} from '@angular/core';
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-ad-banner',
  templateUrl: './ad-banner.component.html',
  standalone: true,
  imports: [
    NgStyle
  ],
  styleUrls: ['./ad-banner.component.scss']
})
export class AdBannerComponent {
  @Input() height: number = 260
  @Input() backgroundImage: string = 'https://images3.alphacoders.com/110/1104327.jpg'
  @Input() title = ''
  @Input() desc = ''
}
