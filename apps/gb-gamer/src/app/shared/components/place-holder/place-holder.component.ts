import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-place-holder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './place-holder.component.html',
  styleUrls: ['./place-holder.component.scss']
})
export class PlaceHolderComponent {
@Input() text: string;
@Input() className: string;
}
