import {State, Action, StateContext, Selector, createSelector, Store} from '@ngxs/store'
import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router'
import {Tournament, TournamentList} from "../../../shared/models/tournament";
import {Challenge} from "../../../shared/models/challenge";
import {Game} from "../../../shared/models/game";
import {TournamentService} from "../service/tournament.service";
import {
  GetTeamAuthority,
  GetTournament,
  GetTournamentsList,
  GetTournamentTeam, IsArenaFollowed, UpdateIsArenaFollowed,
} from "./tournament.action";
import {tap} from "rxjs/operators";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {JoinTournamentComponent} from "../../../shared/components/join-tournament/join-tournament.component";
import {Team} from "../../../shared/models/team";

export class TournamentStateModel {
  tournaments: TournamentList;
  tournament: Tournament | null;
  missingRequiredInputs: null;
  isTeamAuthority: boolean;
  isArenaFollowed: boolean

}

@State<TournamentStateModel>({
  name: 'tournament',
  defaults: {
    tournaments: null,
    tournament: null,
    missingRequiredInputs: null,
    isTeamAuthority: false,
    isArenaFollowed: false
  }
})

@Injectable()
export class TournamentState {
  partipationType: string = ''
  gameId: number | null = null
  status = ''

  constructor(private tournamentService: TournamentService,
              private router: Router, private store: Store,
              private activatedRoute: ActivatedRoute, private modalService: NzModalService) {

  }

  @Selector()
  static getAllTournaments(state: TournamentStateModel) {
    return state.tournaments;
  }

  @Selector()
  static isArenaFollowed(state: TournamentStateModel) {
    return state.isArenaFollowed;
  }

  @Selector()
  static getTournament(state: TournamentStateModel) {
    return state.tournament;
  }

  @Selector()
  static geTeamAuthority(state: TournamentStateModel) {
    return state.isTeamAuthority;
  }

  @Action(GetTournamentsList)
  getTournamentsList({getState, setState, patchState}: StateContext<TournamentStateModel>, payload: any) {
    const state = getState();
    console.log(payload.participantsType, this.partipationType, payload.status, this.status)
    if (state?.tournaments?.data?.length > 0 && payload?.page == state?.tournaments?.meta?.current_page && payload.participantsType == this.partipationType && payload.gameId == this.gameId
      && payload.status == this.status) {
      return
    }this.partipationType = payload.participantsType
    this.gameId = payload.gameId
    this.status = payload.status

    return this.tournamentService.getTournaments(payload.page, payload.status, payload.participantsType, payload.gameId).pipe(tap((result: any) => {
      setState({
        ...getState(),
        tournaments: result,
      });
    }));
  }

  @Action(GetTournament)
  getTournament({getState, setState, patchState}: StateContext<TournamentStateModel>, payload: any) {
    return this.tournamentService.getTournament(payload.id).pipe(tap((result) => {
      setState({
        ...getState(),
        tournament: result,
      });
    }));
  }

  @Action(GetTeamAuthority)
  getTeamAuthority({getState, setState, patchState}: StateContext<TournamentStateModel>, payload: any) {
    return this.tournamentService.getTeamAuthority(payload.tournamentId, payload.teamId).pipe(tap((result: any) => {
      setState({
        ...getState(),
        isTeamAuthority: result.is_authorized,
      });
    }));
  }

  @Action(IsArenaFollowed)
  IsArenaFollowed({getState, setState, patchState}: StateContext<TournamentStateModel>, payload: IsArenaFollowed) {
    return this.tournamentService.isArenaFollowed(payload.arenaId).pipe(tap((result: any) => {
      setState({
        ...getState(),
        isArenaFollowed: result.followed,
      });
    }));
  }


  @Action(UpdateIsArenaFollowed)
  UpdateIsArenaFollowed({getState, setState, patchState}: StateContext<TournamentStateModel>, payload: UpdateIsArenaFollowed) {
    setState({
      ...getState(),
      isArenaFollowed: payload.isFollowed,
    });
  }

}

