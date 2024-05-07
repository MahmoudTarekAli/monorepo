import {Component, OnInit} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {GamesState} from "../state/games.state";
import {Observable} from "rxjs";
import {Game} from "../../../shared/models/game";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {FilterGames, GetGamesList, GetGenres, GetTrendingGames, SearchGames} from "../state/games.action";
import {GamesService} from "../service/games.service";
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";
import {AsyncPipe, NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {GameCardComponent} from "../../../shared/components/game-card/game-card.component";
import {
    RadioButtonsFiltersComponent
} from "../../../shared/components/radio-buttons-filters/radio-buttons-filters.component";
import {SectionComponent} from "../../../components/section/section.component";
import {NzSelectModule} from "ng-zorro-antd/select";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzIconModule} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    NgIf,
    GameCardComponent,
    AsyncPipe,
    NgForOf,
    RadioButtonsFiltersComponent,
    SectionComponent,
    NzSelectModule,
    FormsModule,
    TranslateModule,
    NzInputModule,
    NzIconModule,
    UpperCasePipe,

  ]
})
export class GamesListComponent implements OnInit{
  @Select(GamesState.getAllGames) Games$: Observable<any>;
  // @Select(GamerSettingsState.getFiltrationGames) FiltrationGames$: Observable<Game[]>;
  @Select(GamesState.getGamesGenres) Genres$: Observable<[]>;
  @Select(hasActionsExecuting([GetGamesList])) getGamesIsExecuting$: Observable<Boolean>;
  filterItems = []
  gameSearch = '';
  constructor(private gameService: GamesService, private store: Store) {
  }
  ngOnInit() {
    this.store.dispatch(new GetGamesList(1))
    this.store.dispatch(new GetGenres())
    this.store.dispatch(new GetTrendingGames())

  }
  filterGames(value:any ){
    this.store.dispatch(new FilterGames(value))
  }
  searchGames(value:any){
    this.store.dispatch(new SearchGames(value))

  }
}
