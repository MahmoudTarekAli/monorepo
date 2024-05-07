import {State, Action, StateContext, Selector, createSelector, Store} from '@ngxs/store'
import {
  FilterGames,
  FollowGame, GetChallengesGame,
  GetGame,
  GetGamesList,
  GetGenres,
  GetTournamentsGame, GetTrendingGames, SearchGames
} from './games.action'
import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router'
import {Tournament, TournamentList} from "../../../shared/models/tournament";
import {Game} from "../../../shared/models/game";
import {GamesService} from "../service/games.service";
import {HandleError, SetNotifications} from "../../../shared/state/global.action";
import {GlobalService} from "../../../shared/service/global.service";
import {GetChallenges} from "../../home/state/home.action";
import {HomeStateModel} from "../../home/state/home.state";
import {ChallengeList} from "../../../shared/models/challenge";
import {HomeService} from "../../home/service/home.service";

export class GameStateModel {
  games: {
    games: Game[] | null;
    trendingGames: Game[] | null;
    filtrationGames: Game[] ;
  }
  game:  Game | null;
  tournaments: TournamentList;
  challenges: ChallengeList;
  genres: [];
}

@State<GameStateModel>({
  name: 'games',
  defaults: {
    games: {games: null, trendingGames: null, filtrationGames: []},
    game: null,
    tournaments: null,
    genres: [],
    challenges: null
  }
})

@Injectable()
export class GamesState {

  constructor(private gamesService: GamesService, private router: Router, private store: Store, private homeService:HomeService) {

  }

  @Selector()
  static getAllGames(state: GameStateModel) {
    return state.games;
  }

  @Selector()
  static getGame(state: GameStateModel) {
    return state.game;
  }
  @Selector()
  static getTournamentsGame(state: GameStateModel) {
    return state.tournaments;
  }
  @Selector()
  static getChallengesGame(state: GameStateModel) {
    return state.challenges;
  }
  @Selector()
  static getGamesGenres(state: GameStateModel) {
    return state.genres;
  }



  @Action(GetGamesList)
  getGamesList({getState, setState}: StateContext<GameStateModel>) {
    const state = getState()
    if (state.games.games && state.games?.games?.length > 0){
      return
    }
      return this.gamesService.getAllGames().pipe(tap((result) => {
        state.games.games = result
        state.games.filtrationGames = result
        setState({
          ...getState(),
          games: state.games,
        });
      }));


  }
  @Action(GetTrendingGames)
  getTrendingGames({getState, setState}: StateContext<GameStateModel>) {
      return this.gamesService.getTrendingGames().pipe(tap((result) => {
        const state = getState()
        state.games.trendingGames = result
        setState({
          ...getState(),
          games: state.games,
        });
      }));


  }
  @Action(GetGame)
  getGame({getState, setState}: StateContext<GameStateModel> , payload: any){
    return this.gamesService.getGame(payload.code).pipe(tap((result) => {
      setState({
        ...getState(),
        game: result,
      });
    }));
  }

  @Action(GetTournamentsGame)
  getTournamentsGame({getState, setState}: StateContext<GameStateModel> , payload: any){
    return this.gamesService.getGameTournaments(payload.code , payload.status , payload.page).pipe(tap((result:TournamentList) => {
      setState({
        ...getState(),
        tournaments: result,
      });
    }));
  }

  @Action(GetChallengesGame)
  getChallenges({getState, setState, patchState}: StateContext<GameStateModel>, payload: any) {
    return this.homeService.getChallenges(payload.page , payload.per_page ,payload.status , payload.game).pipe(tap((result:any) => {
      const state = getState();
      if(payload.page > 1) {
        state.challenges.data = state.challenges.data.concat(result.data)
        state.challenges.meta = result.meta
      }else{
        state.challenges = result
      }
      setState({
        ...getState(),
        challenges: state.challenges,
      });
    }));
  }
  @Action(GetGenres)
  getGamesGenres({getState, setState}: StateContext<GameStateModel> , payload: any){
    return this.gamesService.getGamesGenres().pipe(tap((result) => {
      setState({
        ...getState(),
        genres: result,
      });
    }));
  }
  @Action(SearchGames)
  searchGames({getState, setState}: StateContext<GameStateModel> , payload: any){
    const state = getState()
    if(state.games.games) {
      const searchArray = state?.games?.games.filter((item: any) => {
        return item.name?.toLowerCase()?.includes(payload?.code?.toLowerCase())
      })
      state.games.filtrationGames = searchArray
      console.log(state.games)
      setState({
        ...getState(),
        games: state.games,
      });
      return;
    }
  }

  @Action(FilterGames)
  filterGames({getState, setState}: StateContext<GameStateModel> , payload: any){
    const state = getState()
    const matchingGenres: any[] = []
    if(state.games.games){
      if(payload.code === 'All'){
        state.games.filtrationGames =  state.games.games

        setState({
          ...getState(),
          games: state.games,
        });
        return
      }
      state.games.games.forEach((item:any) => {
        item.genres.forEach((genre:any) => {
          if (genre.name === payload.code) {
            matchingGenres.push(item);
          }
        });
      });
      state.games.filtrationGames =  matchingGenres

      setState({
        ...getState(),
        games: state.games,
      });
    }
  }


  @Action(FollowGame)
  followGame({getState, setState}: StateContext<GameStateModel> , payload: any){
    const state = getState()

    if (payload.isFollow){
      this.gamesService.unFollowGame(payload.code).subscribe((res:any) => {
        this.store.dispatch(new SetNotifications('Success', 'game is unfollowed successfully' , 'success'))
        state.games.games?.forEach((item:any) => {
          if (item.code === payload.code) {
            item.is_favorite = !item.is_favorite
          }
        });
        setState({
          ...getState(),
          game: res.data,
          games: state.games
        });
      }, (error) => {
        this.store.dispatch(new HandleError(error))
      })
      return
    }
    this.gamesService.followGame(payload.code).subscribe((res:any) => {
      this.store.dispatch(new SetNotifications('Success', 'game is followed successfully' , 'success'))
      state.games.games?.forEach((item:any) => {
        if (item.code === payload.code) {
          item.is_favorite = !item.is_favorite
        }
      });
      setState({
        ...getState(),
        game: res.data,
        games: state.games

      });
    }, (error) => {
      this.store.dispatch(new HandleError(error))
    })

  }

}







