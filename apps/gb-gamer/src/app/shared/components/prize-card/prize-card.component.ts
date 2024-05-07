import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {OrderPipe} from "../../pipes/order.pipe";

@Component({
  selector: 'app-prize-card',
  standalone: true,
  imports: [CommonModule, NzPopoverModule, OrderPipe],
  templateUrl: './prize-card.component.html',
  styleUrls: ['./prize-card.component.scss']
})
export class PrizeCardComponent {
  @Input() isMultiplePrizes: boolean = false
  @Input() prize: any


}
