import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {SectionComponent} from "../../components/section/section.component";
import {ButtonComponent} from "../../components/button/button.component";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {TournamentCardComponent} from "../../shared/components/tournament-card/tournament-card.component";
import {ChallengeCardComponent} from "../../shared/components/gb-card/challenge-card.component";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {TranslateModule} from "@ngx-translate/core";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {CountryPipe} from "../../shared/pipes/country.pipe";
import {GetEvent} from "../events/state/event.action";
import {Select, Store} from "@ngxs/store";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {GetFeaturedGames} from "../home/state/home.action";
import {Observable} from "rxjs";
import {LoadingIndicatorComponent} from "../../shared/components/loading-indicator/loading-indicator.component";

@Component({
  selector: 'app-riot-mena',
  templateUrl: './riot-mena.component.html',
  styleUrls: ['./riot-mena.component.scss'],
  imports: [
    NgClass,
    SectionComponent,
    ButtonComponent,
    RouterLink,
    NgTemplateOutlet,
    TournamentCardComponent,
    NgForOf,
    ChallengeCardComponent,
    NgIf,
    NzTableModule,
    NzPaginationModule,
    TranslateModule,
    NzAvatarModule,
    CountryPipe,
    RouterLinkActive,
    RouterOutlet,
    AsyncPipe,
    LoadingIndicatorComponent
  ],
  standalone: true
})
export class RiotMenaComponent implements OnInit {
  @Select(hasActionsExecuting([GetEvent])) getEventIsExecuting$: Observable<Boolean>;

  constructor(private store:Store) {
  }
  ngOnInit() {
    this.store.dispatch(new GetEvent('riot-main-event'))

  }

}
