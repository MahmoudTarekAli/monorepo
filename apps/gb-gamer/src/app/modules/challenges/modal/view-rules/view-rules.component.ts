import {Component, Input, OnInit} from '@angular/core';
import {SectionComponent} from "../../../../components/section/section.component";
import {ButtonComponent} from "../../../../components/button/button.component";
import {NgClass, NgIf, NgStyle, UpperCasePipe} from "@angular/common";

@Component({
  selector: 'app-view-rules',
  templateUrl: './view-rules.component.html',
  styleUrls: ['./view-rules.component.scss'],
  imports: [
    SectionComponent,
    ButtonComponent,
    UpperCasePipe,
    NgClass,
    NgStyle,
    NgIf
  ],
  standalone: true
})
export class ViewRulesComponent implements OnInit {
  @Input() gameBanner: string;
  @Input() challengeRules: string;
  constructor() { }

  ngOnInit(): void {
    console.log(this.gameBanner)
  }

}
