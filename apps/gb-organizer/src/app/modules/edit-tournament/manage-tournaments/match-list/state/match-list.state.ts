import {Action, Selector, State, StateContext, Store} from '@ngxs/store'
import {Injectable} from '@angular/core'
import {Router, ActivatedRoute, NavigationEnd, Params, NavigationStart} from '@angular/router'
import {filter, tap} from 'rxjs/operators'
import {MatchListService} from "../services/match-list.service";
import {
  ChangeStage, GetMatch,
  GetMatches,
  GetTournamentParticipants, QualifyWinner,
  ReplaceParticipant, ResetBracket,
  ResetMatches, ResetState, SetMatches,
  SetMatchesDate,
  UpdateMatchScore,
  UpdateMatchStatus, UpdateParticipantScoreFreeForAll,
  UpdateRoundMatchesStatus
} from "./match-list.action";
import {BRACKET_TYPES, STAGES} from '../../../../../core/tournament.enum'
import {HandleError, SetNotifications} from "../../../../../shared/state/global.action";
import {TournamentStateModel} from "../../../../tournaments/state/tournament.state";
import {
  TournamentProgressService
} from "../../../tournament-process/tournament-progress/services/tournament-progress.service";
import {BracketViewStateModel} from "../../brackets-view/state/bracket-view.state";
import {UpdateTournament} from "../../../tournament-process/state/tournament-process.action";

export class MatchesListStateModel {
  stages: any
  firstStageMatches: any;
  participants: any;
  stage: string;
  selectedMatch: string;
  selectedTournament: any;
  error: any;
  matches: any;
  tournament: any;

}

@State<any>({
  name: 'match_list',
  defaults: {
    stages: [],
    firstStageMatches: {},
    participants: [],
    stage: 0,
    selectedMatch: '',
    selectedTournament: {},
    error: null,
    matches: []
  }
})

@Injectable()
export class MatchListState {

  constructor(private matchListService: MatchListService, private router: Router,
              private tournamentProgressService: TournamentProgressService,
              private store: Store, private route: ActivatedRoute) {

    router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((event: NavigationStart) => {
      // this to reset stage after navigating to home page
      if (event.url.includes('my-tournaments') || event.url.includes('page')) {
        this.stages = []
      }
      // this.stages = []
    })
  }

  bracket: any
  stages = []

  @Selector()
  static getTournamentParticipants(state: MatchesListStateModel) {
    return state.participants;
  }

  @Selector()
  static getMatches(state: MatchesListStateModel) {
    return state.matches;
  }

  @Selector()
  static getTournamentStage(state: MatchesListStateModel) {
    return state.stage;
  }

  @Selector()
  static getSelectedMatch(state: MatchesListStateModel) {
    return state.selectedMatch;
  }

  @Selector()
  static getSelectedTournament(state: MatchesListStateModel) {
    return state.selectedTournament;
  }

  @Selector()
  static getErrorMatch(state: MatchesListStateModel) {
    return state.error;
  }

  @Action(SetMatches)
  setBracketMatches({getState, setState}: StateContext<MatchesListStateModel>, {
    rounds,
    bracketType,
    stage
  }: SetMatches) {
    const state = getState();

    if (bracketType === BRACKET_TYPES.DOUBLE_ELIMINATION) {
      let matchList
      if (rounds) {
        rounds.upper = rounds.map((round) => {
          return round.winners_matches
        })
        rounds.lower = rounds.map((round) => {
          return round.losers_matches
        })
        matchList = {
          upper: rounds.upper.flat(1),
          lower: rounds.lower.flat(1)
        }
      }
      return setState({
        ...state,
        matches: matchList
      });

    } else {
      let matchesListArray

      if (rounds) {
        const roundList = this.stages[stage]?.groups.map((round) => {
          return {...round, is_hidden: false};
        })
        const matchList = roundList.map((round) => {
          return round.matches
        })
        matchesListArray = matchList.flat(1)
      }
      return setState({
        ...state,
        matches: matchesListArray
      });

    }


  }

  @Action(GetMatches)
  getFirstStageMatches({getState, setState}: StateContext<MatchesListStateModel>, {id, stage, type}: GetMatches) {
    const state = getState();
    if (state.stages[stage] && !type) {
      return state.stages[stage];
    } else {
      return this.matchListService.getTree(id, stage + 1).pipe(tap(result => {
        this.stages[stage] = result
        // this.stages.push(result)

        if (result.rounds) {
          result.groups = result.rounds
        }
        // set checked property to false for all matches in groups
        return setState({
          ...state,
          stage,
          stages: this.stages
        });
      }))

    }

  }

