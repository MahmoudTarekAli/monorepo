import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EventCardComponent} from "../../../shared/components/event-card/event-card.component";
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";
import {EventsService} from "../service/events.service";

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, EventCardComponent, LoadingIndicatorComponent],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent {

  events: any
  loading: boolean

  constructor(private eventService: EventsService) {
  }

  ngOnInit() {
    this.loading = true
    this.eventService.getEvents().subscribe(events => {
      console.log(events)
      this.loading = false
      this.events = events
    })
  }
}
