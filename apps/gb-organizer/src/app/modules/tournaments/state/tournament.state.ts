import {State, Action, StateContext, Selector, createSelector, Store} from '@ngxs/store'
import {Tournament} from '../models/tournament';
import {
  AddTournament,
  GetArenas,
  GetOrganizedTournaments,
  GetTournaments,
  ChangePage, GetGames, GetFeaturedGames, GetGameSettings,
} from './tournament.action'
import {TournamentService} from '../services/tournament.service';
import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router'
import {HandleError} from '../../../shared/state/global.action'
import {ResetBracket} from "../../edit-tournament/manage-tournaments/match-list/state/match-list.action";
import {MatchesListStateModel} from "../../edit-tournament/manage-tournaments/match-list/state/match-list.state";

export class TournamentStateModel {
  tournaments: any;
  organizedTournaments: [];
  arenas: [];
  games: [];
  featuredGames: [];
  leagueOfLegendsSettings: [];

}

@State<TournamentStateModel>({
  name: 'tournament',
  defaults: {
    tournaments: null,
    organizedTournaments: [],
    arenas: [],
    games: [],
    featuredGames: [],
    leagueOfLegendsSettings: []
  }
})

@Injectable()
export class TournamentState {
  page: number;
  status: string;
  ParticipantsType: string;
  startAt: string;
  gameId: string;
  arenaId: string;
  type: string;
  createdAt: string;
  searchName: string;
  constructor(private tournamentService: TournamentService, private router: Router, private store: Store, private activatedRoute: ActivatedRoute) {

  }

  @Selector()
  static getTournamentList(state: TournamentStateModel) {
    return state.tournaments;
  }

  @Selector()
  static getOrganizedTournamentsList(state: TournamentStateModel) {
    return state.organizedTournaments;
  }

  @Selector()
  static getArenasList(state: TournamentStateModel) {
    return state.arenas;
  }

  @Selector()
  static getGamesList(state: TournamentStateModel) {
    return state.games;
  }

  @Selector()
  static getFeaturedGamesList(state: TournamentStateModel) {
    return state.featuredGames;
  }

  @Selector()
  static getLeagueSettings(state: TournamentStateModel) {
    return state.leagueOfLegendsSettings;
  }

  static getTournament(id) {
    return createSelector([TournamentState], (state: TournamentStateModel) => {
      return state.tournaments.find(element => element['code'] === id)
    })
  }

  @Action(GetTournaments)
  getTournaments({getState, setState, patchState}: StateContext<TournamentStateModel>, payload) {
    console.log(payload)

    // if (payload.page === parseInt(this.activatedRoute.firstChild.snapshot.queryParams.page)) {
    if (getState().tournaments?.data?.length > 0 && Number(payload.page === this.page)
      && payload.status === this.status && payload.ParticipantsType === this.ParticipantsType
      && payload.arenaId === this.arenaId && payload.gameId === this.gameId && payload.startAt === this.startAt
      && payload.createdAt === this.createdAt && payload.name === this.searchName) {
      return true
    } else {
      this.page = payload.page;
      this.status = payload.status;
      this.ParticipantsType = payload.ParticipantsType;
      this.arenaId = payload.arenaId;
      this.gameId = payload.gameId;
      this.startAt = payload.startAt;
      this.createdAt = payload.createdAt;
      this.searchName = payload.name;
      return this.tournamentService.getTournaments(payload.page, payload.name, payload.status, payload.ParticipantsType, payload.arenaId, payload.gameId, payload.startAt, payload.createdAt).pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
          tournaments: result,
        });
      }));
    }

  }


  @Action(ChangePage)
  ChangePage({getState, setState}: StateContext<TournamentStateModel>, payload) {
    return this.tournamentService[payload.funcName](payload.page).pipe(tap((result: any) => {

      const state = getState();
      console.log(result)
      setState({
        ...state,
        [payload.stateName]: result,
      });
      // add query params to url for pagination

    }));

  }

  @Action(AddTournament)
  addTournament({getState, patchState, setState}: StateContext<TournamentStateModel>, {payload}: AddTournament) {
    return this.tournamentService.addTournament(payload).pipe(tap((result) => {
      if (getState().tournaments.length !== 0) {
        const state = getState();
        setState({
          ...state,
          tournaments: result['data'],
        });
      }
      this.router.navigateByUrl(`/tournament/${result['data']['code']}/process/tournament-info`)
    }, error => {
      this.store.dispatch(new HandleError(error))

    }));
  }


  @Action(GetArenas)
  getArenas({getState, setState}: StateContext<TournamentStateModel>) {
    if (getState().arenas.length > 0) {
      return true
    } else {
      return this.tournamentService.getArenas().pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
          arenas: result,
        });
      }));
    }
  }

  @Action(GetGames)
  getGames({getState, setState}: StateContext<TournamentStateModel>) {
    if (getState().games.length > 0) {
      return true
    } else {
      return this.tournamentService.getGames().pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
          games: result,
        });
      }));
    }
  }

  @Action(GetFeaturedGames)
  getFeaturedGames({getState, setState}: StateContext<TournamentStateModel>, payload) {
    console.log(payload.isMostUsed)
    if (getState().featuredGames.length > 0) {
      return true
    } else {
      return this.tournamentService.getGames(payload.isMostUsed).pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
          featuredGames: result,
        });
      }));
    }
  }

  @Action(GetGameSettings)
  getSettingsLeagueOfLegends({getState, setState}: StateContext<TournamentStateModel>, action: GetGameSettings) {

    return this.tournamentService.getLeagueSettings(action.gameCode).pipe(tap((result) => {
      console.log(result)
      const state = getState();
      setState({
        ...state,
        leagueOfLegendsSettings: result,
      });
    }));
  }

}

