import { Component } from '@angular/core';
import {AsyncPipe, NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {ButtonComponent} from "../../../components/button/button.component";
import {ChallengeCardComponent} from "../../../shared/components/gb-card/challenge-card.component";
import {TranslateModule} from "@ngx-translate/core";
import {RiotRamadanComponent} from "../riot-ramadan.component";
import {Router, RouterLink} from "@angular/router";
import {Select} from "@ngxs/store";
import {EventState} from "../../events/state/event.state";
import {Observable} from "rxjs";
import {Challenge} from "../../../shared/models/challenge";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {GetEventChallenge} from "../../events/state/event.action";
import {NzPaginationModule} from "ng-zorro-antd/pagination";

@Component({
  selector: 'app-riot-challenges-list',
  templateUrl: './riot-challenges-list.component.html',
  styleUrls: ['./riot-challenges-list.component.scss'],
  imports: [
    AsyncPipe,
    ButtonComponent,
    ChallengeCardComponent,
    NgForOf,
    NgIf,
    TranslateModule,
    UpperCasePipe,
    NzPaginationModule,
    RouterLink
  ],
  standalone: true
})
export class RiotChallengesListComponent{
  @Select(EventState.getEventChallenges) challenges$: Observable<Challenge[]>;
  @Select(hasActionsExecuting([GetEventChallenge])) getChallengesIsExecuting$: Observable<Boolean>;
  selectedGame = ''
  constructor(public router:Router) {
    this.selectedGame = router.url.includes('valorant') ? 'Valorant' : 'League of legends'
  }

}
