import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {fadeInDownOnEnterAnimation, fadeInOnEnterAnimation, fadeOutOnLeaveAnimation, fadeOutUpOnLeaveAnimation} from "angular-animations";


@Component({
  selector: 'app-match-list-container',
  templateUrl: './match-list-container.component.html',
  styleUrls: ['./match-list-container.component.scss'],
  animations: [
    fadeInOnEnterAnimation({anchor: 'enter', duration: 800}),
    fadeOutOnLeaveAnimation({anchor: 'leave', duration: 400}),
  ],
})
export class MatchListContainerComponent implements OnInit {
  @Input() customButtons: TemplateRef<any>;
  @Input() customTemplate: TemplateRef<any>;
  @Input() createButton: TemplateRef<any>;
  @Input() title: string;
  @Input() sectionTitle: string;
  constructor() {
  }

  ngOnInit(): void {
  }

}
