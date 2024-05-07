import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {SectionComponent} from "../../../components/section/section.component";
import {TournamentCardComponent} from "../../../shared/components/tournament-card/tournament-card.component";
import {ChallengeCardComponent} from "../../../shared/components/gb-card/challenge-card.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {Select, Store} from "@ngxs/store";
import {EventState} from "../../events/state/event.state";
import {Observable} from "rxjs";
import {GetEventPlayables} from "../../events/state/event.action";
import {RouterLink} from "@angular/router";
import {SliceArrayPipe} from "../../../shared/pipes/sliceArray.pipe";
import {NzPaginationModule} from "ng-zorro-antd/pagination";

@Component({
  selector: 'app-tournament-challenges',
  standalone: true,
  imports: [CommonModule, SectionComponent, TournamentCardComponent, ChallengeCardComponent, ButtonComponent, RouterLink, SliceArrayPipe, NzPaginationModule],
  templateUrl: './tournament-challenges.component.html',
  styleUrls: ['./tournament-challenges.component.scss']
})
export class TournamentChallengesComponent {
  @Select(EventState.getEventPlayables) eventPlayables$: Observable<any>;
  @Input() showButton = false;
  @Input() sliceNumber = 0;
  page = 1;
  constructor(private store:Store) {
  }
  ngOnInit() {
    this.store.dispatch(new GetEventPlayables('riot-main-event'))
  }
  changePages(event: any) {
    console.log(event)
    this.page = event
    this.store.dispatch(new GetEventPlayables('riot-main-event', event))
  }
}
