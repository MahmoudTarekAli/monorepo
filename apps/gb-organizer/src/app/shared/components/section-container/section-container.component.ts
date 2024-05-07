import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {
  fadeInDownOnEnterAnimation,
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  fadeOutUpOnLeaveAnimation
} from "angular-animations";
import {
  TournamentProcessState
} from "../../../modules/edit-tournament/tournament-process/state/tournament-process.state";
import {Observable} from "rxjs";
import {Select} from "@ngxs/store";


@Component({
  selector: 'app-section-container',
  templateUrl: './section-container.component.html',
  styleUrls: ['./section-container.component.scss'],
  animations: [
    fadeInOnEnterAnimation({anchor: 'enter', duration: 800}),
    fadeOutOnLeaveAnimation({anchor: 'leave', duration: 400}),
  ],
})
export class SectionContainerComponent implements OnInit {
  @Input() customButtons: TemplateRef<any>;
  @Input() customTemplate: TemplateRef<any>;
  @Input() createButton: TemplateRef<any>;
  @Input() title: string;
  @Input() sectionTitle: string;
  @Input() isTournamentBracket;
  @Input() saveBracket: TemplateRef<any>;

  tournamentCode: string;
  @Select(TournamentProcessState.getTournament) getTournament$: Observable<any>;

  constructor() {
  }

  ngOnInit(): void {
    this.getTournament$.subscribe(data => {
      // console.log(data)
      this.tournamentCode = data?.code
    })
  }

}
