import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {SectionComponent} from "../../../components/section/section.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {TournamentCardComponent} from "../../../shared/components/tournament-card/tournament-card.component";
import {ChallengeCardComponent} from "../../../shared/components/gb-card/challenge-card.component";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {TranslateModule} from "@ngx-translate/core";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {CountryPipe} from "../../../shared/pipes/country.pipe";
import {Select, Store} from "@ngxs/store";
import {HomeState} from "../../home/state/home.state";
import {Observable} from "rxjs";
import {Tournament} from "../../../shared/models/tournament";
import {SliceArrayPipe} from "../../../shared/pipes/sliceArray.pipe";
import {GetTournaments} from "../../home/state/home.action";
import {SharedRiotTableComponent} from "../shared/shared-riot-table/shared-riot-table.component";
import {GetEvent, GetEventPlayables} from "../../events/state/event.action";
import {EventState} from "../../events/state/event.state";
import {TournamentChallengesComponent} from "../tournament-challenges/tournament-challenges.component";
import {NzCollapseModule} from "ng-zorro-antd/collapse";

@Component({
  selector: 'app-riot-home',
  standalone: true,
  imports: [NgClass,
    SectionComponent,
    ButtonComponent,
    RouterLink,
    NgTemplateOutlet,
    TournamentCardComponent,
    NgForOf,
    ChallengeCardComponent,
    NgIf,
    TranslateModule,
    NzAvatarModule,
    RouterLinkActive,
    RouterOutlet, SliceArrayPipe, AsyncPipe, SharedRiotTableComponent, TournamentChallengesComponent, NzCollapseModule],
  templateUrl: './riot-home.component.html',
  styleUrls: ['./riot-home.component.scss']
})
export class RiotHomeComponent implements OnInit{
  tournaments:any
  sponsorList = ['cocacola-logo.png' , 'msi-logo.png' , 'redbull-logo.png' , 'msi-logo.png' , 'cocacola-logo.png']
  tournamentQuestion = [
    {question: 'question_one', answer: 'answer_one'},
    {question: 'question_two', answer: 'answer_two'},
    {question: 'question_three', answer: 'answer_three'},
    {question: 'question_four', answer: 'answer_four'},
    {question: 'question_five', answer: 'answer_five'},
    {question: 'question_six', answer: 'answer_six'},
    {question: 'question_seven', answer: 'answer_seven'},
    {question: 'question_eight', answer: 'answer_eight'},
    {question: 'question_nine', answer: 'answer_nine'},
    {question: 'question_ten', answer: 'answer_ten'},
  ]

constructor(private store:Store) {
}
ngOnInit() {
}

}
