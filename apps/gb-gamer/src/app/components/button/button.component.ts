import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzButtonModule, NzButtonType} from "ng-zorro-antd/button";

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, NzButtonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() type: NzButtonType = 'default';
  @Input() variant: string;
  @Input() width: string;
  @Input() height: string;
  @Input() disabled: boolean;
  @Input() borderRadius: string = '20!important';
  @Input() href: string;
}
