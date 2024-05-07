import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Select, Store} from "@ngxs/store";
import {ActivatedRoute, Router,  RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {GetEventTournaments} from "../../../../events/state/event.action";
import {TournamentCardComponent} from "../../../../../shared/components/tournament-card/tournament-card.component";
import {ChallengeCardComponent} from "../../../../../shared/components/gb-card/challenge-card.component";
import {EventState} from "../../../../events/state/event.state";
import {Observable} from "rxjs";
import {MarqueeComponent} from "../../../../../shared/components/marquee/marquee.component";
import {RemoveSpacesPipe} from "../../../../../shared/pipes/remove-spaces.pipe";


@Component({
  selector: 'app-tournaments-playground',
  standalone: true,
  imports: [CommonModule, TournamentCardComponent, ChallengeCardComponent, MarqueeComponent, RouterLink, RouterLinkActive, RouterOutlet, RemoveSpacesPipe],
  templateUrl: './tournaments-playground.component.html',
  styleUrls: ['./tournaments-playground.component.scss']
})
export class TournamentsPlaygroundComponent {
  @Select(EventState.getEventTournamentsOrChallenges) tournaments$: Observable<any>;
  selectedGame: any = null
  constructor(private store:Store, private activatedRoute: ActivatedRoute, private router: Router ) {

  }
}
