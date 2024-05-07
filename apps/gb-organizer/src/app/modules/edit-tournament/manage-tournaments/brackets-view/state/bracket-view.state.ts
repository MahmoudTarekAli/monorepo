import {Action, Selector, State, StateContext, Store} from '@ngxs/store'
import {Injectable} from '@angular/core'
import {Router, ActivatedRoute} from '@angular/router'
import {tap} from 'rxjs/operators'
import {GetLoserTree, GetTree, GetWinnerTree} from "./brackets-view.action";
import {HandleError} from "../../../../../shared/state/global.action";
import {state} from "@angular/animations";

export class BracketViewStateModel {
  matches: any;
  winnerMatches: any;
  loserMatches: any
}

@State<any>({
  name: 'bracket_view',
  defaults: {
    matches: [],
    winnerMatches: [],
    loserMatches: [],
  }
})

@Injectable()
export class BracketViewState {
  bracket: any

  @Selector()
  static getWinnerMatches(state: BracketViewStateModel) {
    return state.winnerMatches;
  }
  @Selector()
  static getMatches(state: BracketViewStateModel) {
    return state.matches;
  }
  @Selector()
  static getLoserMatches(state: BracketViewStateModel) {
    return state.loserMatches;
  }

  constructor( private router: Router,
               private store: Store, private route: ActivatedRoute) {
  }


  @Action(GetTree)
  getMatches({getState, setState}: StateContext<BracketViewStateModel>, {payload , type}: GetTree) {
    if (getState().matches.length > 0) {
      return true
    } else {
      // tslint:disable-next-line:no-shadowed-variable
      const state = getState();
      return setState({
        ...state,
        matches: this.getTree(payload , type),
      })
    }
  }
  @Action(GetWinnerTree)
  getWinnerMatches({getState, setState}: StateContext<BracketViewStateModel>, {payload , type}: GetWinnerTree) {
    if (getState().winnerMatches.length > 0) {
      return true
    } else {
      console.log(type)
      // tslint:disable-next-line:no-shadowed-variable
      const state = getState();
      return setState({
        ...state,
        winnerMatches: this.getTree(payload , type),
      })
    }
  }
  @Action(GetLoserTree)
  getLoserTree({getState, setState}: StateContext<BracketViewStateModel>, {payload , type}: GetLoserTree) {
    if (getState().loserMatches.length > 0) {
      return true
    } else {
      console.log(type)
      // tslint:disable-next-line:no-shadowed-variable
      const state = getState();
      return setState({
        ...state,
        loserMatches: this.getTree(payload , type),
      })
    }
  }



getTree(payload , type){
  const matchesArray = []
  payload.forEach((stage, index) => {
    const array = []
    for (let matchCount = 0; matchCount < payload[index][type]?.length / 2; matchCount++) {
      array.push({
        firstMatch: payload[index][type][matchCount * 2]
        , secondMatch: payload[index][type][matchCount * 2 + 1]
      })
    }
    matchesArray.push(array)
  })
  return matchesArray
}

}
