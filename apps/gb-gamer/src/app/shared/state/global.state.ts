import {State, Action, StateContext, Selector, Store} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {
  GetCountries,
  SetNotifications,
  HandleError,
  SetMissingFields,
  GetLeaderboard,
  GetGameLeaderboardPoints, GetCoins, GetFriends, SetSearchKey, GetMonthlyJoinCount
} from "./global.action";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {GlobalService} from "../service/global.service";
import {SearchService} from "../../modules/search/service/search.service";
import {GetSearch, SetSearch} from "../../modules/search/state/search.action";
import {Router} from "@angular/router";

export class GlobalStateModel {
  countries: any;
  missingFields: [];
  coins: number;
  friends: [];
  searchKey: string | undefined
  monthlyJoinsCounts: any;
}

@State<GlobalStateModel>({
  name: 'global_state',
  defaults: {
    countries: [],
    missingFields: [],
    coins: 0,
    friends: [],
    searchKey: '',
    monthlyJoinsCounts: null
  }
})

@Injectable()
export class GlobalState {

  constructor(private nzNotificationService: NzNotificationService,
              private router: Router,
              private globalService: GlobalService, private searchService: SearchService, private store: Store) {
  }

  @Selector()
  static getCountriesList(state: GlobalStateModel) {
    return state.countries;
  }

  @Selector()
  static getMissingFields(state: GlobalStateModel) {
    return state.missingFields;
  }

  @Selector()
  static getCoins(state: GlobalStateModel) {
    return state.coins;
  }

  @Selector()
  static getFriends(state: GlobalStateModel) {
    return state.friends;
  }


  @Selector()
  static getSearchKey(state: GlobalStateModel) {
    return state.searchKey;
  }

  @Selector()
  static getMonthlyJoinsCounts(state: GlobalStateModel) {
    return state.monthlyJoinsCounts;
  }

  // @Selector()
  // static getLeaderboard(state: GlobalStateModel) {
  //   return state.leaderboard;
  // }
  // @Selector()
  // static getLeaderboardPoints(state: GlobalStateModel) {
  //   return state.leaderboardPoints;
  // }

  @Action(GetCountries)
  getCountries({getState, setState}: StateContext<GlobalStateModel>) {
    // @ts-ignore
    const countries = require('../../core/countries/countries.json');
    const state = getState();
    setState({
      ...state,
      countries: countries,
    });

  }

  @Action(SetNotifications)
  notificationsSuccess({getState, setState}: StateContext<GlobalStateModel>, payload: any) {
    // @ts-ignore
    this.nzNotificationService[payload.type](payload.title, payload.message, {
      nzDuration: payload.disappear ? payload.disappear : 3000,
      nzClass: payload?.type === 'success' ? 'successNotify' : 'warningNotify'
    });
  }

  @Action(HandleError)
  HandleError(ctx: StateContext<GlobalStateModel>, action: HandleError) {
    if (action.payload.status === 500) {
      this.nzNotificationService.error('Error', 'Something went wrong, please try again later', {nzClass: 'errorNotify'})
      return;
    }
    // if (action.payload.status === 404) {
    //   this.router.navigateByUrl('/404')
    // }
    if (!action.payload.error?.message) {
      for (const key of Object.keys(action?.payload.error)) {
        for (const singleErr of action?.payload.error[key]) {
          this.nzNotificationService.error('Error', singleErr, {nzClass: 'errorNotify'})
        }
      }
    } else {
      this.nzNotificationService.error('Error', action.payload.error.message, {nzClass: 'errorNotify'})
    }
  }

  @Action(SetMissingFields)
  SetMissingFields(ctx: StateContext<GlobalStateModel>, action: SetMissingFields) {
    const state = ctx.getState();
    const missingFields = []
    if (action.isValid) {
      missingFields.push({title: action.title, valid: action.isValid})
    }
    ctx.setState({
      ...state,
      missingFields: [...state.missingFields],
    });
  }

  @Action(GetCoins)
  getCoins({getState, setState}: StateContext<GlobalStateModel>, payload: any) {
    return this.globalService.getCoins().pipe(tap((result: any) => {
      return setState({
        ...getState(),
        coins: result.coins,
      });
    }));
  }

  @Action(GetFriends)
  getFriends({getState, setState}: StateContext<GlobalStateModel>, payload: any) {
    const state = getState()
    if (state.friends?.length > 0) {
      return
    }
    return this.globalService.getFriends().pipe(tap((result: any) => {
      return setState({
        ...getState(),
        friends: result.data,
      });
    }));
  }

  @Action(GetMonthlyJoinCount)
  getMonthlyJoinsCounts({getState, setState}: StateContext<GlobalStateModel>, payload: any) {
    const state = getState()
    // if (state.monthlyJoinsCounts) {
    //   return
    // }
    return this.globalService.getMonthlyJoinCount(payload.slug).pipe(tap((result: any) => {
      state.monthlyJoinsCounts = result
      state.monthlyJoinsCounts.percentage = (100 * result.count) / result.limit
      console.log((100 * result.count) / result.limit)
      return setState({
        ...getState(),
        monthlyJoinsCounts: state.monthlyJoinsCounts,
      });
    }));
  }


  @Action(SetSearchKey)
  search({getState, setState}: StateContext<GlobalStateModel>, payload: SetSearchKey) {
    // this.router.navigateByUrl(`/search?search_query=${encodeURIComponent(payload.word)}&filter=${payload.filter}`)
    // this.router.navigateByUrl(`/search`)
    this.store.dispatch(new GetSearch(payload.word))
    return setState({
      ...getState(),
      searchKey: payload.word,
    });
  }

  // @Action(GetLeaderboard)
  // getLeaderboard({getState, setState}: StateContext<GlobalStateModel> , payload: any){
  //   return this.globalService.getLeaderboards('games' , payload.code).pipe(tap((result:any) => {
  //     return setState({
  //       ...getState(),
  //       leaderboard: result,
  //     });
  //   }));
  // }
  // @Action(GetGameLeaderboardPoints)
  // getGameLeaderboardPoints({getState, setState}: StateContext<GlobalStateModel> , payload: any){
  //   return this.globalService.getLeaderBoardPoints( payload.id , payload.page).pipe(tap((result:any) => {
  //     return setState({
  //       ...getState(),
  //       leaderboardPoints: result,
  //     });
  //   }));
  // }


}

