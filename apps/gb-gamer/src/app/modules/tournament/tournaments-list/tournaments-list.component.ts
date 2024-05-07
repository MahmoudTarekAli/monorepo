import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SectionComponent} from "../../../components/section/section.component";
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";
import {TournamentCardComponent} from "../../../shared/components/tournament-card/tournament-card.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {Select, Store} from "@ngxs/store";
import {HomeState} from "../../home/state/home.state";
import {Observable} from "rxjs";
import {Tournament, TournamentList} from "../../../shared/models/tournament";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {RouterLink} from "@angular/router";
import {NzSelectModule} from "ng-zorro-antd/select";
import {Game} from "../../../shared/models/game";
import {GamesState} from "../../games/state/games.state";
import {GetGamesList} from "../../games/state/games.action";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {FormsModule} from "@angular/forms";
import {TournamentState} from "../state/tournament.state";
import {GetTournamentsList} from "../state/tournament.action";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-tournaments-list',
  standalone: true,
  imports: [CommonModule, SectionComponent, LoadingIndicatorComponent, TournamentCardComponent, ButtonComponent, RouterLink, NzSelectModule, NzDatePickerModule, FormsModule, NzPaginationModule, TranslateModule],
  templateUrl: './tournaments-list.component.html',
  styleUrls: ['./tournaments-list.component.scss']
})
export class TournamentsListComponent implements OnInit {
  @Select(TournamentState.getAllTournaments) tournaments$: Observable<TournamentList>;
  @Select(hasActionsExecuting([GetTournamentsList])) getTournamentsIsExecuting$: Observable<Boolean>;
  @Select(HomeState.getFeaturedGames) trendingGames$: Observable<Game[]>;
  @Select(GamesState.getAllGames) Games$: Observable<any>;
  @Select(hasActionsExecuting([GetGamesList])) getGamesIsExecuting$: Observable<Boolean>;
  participantsType: string
  gameId: number
  tournamentDate: Date[] = []
  status: string = 'Open'
  constructor(private store: Store) {
  }

  ngOnInit() {
    this.getTournaments()
    this.store.dispatch(new GetGamesList(1))
    this.Games$.subscribe((data) => {
      console.log('data', data)
    })
  }

  trackBy(index: number, item: Tournament) {
    return item.id;
  }
  getTournaments() {
    console.log(this.tournamentDate)
    let fromDate:Date;
    let toDate:Date;
    if (this.tournamentDate.length > 0) {
     fromDate =  this.tournamentDate[0]
     toDate =  this.tournamentDate[1]

    }
    this.store.dispatch(new GetTournamentsList(1 , this.status ,  this.participantsType , this.gameId))
  }
  clearTournamentsFilters() {
    this.participantsType = ''
    this.gameId = 0
    this.status = ''
    this.getTournaments()
  }
  changeTournamentPage(page: number) {
    this.store.dispatch(new GetTournamentsList(page , this.status ,  this.participantsType , this.gameId))
  }
}
