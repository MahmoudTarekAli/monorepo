import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TimelineStatus} from "../../../modules/tournament/models/timeline";

@Component({
  selector: 'app-timeline-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline-card.component.html',
  styleUrls: ['./timeline-card.component.scss']
})
export class TimelineCardComponent {

  @Input() title: string
  @Input() status: TimelineStatus
  @Input() subTitle: string
  @Input() index: number

  timeLineStatus = TimelineStatus

  constructor() {
  }


}
