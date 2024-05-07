import {Component, Input, OnInit} from '@angular/core';
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'app-no-result',
  templateUrl: './no-result.component.html',
  styleUrls: ['./no-result.component.scss']
})
export class NoResultComponent implements OnInit {
  options: AnimationOptions = {
    path: 'assets/123723-search-empty.json',
    loop: 2,
  };
  @Input() message = 'No data found';
  @Input() image: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}