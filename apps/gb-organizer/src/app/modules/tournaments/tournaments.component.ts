import {Component, OnInit} from '@angular/core';
import {Select, Store} from "@ngxs/store";

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit {
  constructor(private store: Store) {
  }

  ngOnInit() {

  }

}
