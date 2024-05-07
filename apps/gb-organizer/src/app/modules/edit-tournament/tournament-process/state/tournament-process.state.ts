import {State, Action, StateContext, Selector, Store} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {TournamentProcessService} from '../services/tournament-process.service'
import {
  GetEvents,
  GetThirdParties,
  GetTournament, PublishNextStage,
  PublishFirstStage, ResetTournament,
  ResetTree,
  UpdateTournament, TournamentCheckIn, TournamentRegistration, FinishTournament, DeleteTournament, CancelTournament, GetUserAuthority
} from './tournament-process.action'
import {BRACKET_TYPES, TOURNAMENT_UPDATE_TYPE} from "../../../../core/tournament.enum";
import {HandleError, SetNotifications} from '../../../../shared/state/global.action'
import {TournamentStateModel} from "../../../tournaments/state/tournament.state";
import {TournamentSettingsService} from "../tournament-settings/tournament-settings.service";
import {TournamentProgressService} from "../tournament-progress/services/tournament-progress.service";
import {ManageTournamentService} from "../../manage-tournaments/services/manage-tournament.service";
import {stat} from "fs";
import {MatchStatus} from "../../../../core/match-status.enum";
import {match} from "fuzzy";
import {StateReset} from "ngxs-reset-plugin";
import {GlobalState} from "../../../../shared/state/global.state";
import {MatchesListStateModel, MatchListState} from "../../manage-tournaments/match-list/state/match-list.state";
import { GetMatches, ResetState} from "../../manage-tournaments/match-list/state/match-list.action";
import {SharedService} from "../../service/shared.service";

export class TournamentProcessStateModel {
  tournament: any;
  events: [];
  thirdParties: [];
  Authority: '';

}

@State<TournamentProcessStateModel>({
  name: 'tournament_process',
  defaults: {
    tournament: {},
    events: [],
    thirdParties: [],
    Authority: ''
  }
})

@Injectable()
export class TournamentProcessState {
  matchStatus = MatchStatus

  constructor(private tournamentProcessService: TournamentProcessService,
              private manageTournamentService: ManageTournamentService,
              private tournamentProgressService: TournamentProgressService, private sharedService: SharedService,
              private router: Router, private store: Store, private tournamentSettingsService: TournamentSettingsService) {

  }

  @Selector()
  static getTournament(state: TournamentProcessStateModel) {
    return state.tournament;
  }

  @Selector()
  static getEventList(state: TournamentProcessStateModel) {
    return state.events;
  }

  @Selector()
  static getThirdPartiesList(state: TournamentProcessStateModel) {
    return state.thirdParties;
  }
  @Selector()
  static getAuthority(state: TournamentProcessStateModel) {
    return state.Authority;
  }

  @Action(GetTournament)
  getTournament({getState, setState}: StateContext<TournamentProcessStateModel>, {payload}: GetTournament) {
    return this.tournamentProcessService.getTournament(payload).pipe(tap((result) => {
      const state = getState();
      setState({
        ...state,
        tournament: result,
      });
    }));
  }


