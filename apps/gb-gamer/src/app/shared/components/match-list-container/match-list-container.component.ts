import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NgIf, NgTemplateOutlet} from "@angular/common";


@Component({
  selector: 'app-match-list-container',
  templateUrl: './match-list-container.component.html',
  styleUrls: ['./match-list-container.component.scss'],
  imports: [
    NzPageHeaderModule,
    NzSpaceModule,
    NgTemplateOutlet,
    NgIf
  ],

  standalone: true
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
