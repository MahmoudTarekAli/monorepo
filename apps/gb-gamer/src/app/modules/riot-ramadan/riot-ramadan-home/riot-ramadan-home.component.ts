import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {QuestsComponent} from "../components/quests/quests.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {RiotRamadanComponent} from "../riot-ramadan.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {ChallengeCardComponent} from "../../../shared/components/gb-card/challenge-card.component";
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";
import {CardListComponent} from "../../../shared/components/card-list/card-list.component";
import {FilterPopoverComponent} from "../../../shared/components/filter-popover/filter-popover.component";
import {SectionComponent} from "../../../components/section/section.component";
import {FaqComponent} from "../components/faq/faq.component";
import {NzButtonModule} from "ng-zorro-antd/button";
import {SliceArrayPipe} from "../../../shared/pipes/sliceArray.pipe";
import {Select, Store} from "@ngxs/store";
import {EventState} from "../../events/state/event.state";
import {Observable} from "rxjs";
import {Challenge} from "../../../shared/models/challenge";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {GetEventChallenge} from "../../events/state/event.action";
import {AuthService} from "../../authentication/services/auth.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-riot-ramadan-home',
  standalone: true,
  imports: [CommonModule, QuestsComponent, ButtonComponent, RouterLink, TranslateModule, ChallengeCardComponent, LoadingIndicatorComponent, CardListComponent, FilterPopoverComponent, SectionComponent, FaqComponent, NzButtonModule, SliceArrayPipe],
  templateUrl: './riot-ramadan-home.component.html',
  styleUrls: ['./riot-ramadan-home.component.scss']
})
export class RiotRamadanHomeComponent {
  activeItem: string = 'challenges';
  activeGame: string = 'league-of-legends';
  @Select(EventState.getEventChallenges) challenges$: Observable<Challenge[]>;
  @Select(hasActionsExecuting([GetEventChallenge])) getChallengesIsExecuting$: Observable<Boolean>;
  constructor(private store:Store, public router:Router , private activateRoute:ActivatedRoute, public authService: AuthService) {
    this.activateRoute.queryParams.subscribe((param:any) => {
      if (param?.game){
        this.activeGame = param.game
      }
    })

  }
  filterByGame(gameCode:string){
    this.activeGame = gameCode
    this.router.navigate([], {
      relativeTo: this.activateRoute,
      queryParams: {
        game: this.activeGame
      },
    });
  }

  scrollTo(menuItem:string): void {
    document.getElementById(menuItem)?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    // element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    this.activeItem = menuItem; // Set the active menu item
  }
  routeLogin(){
    window.location.href = environment.sso_url + '?source=' + window.origin + this.router.url

  }
}
