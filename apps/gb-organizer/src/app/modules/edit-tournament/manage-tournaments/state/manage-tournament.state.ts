import {Action, Selector, State, StateContext, Store} from '@ngxs/store'
import {Injectable} from '@angular/core'
import {Router, ActivatedRoute} from '@angular/router'
import {ManageTournamentService} from '../services/manage-tournament.service'
import {tap} from 'rxjs/operators'
import {
  EmptyTournamentParticipants,
  GetTournamentAllParticipants,
  ManagedTournamentLogs, ShuffleSingleBracket,
} from './manage-tournament.action'
import {HandleError} from '../../../../shared/state/global.action'

export class ManageTournamentStateModel {
  logs: any;
  tournamentAllParticipants: any;
  bracket: any;

}

@State<any>({
  name: 'manage_tournaments',
  defaults: {
    logs: {},
    tournamentAllParticipants: [],
    bracket: {}

  }
})

@Injectable()
export class ManageTournamentState {
  bracket: any

  constructor(private manageTournamentService: ManageTournamentService, private router: Router, private store: Store, private route: ActivatedRoute) {
  }

  @Selector()
  static getTournamentLogs(state: ManageTournamentStateModel) {
    return state.logs
  }

  @Selector()
  static getTournamentAllParticipants(state: ManageTournamentStateModel) {
    return state.tournamentAllParticipants;
  }

  @Selector()
  static getTournamentBracket(state: ManageTournamentStateModel) {
    return state.bracket;
  }


  @Action(ManagedTournamentLogs)
  getTournamentLogs({getState, setState}: StateContext<ManageTournamentStateModel>, payload: ManagedTournamentLogs) {
    console.log(payload, getState())
    if (getState().logs.length > 0) {
      return true
    } else {
      return this.manageTournamentService.getTournamentLogs(payload.payload, payload.page).pipe(tap(result => {
        const state = getState()
        this.router.navigate(
          [],
          {
            relativeTo: this.route,
            queryParams: {page: payload.page},
            queryParamsHandling: 'merge',
          })
        setState({
          ...state,
          logs: result,
        })

      }))
    }
  }

  @Action(GetTournamentAllParticipants)
  getTournamentAllParticipants({getState, setState}: StateContext<ManageTournamentStateModel>, payload: GetTournamentAllParticipants) {
    // console.log(getState().tournamentAllParticipants)
    if (getState().tournamentAllParticipants.length > 0) {
      return true
    } else {
      return this.manageTournamentService.getAllowedParticipants(payload.payload).subscribe(result => {
        const state = getState();
        setState({
          ...state,
          tournamentAllParticipants: result,
        });
      }, error => {
        const state = getState();
        setState({
          ...state,
          tournamentAllParticipants: [],
        });
      });
    }
  }

  @Action(EmptyTournamentParticipants)
  tournamentParticipantsEmpty({getState, setState}: StateContext<ManageTournamentStateModel>, payload: GetTournamentAllParticipants) {
    const state = getState();
    setState({
      ...state,
      tournamentAllParticipants: [],
    });

  }

  @Action(ShuffleSingleBracket)
  shuffleSingleBracket({getState, setState}: StateContext<ManageTournamentStateModel>, {bracket, type, numberOFParticipantPerGroup, numberOFQualifiedParticipants}: ShuffleSingleBracket) {
    if (bracket) {
      const byeParticipant = {
        original: {
          avatar: 'https://d229ik2y8x56hm.cloudfront.net/users/avatars/defaults/default.png',
          participant_name: '--',
          participant_id: null
        },
        participant_id: null,
        dummy: true,
      };
      if (type === 'SingleElimination' || type === 'DoubleElimination') {
        let numberOfRounds = 0;
        this.bracket = [];
        numberOfRounds = Math.ceil(Math.log2(bracket.length));
        const numberOfMatches = Math.pow(2, numberOfRounds - 1);
        const remainingPlayers = Math.pow(2, numberOfRounds) - bracket.length;
        // shuffle participants
        for (let i = bracket.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = bracket[i];
          bracket[i] = bracket[j];
          bracket[j] = temp;
        }
        // adding home players
        for (let matchCount = 0; matchCount < numberOfMatches; matchCount++) {
          this.bracket.push({
            home: bracket[matchCount],
            away: ''
          });
        }
        // adding bye players
        for (let i = 0; i < remainingPlayers; i++) {
          this.bracket[i].away = byeParticipant;

        }
        // adding away players
        let tempIndex = numberOfMatches - 1;
        for (let matchCount = bracket.length; matchCount > numberOfMatches; matchCount--) {
          this.bracket[tempIndex].away = bracket[matchCount - 1];
          tempIndex -= 1;
        }
        // shuffle away players
        for (let i = this.bracket.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = this.bracket[i].away;
          this.bracket[i].away = this.bracket[j].away;
          this.bracket[j].away = temp;
        }
        const state = getState();
        setState({
          ...state,
          bracket: this.bracket,
        });
      } else {
        let tempGroup: Array<any> = [];
        this.bracket = [];
        let index = 0;
        // shuffle participants
        for (let i = bracket.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = bracket[i];
          bracket[i] = bracket[j];
          bracket[j] = temp;
        }
        // remainder
        const remainder = bracket.length % numberOFParticipantPerGroup;
        // no of groups
        let NumberOfGroups = Math.ceil(
          bracket.length / numberOFParticipantPerGroup
        );
        NumberOfGroups = NumberOfGroups == 0 ? 1 : NumberOfGroups;
        const userPerGroup = Math.floor(bracket.length / NumberOfGroups);
        // add participants in groups
        for (let group = 0; group < NumberOfGroups; group++) {
          for (let participant = 0; participant < userPerGroup; participant++) {
            if (bracket[index]) {
              tempGroup.push(bracket[index]);
              index++;
            }
          }
          this.bracket.push(tempGroup);
          tempGroup = [];
        }
        if (remainder >= 0) {
          for (
            let remainingParticipants = 0;
            remainingParticipants < remainder;
            remainingParticipants++
          ) {
            for (let group = 0; group < NumberOfGroups; group++) {
              if (bracket[index]) {
                this.bracket[group].push(bracket[index]);
                index++;
              }
            }
          }
        }
        const state = getState();
        setState({
          ...state,
          bracket: this.bracket,
        });
      }

    }
  }
}