  @Action(UpdateMatchScore)
  updateMatchScore({getState, setState}: StateContext<MatchesListStateModel>, {
    selectedBracketMatchType,
    match,
    payload,
    stage,
    round,
    index,
    fromSocket
  }: UpdateMatchScore) {
    const state = getState();
    if (fromSocket) {
      const foundMatch = state.stages[stage][round][index][selectedBracketMatchType].findIndex(item => {
        return item.id === match.id
      });
      state.stages[stage][round][index][selectedBracketMatchType][foundMatch].participants.forEach(participant => {
        if (participant.side === "home") {
          participant.score = payload.score_home;
        } else if (participant.side === "away") {
          participant.score = payload.score_away;
        }
      });
      if (state.stages[stage][round][index][selectedBracketMatchType][foundMatch].home) {
        state.stages[stage][round][index][selectedBracketMatchType][foundMatch].home.score = payload.score_home;
      }
      if (state.stages[stage][round][index][selectedBracketMatchType][foundMatch].away) {
        state.stages[stage][round][index][selectedBracketMatchType][foundMatch].away.score = payload.score_away;
      }
      // this.store.dispatch(new SetNotifications('Success', 'Scores Set Successfully', 'success'))
      return setState({
        ...state,
      });
    }

    return this.matchListService.setScore(match.code, payload).pipe(tap(result => {
      if (state.stages.length > 0) {
        const foundMatch = state.stages[stage][round][index][selectedBracketMatchType].findIndex(item => {
          return item.id === match.id
        });
        state.stages[stage][round][index][selectedBracketMatchType][foundMatch].home.score = payload.score_home;
        state.stages[stage][round][index][selectedBracketMatchType][foundMatch].away.score = payload.score_away;
        this.store.dispatch(new SetNotifications('Success', 'Scores Set Successfully', 'success'))
        setState({
          ...state,
        });
      }
    }, error => {
      this.store.dispatch(new HandleError(error))
    }))
  }

  @Action(QualifyWinner)
  qualifyWinner({getState, setState}: StateContext<MatchesListStateModel>, {
    selectedBracketMatchType,
    match,
    stage,
    round,
    index,
  }: QualifyWinner) {
    const state = getState();
    const foundMatch = state.stages[stage][round][index][selectedBracketMatchType].findIndex(item => {
      return item.id === match.id
    });
    console.log(match)
    console.log(state.stages[stage][round][index][selectedBracketMatchType][foundMatch])
    Object.assign(state.stages[stage][round][index][selectedBracketMatchType][foundMatch], match);
    return setState({
      ...state,
    });

  }

  @Action(UpdateParticipantScoreFreeForAll)
  UpdateParticipantScoreFreeForAll({getState, setState}: StateContext<MatchesListStateModel>, {
    stage,
    payload,
    groupIndex,
  }: UpdateParticipantScoreFreeForAll) {
    const state = getState();
    const foundGroup = state.stages[stage].groups.findIndex(item => item.id === groupIndex);
    console.log(state.stages[stage].groups[foundGroup])
    console.log(payload)
    Object.assign(state.stages[stage].groups[foundGroup], payload);

    this.store.dispatch(new SetNotifications('Success', 'Scores updated Successfully', 'success'))
    setState({
      ...state,
    });
  }

  @Action(ChangeStage)
  changeStage({getState, setState}: StateContext<MatchesListStateModel>, {stage}: ChangeStage) {
    const state = getState();
    return setState({
      ...state,
      stage
    });
  }

  @Action(UpdateMatchStatus)
  updateMatchStatus({getState, setState}: StateContext<MatchesListStateModel>, {
    selectedBracketMatchType,
    match,
    payload,
    stage,
    index,
    manualApplyStatus
  }: UpdateMatchStatus) {
    // manualApplyStatus is used to change status to finish after setting score
    if (manualApplyStatus) {
      const state = getState();
      const foundMatch = state.stages[stage].groups[index][selectedBracketMatchType].findIndex(item => item.id === match.id);
      state.stages[stage].groups[index][selectedBracketMatchType][foundMatch].status = payload.status;
      setState({
        ...state,
      });
      return true
    }
    return this.matchListService.updateStatus(match.code, payload).pipe(tap(result => {
      const state = getState();
      const foundMatch = state.stages[stage].groups[index][selectedBracketMatchType].findIndex(item => item.id === match.id);
      state.stages[stage].groups[index][selectedBracketMatchType][foundMatch].status = payload.status;
      this.store.dispatch(new SetNotifications('Success', 'Matches updated successfully', 'success'))

      setState({
        ...state,
      });
    }, error => {
      this.store.dispatch(new HandleError(error))
    }))
  }