  @Action(UpdateTournament)
  updateTournament({getState, setState}: StateContext<TournamentProcessStateModel>, {
    payload,
    id,
    updateType
  }: UpdateTournament) {
    if (updateType === TOURNAMENT_UPDATE_TYPE.BRACKET_TOURNAMENT_UPDATE || updateType === TOURNAMENT_UPDATE_TYPE.PARTICIPANT_TOURNAMENT_UPDATE || updateType === TOURNAMENT_UPDATE_TYPE.PUBLISH_TOURNAMENT_UPDATE || updateType === 'add_moderator' || updateType === 'cancel_tournament' || updateType === TOURNAMENT_UPDATE_TYPE.REMOVE_SECOND_STAGE) {
      const state = getState();
      setState({
        ...state,
        tournament: payload,
      });
      console.log(payload)
      if (updateType === TOURNAMENT_UPDATE_TYPE.BRACKET_TOURNAMENT_UPDATE) {
        this.store.dispatch(new SetNotifications('Updated bracket', 'bracket updated successfully', 'success'));
      }
      if (updateType === TOURNAMENT_UPDATE_TYPE.PUBLISH_TOURNAMENT_UPDATE) {
        this.store.dispatch(new SetNotifications('Publish Tournament', 'Tournament Publish successfully', 'success'));
      }
      if (updateType === TOURNAMENT_UPDATE_TYPE.PARTICIPANT_TOURNAMENT_UPDATE) {
        this.store.dispatch(new SetNotifications('Update participants', 'participants updated successfully', 'success'))
      }
      if (updateType === TOURNAMENT_UPDATE_TYPE.REMOVE_SECOND_STAGE) {
        this.store.dispatch(new SetNotifications('Updated bracket', 'Second stage removed successfully', 'success'))
      }
      return true
    } else {
      return this.tournamentProcessService.UpdateTournament(payload, id).pipe(tap((result) => {
        console.log(result)
        const state = getState();
        console.log(result)
        setState({
          ...state,
          tournament: result['data'],
        });
        this.store.dispatch(new SetNotifications('Update Tournament', 'Tournament updated successfully', 'success'))

      }, error => {
        this.store.dispatch(new HandleError(error))
      }));

    }
  }

