import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Select, Store} from "@ngxs/store";
import {EventState} from "../../../events/state/event.state";
import {Observable} from "rxjs";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {GetEvent, GetEventTournaments} from "../../../events/state/event.action";
import {TournamentCardComponent} from "../../../../shared/components/tournament-card/tournament-card.component";
import {ChallengeCardComponent} from "../../../../shared/components/gb-card/challenge-card.component";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {tap} from "rxjs/operators";
import {GamerService} from "../../../gamer/service/gamer.service";
import {NzCarouselModule, NzCarouselTransformNoLoopStrategy,
  NzCarouselFlipStrategy,
  NZ_CAROUSEL_CUSTOM_STRATEGIES} from 'ng-zorro-antd/carousel';


@Component({
  selector: 'app-playground-home',
  standalone: true,
  imports: [CommonModule, TournamentCardComponent, ChallengeCardComponent, RouterLink, NzDividerModule, NzCarouselModule],
  templateUrl: './playground-home.component.html',
  styleUrls: ['./playground-home.component.scss'],
  providers: [
    {
      provide: NZ_CAROUSEL_CUSTOM_STRATEGIES,
      useValue: [
        { name: 'transform-no-loop', strategy: NzCarouselTransformNoLoopStrategy },
        { name: 'flip', strategy: NzCarouselFlipStrategy }
      ]
    }
  ]
})
export class PlaygroundHomeComponent {
  @Select(EventState.getEvent) event$: Observable<any>;
  selectedGame: any = null
  hasAccount = false;
  public strategy = 'transform-no-loop';
  public array = [1, 2, 3];
  nzAutoPlay: false;
  constructor(private store: Store, private gamerService: GamerService, private router: Router) {
      // this.store.dispatch(new GetEventTournaments('kings-arena-2-event', null, 1, this.selectedGame))
  }

  ngOnInit() {
    this.store.dispatch(new GetEvent('playgrounds-season-3'))

  }

}
