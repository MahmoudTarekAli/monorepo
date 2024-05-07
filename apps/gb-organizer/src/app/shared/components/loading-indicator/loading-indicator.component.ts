import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {AnimationOptions} from "ngx-lottie";
import {AnimationItem} from "ngx-lottie/lib/symbols";

@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss']
})
export class LoadingIndicatorComponent implements OnInit {
  @Input('size') size: any;
  options: AnimationOptions = {
    path: 'f1.mp4.lottie.json',
  };

  constructor() {
  }

  ngOnInit() {
  }

}
