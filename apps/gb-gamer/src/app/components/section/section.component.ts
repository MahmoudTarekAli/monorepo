import {Component, Input, TemplateRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {Simulate} from "react-dom/test-utils";
import input = Simulate.input;

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, NzPageHeaderModule, NzSpaceModule],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent {
  @Input() customButtons: TemplateRef<any>;
  @Input() title: string;
  @Input() container: any;
  @Input() icon: string;
  @Input() margin: any;
}