  @Action(UpdateRoundMatchesStatus)
  updateRoundMatchesStatus({getState, setState}: StateContext<MatchesListStateModel>, {
    selectedBracketMatchType,
    tournamentId,
    treeId,
    payload,
    stage,
    index
  }: UpdateRoundMatchesStatus) {
    return this.matchListService.updateRoundOrGroupMatchesStatus(tournamentId, treeId, payload).pipe(tap(result => {
      const state = getState();

      state.stages[stage].groups[index][selectedBracketMatchType].forEach(match => {
        payload.codes.forEach(code => {
          if (match.code === code) {
            match.status = payload.status;
          }
        })
      })
      this.store.dispatch(new SetNotifications('Success', 'Matches updated successfully', 'success'))

      setState({
        ...state,
      });
    }, error => {
      this.store.dispatch(new HandleError(error))
    }))

  }


  @Action(GetTournamentParticipants)
  getTournamentParticipants({
                              getState,
                              setState
                            }: StateContext<MatchesListStateModel>, {id}: GetTournamentParticipants) {
    return this.matchListService.getTournamentParticipants(id).subscribe(result => {
      const state = getState();
      return setState({
        ...state,
        participants: result
      });
    })
  }

  @Action(ReplaceParticipant)
  ReplaceParticipant({getState, setState}: StateContext<MatchesListStateModel>, {
    selectedBracketMatchType,
    matchCode,
    payload,
    stage,
    index
  }: ReplaceParticipant) {
    const state = getState();
    return this.matchListService.replacePlayer(matchCode, payload).pipe(tap(result => {
      const foundMatch = state.stages[stage].groups[index][selectedBracketMatchType].findIndex(item => item.code === matchCode);
      state.stages[stage].groups[index][selectedBracketMatchType][foundMatch][payload.side] = payload.participant;
      this.store.dispatch(new SetNotifications('Success', 'participants replaced successfully', 'success'))

      setState({
        ...state,
      });
    }, error => {
      this.store.dispatch(new HandleError(error))
    }))

  }

  @Action(ResetMatches)
  ResetMatches({getState, setState}: StateContext<MatchesListStateModel>, {
    selectedBracketMatchType,
    tournamentCode,
    payload,
    stage,
    index
  }: ResetMatches) {
    const state = getState();
    return this.matchListService.resetMatches(tournamentCode, payload).pipe(tap(result => {
      state.stages[stage].groups[index][selectedBracketMatchType].forEach(match => {
        payload.codes.forEach(code => {
          if (match.code === code) {
            match.home.score = null;
            match.away.score = null;
            match.status = 'TBD';
          }
        })
      })
      this.store.dispatch(new SetNotifications('Success', 'Matches reset successfully', 'success'))

      setState({
        ...state,
      });
    }, error => {
      this.store.dispatch(new HandleError(error))
    }))

  }

  @Action(SetMatchesDate)
  setMatchesDate({getState, setState}: StateContext<MatchesListStateModel>, {
    selectedBracketMatchType,
    tournamentId,
    payload,
    stage,
    index
  }: SetMatchesDate) {

    return this.matchListService.setRoundOrGroupMatchesDate(tournamentId, payload).pipe(tap(result => {
      const state = getState();
      state.stages[stage].groups[index][selectedBracketMatchType].forEach(match => {
        payload.codes.forEach(id => {

          if (match.code === id) {
            match.start_at = payload.date;
          }
        })
      })
      setState({
        ...state,
      });
    }, error => {
      this.store.dispatch(new HandleError(error))
    }))

  }

  @Action(GetMatch)
  getMatch({getState, setState, patchState}: StateContext<MatchesListStateModel>, {
    selectedMatch,
  }: GetMatch) {
    const state = getState();
    return this.matchListService.getMatch(selectedMatch).pipe(tap(result => {
      const match = result.data;
      setState({
        ...state,
        selectedMatch: match,
        selectedTournament: result?.tournament,
      });
    }, error => {
      this.store.dispatch(new HandleError(error))
      setState({...state, error: error.error});
    }))

  }

  @Action(ResetBracket)
  resetBracket({getState, setState}: StateContext<MatchesListStateModel>, {
    tournamentCode,
    stageIndex
  }: ResetBracket) {
    return this.tournamentProgressService.resetSecondStage(tournamentCode).pipe(tap((result) => {
      const state = getState();
      state.stages.splice(stageIndex, 1);
      return setState({
        ...state,
      });
    }));
  }

  @Action(ResetState)
  resetState({getState, setState}: StateContext<MatchesListStateModel>, {tournamentCode, stageIndex}: ResetBracket) {
    const state = getState();
    // state.stages[0].groups = []
    // if (state.stages[1]){
    //   state.stages[1].groups = []
    // }
    return setState({
      ...state,
      stages: [],
      firstStageMatches: {},
      participants: [],
      selectedMatch: ''
    });
  }

}
