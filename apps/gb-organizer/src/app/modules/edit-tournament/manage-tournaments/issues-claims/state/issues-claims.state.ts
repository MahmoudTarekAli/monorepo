import {Action, Selector, State, StateContext, Store} from '@ngxs/store'
import {Injectable} from '@angular/core'
import {Router, ActivatedRoute} from '@angular/router'
import {tap} from 'rxjs/operators'
import {
  GetTournamentAllMatches, UpdateMatchScoreClaims,
} from "./issues-claims.action";
import {BRACKET_TYPES, STAGES} from '../../../../../core/tournament.enum'
import {HandleError, SetNotifications} from "../../../../../shared/state/global.action";
import {MatchListService} from "../../match-list/services/match-list.service";
import {UpdateMatchScore} from "../../match-list/state/match-list.action";
import {MatchesListStateModel} from "../../match-list/state/match-list.state";

export class IssuesClaimsStateModel {
  matches: any
}

@State<any>({
  name: 'issues_claims',
  defaults: {
    matches: [],
  }
})

@Injectable()
export class IssuesClaimsState {
  bracket: any


  @Selector()
  static getTournamentAllMatches(state: IssuesClaimsStateModel) {
    return state.matches;
  }

  constructor(private matchListService: MatchListService, private router: Router,
              private store: Store, private route: ActivatedRoute) {
  }


  @Action(GetTournamentAllMatches)
  getTournamentAllMatches({getState, setState}: StateContext<IssuesClaimsStateModel>, {id}: GetTournamentAllMatches) {
    const state = getState();
    // console.log(state.matches.length > 0)
    if (state.matches.length > 0) {
      console.log('return')
      return true
    } else {
      console.log('getTournamentAllMatches')
      return this.matchListService.getTournamentMatches(id).pipe(tap(result => {
        setState({
          ...state,
          matches: result
        });
      }, error => {
        this.store.dispatch(new HandleError(error))
      }))

    }
  }
  @Action(UpdateMatchScoreClaims)
  updateMatchScore({getState, setState}: StateContext<MatchesListStateModel>, {
    match,
    payload,
  }: UpdateMatchScore) {
    return this.matchListService.setScore(match.code, payload).pipe(tap(result => {
      const state = getState();
      const matches = state['matches'].map(m => {
        if (m.id === match.id) {
          m.home.score = payload.score_home
          m.away.score = payload.score_away
          m.status = 'Finished'
          console.log(m)
        }
        return m
      })
      console.log(matches)
      this.store.dispatch(new SetNotifications('Success', 'Scores Set Successfully', 'success'))
      setState({
        ...state,
        matches
      });
    }, error => {
      this.store.dispatch(new HandleError(error))
    }))
  }
}