  @Action(GetEvents)
  getEvents({getState, setState}: StateContext<TournamentProcessStateModel>) {
    if (getState().events.length > 0) {
      return true
    } else {
      return this.tournamentSettingsService.getEvents().pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
          events: result,
        });
      }));
    }
  }

  @Action(GetThirdParties)
  getThirdParties({getState, setState}: StateContext<TournamentProcessStateModel>) {
    if (getState().thirdParties.length > 0) {
      return true
    } else {
      return this.tournamentSettingsService.getThirdParty().pipe(tap((result) => {
        const state = getState();
        setState({
          ...state,
          thirdParties: result,
        });
      }));
    }
  }

  @Action(PublishFirstStage)
  publishFirstStage({getState, setState}: StateContext<TournamentProcessStateModel>, {
    tournamentCode,
    payload
  }: PublishFirstStage) {
    let participants
    const isRoundRobinOrFreeForAll = getState().tournament.tree.data[0].type === BRACKET_TYPES.GROUP_STAGE || BRACKET_TYPES.FREE_FOR_ALL
    if (!isRoundRobinOrFreeForAll) {
      participants = payload.bracket.map(obj => {
        const homeParticipantId = obj.home.participant_id
        const awayParticipantId = obj.away.participant_id
        return {home: {participant_id: homeParticipantId}, away: {participant_id: awayParticipantId}}
      })
    }
    this.manageTournamentService.publishBracket(tournamentCode, isRoundRobinOrFreeForAll ? payload : {bracket: participants}).subscribe(res => {
      const state = getState();
      state.tournament = res['tournament']
      this.store.dispatch(new SetNotifications('Publish Bracket', 'Bracket published successfully', 'success'));
      this.router.navigateByUrl('tournament/' + tournamentCode + '/manage/match-list')
      this.store.dispatch(new GetMatches(tournamentCode, 0, 'publish'))

      return setState({
        ...state,
      });
    }, error => {
      this.store.dispatch(new HandleError(error));
    })

  }


  @Action(ResetTree)
  resetBracket({getState, setState}: StateContext<TournamentProcessStateModel>, {
    tournamentCode,
    stageIndex
  }: ResetTree) {
    console.log(tournamentCode, stageIndex)
    console.log(getState())
    const state = getState();
    state.tournament.tree.data[stageIndex].is_published = 0;
    return setState({
      ...state,
    });
  }
  @Action(CancelTournament)
  cancelTournament({getState, setState}: StateContext<MatchesListStateModel>, payload: CancelTournament) {
    return this.tournamentProgressService.changeTournamentStatus(payload.tournamentCode , payload.status).pipe(tap((result) => {
      const state = getState();
      state.tournament.status = 'Cancelled'
      return setState({
        ...state,
      });
    }));
  }
  @Action(DeleteTournament)
  deleteTournament({getState, setState}: StateContext<MatchesListStateModel>, {tournamentCode}: DeleteTournament) {
    return this.tournamentProgressService.deleteTournament(tournamentCode).pipe(tap((result) => {
      this.router.navigate(['/']);
      const state = getState();
      return setState({
        ...state,
      });
    }));
  }
  @Action(FinishTournament)
  FinishTournament({getState, setState}: StateContext<TournamentProcessStateModel>, {
    tournamentCode,
    participants
  }: FinishTournament) {
    const state = getState();

    this.tournamentProcessService.finishTournament(tournamentCode, participants).subscribe((res) => {
      this.store.dispatch(new SetNotifications('Success', 'Tournament Finished Successfully', 'success'))
      setState({
        ...state,
        tournament: res['data'],
      });
    }, error => {
      this.store.dispatch(new HandleError(error));
    })

  }


  @Action(PublishNextStage)
  publishNextStage({getState, setState}: StateContext<TournamentProcessStateModel>, {
    tournamentCode,
  }: PublishNextStage) {
    const state = getState();
    this.manageTournamentService.publishSecondStageBracket(tournamentCode).subscribe(res => {
      this.store.dispatch(new SetNotifications('Publish Second Stage', 'Next Stage Started successfully', 'success'));
      state.tournament.tree.data[1].is_published = 1;
      console.log(state.tournament.tree.data[1].is_published)
      this.store.dispatch(new GetMatches(tournamentCode, 1, 'publish'))

      return setState({
        ...state,
      });
    }, error => {
      this.store.dispatch(new HandleError(error));
    })


  }

  @Action(ResetTournament)
  ResetTournament({getState, setState}: StateContext<TournamentProcessStateModel>, {
    tournamentCode,
  }: ResetTournament) {
    const state = getState();
    this.tournamentProgressService.resetTournament(tournamentCode).subscribe(res => {
      this.store.dispatch(new SetNotifications('Reset Tournament', 'Tournament Rested Successfully', 'success'))
      state.tournament = res.data
      this.store.dispatch(
        new StateReset(MatchListState)
      );
      this.store.dispatch(new ResetState())
      return setState({
        ...state,
      });
    }, error => {
      this.store.dispatch(new HandleError(error));
    })


  }

  @Action(TournamentCheckIn)
  CheckInTournament({getState, setState}: StateContext<TournamentProcessStateModel>, {
    tournamentCode, checkInToggle
  }: TournamentCheckIn) {
    const state = getState();
    this.tournamentProgressService.checkInTournament(tournamentCode, checkInToggle).subscribe(res => {
      this.store.dispatch(new SetNotifications('CheckIn Tournament', 'Tournament CheckIn updated Successfully', 'success'))
      state.tournament.check_in_open = checkInToggle.check_in_open;
      console.log(state.tournament.check_in_open)
      return setState({
        ...state,
      });
    }, error => {
      this.store.dispatch(new HandleError(error));
    })


  }

  @Action(TournamentRegistration)
  TournamentRegistration({getState, setState}: StateContext<TournamentProcessStateModel>, {
    tournamentCode, registrationToggle
  }: TournamentRegistration) {
    const state = getState();
    this.tournamentProgressService.registerTournament(tournamentCode, registrationToggle).subscribe(res => {
      this.store.dispatch(new SetNotifications('Tournament Registration', 'Tournament Registration updated Successfully', 'success'))
      state.tournament.registration_status = registrationToggle;
      return setState({
        ...state,
      });
    }, error => {
      this.store.dispatch(new HandleError(error));
    })
  }
  @Action(GetUserAuthority)
  getUserAuthority({getState, setState}: StateContext<GetUserAuthority>, {tournamentCode}: GetUserAuthority) {
    const state = getState();
    this.sharedService.checkAuthority(tournamentCode).subscribe(res => {
      state['Authority'] = res['Authority'];
      console.log(state)
      return setState({
        ...state,
      });
    })
  }
}

