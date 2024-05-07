import {Component, OnInit} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {GetGamerPreferences, GetGamerStatistics, GetUpcomingMatches} from "../../state/gamer.action";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {GamerService} from "../../service/gamer.service";
import {MatchBarComponent} from "../../../../shared/components/match-bar/match-bar.component";
import {GamesState} from "../../../games/state/games.state";
import {Observable} from "rxjs";
import {Game} from "../../../../shared/models/game";
import {GamerState} from "../../state/gamer.state";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {GameCardComponent} from "../../../../shared/components/game-card/game-card.component";
import {CardListComponent} from "../../../../shared/components/card-list/card-list.component";
import {NzProgressModule} from "ng-zorro-antd/progress";
import {LeagueAccountsComponent} from "../../../../shared/components/league-accounts/league-accounts.component";
import {ButtonComponent} from "../../../../components/button/button.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {PlaceHolderComponent} from "../../../../shared/components/place-holder/place-holder.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
    selector: 'app-my-activity',
    templateUrl: './my-activity.component.html',
    styleUrls: ['./my-activity.component.scss'],
  imports: [
    MatchBarComponent,
    AsyncPipe,
    NgForOf,
    GameCardComponent,
    CardListComponent,
    NgIf,
    NzProgressModule,
    LeagueAccountsComponent,
    ButtonComponent,
    RouterLink,
    PlaceHolderComponent,
    TranslateModule
  ],
  providers:[NzModalService ],
    standalone: true
})
export class MyActivityComponent implements OnInit{
  slug: string;
  @Select(GamerState.getUpcomingMatches) upcomingMatches$: Observable<[]>;
  @Select(GamerState.getPreferences) preferences$: Observable<[]>;
  @Select(GamerState.getMatchStatistics) matchStats$: Observable<any>;

  constructor(private store:Store , private activatedRoute: ActivatedRoute , public gamerService:GamerService) {}
  ngOnInit() {
    this.store.dispatch(new GetUpcomingMatches(this.gamerService.slug))
    this.store.dispatch(new GetGamerPreferences(this.gamerService.slug))
    this.store.dispatch(new GetGamerStatistics(this.gamerService.slug))

  }

}
