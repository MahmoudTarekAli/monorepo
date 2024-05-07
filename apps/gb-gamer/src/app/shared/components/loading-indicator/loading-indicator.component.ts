import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss'],
  standalone: true
})
export class LoadingIndicatorComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }

}
