import {Component, OnInit} from '@angular/core';
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {GamesState} from "../state/games.state";
import {Observable} from "rxjs";
import {Game} from "../../../shared/models/game";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {FollowGame, GetChallengesGame, GetGame, GetGamesList, GetTournamentsGame} from "../state/games.action";
import {GamesService} from "../service/games.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Tournament, TournamentList} from "../../../shared/models/tournament";
import {AuthService} from "../../authentication/services/auth.service";
import {HomeState} from "../../home/state/home.state";
import {Challenge, ChallengeList} from "../../../shared/models/challenge";
import {GetChallenges} from "../../home/state/home.action";

@Component({
  selector: 'app-game-profile',
  templateUrl: './game-profile.component.html',
  styleUrls: ['./game-profile.component.scss']
})
export class GameProfileComponent implements OnInit {
  @Select(GamesState.getGame) Game$: Observable<Game>;
  @Select(hasActionsExecuting([GetGamesList])) getGamesIsExecuting$: Observable<Boolean>;
  @Select(GamesState.getTournamentsGame) Tournaments$: Observable<TournamentList>;
  @Select(hasActionsExecuting([GetTournamentsGame])) getTournamentGameExecuting$: Observable<Boolean>;
  gameCode: string;
  currentPage = 1;
  currentChallengePage = 1;
  ChallengeStatus
  status: string;
  totalChallengesPages = 1
  isPaginated = false
  isLoadChallenges = true
  @Select(GamesState.getChallengesGame) challenges$: Observable<ChallengeList>;



  constructor(private gameService: GamesService, private router: Router, private authService: AuthService, private activatedRoute: ActivatedRoute,
              private store: Store , private actions$:Actions) {
  }

  ngOnInit() {
    this.gameCode = this.activatedRoute.snapshot.params['code'];
    this.store.dispatch(new GetGame(this.gameCode))
    this.changeTournamentPage(this.currentPage, this.status)
    this.store.dispatch(new GetChallengesGame(1 , 12 , null ,  this.gameCode))
    this.actions$.pipe(ofActionSuccessful(GetChallengesGame)).subscribe((data) => {
      this.isLoadChallenges = false
    })
    this.challenges$.subscribe((data) => {
      if(data?.meta){
        this.totalChallengesPages = data.meta.total
      }
    })
  }

  changeTournamentPage(page?: number , status?: string) {
    this.currentPage = page ?? this.currentPage
    this.status = status ?? this.status
    this.store.dispatch(new GetTournamentsGame(this.activatedRoute.snapshot.params['code'], status, this.currentPage ))
  }

  changeChallengePage(page?: number , status?: string) {
    if(!this.isLoadChallenges && page < this.totalChallengesPages){
      this.currentChallengePage = page ?? this.currentChallengePage
      this.ChallengeStatus = status
      this.store.dispatch(new GetChallenges(this.currentChallengePage , 12 , this.ChallengeStatus ,this.gameCode))
    }
  }

  followGame(gameId: string, isFollow: boolean) {
    this.authService.checkAuthority()
    this.store.dispatch(new FollowGame(gameId, isFollow))
  }
}
