import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.component.html',
  imports: [
    RouterOutlet
  ],
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {

}
