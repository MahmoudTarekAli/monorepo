import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss']
})
export class TitleBarComponent {
  @Input() title:string;
  @Input() svg:string;
}
