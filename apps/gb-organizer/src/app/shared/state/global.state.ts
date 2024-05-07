import {State, Action, StateContext, Selector} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {GetCountries, SetNotifications, HandleError, SetMissingFields, GetCoins, GetMonthlyJoinCount} from "./global.action";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {AddTournament} from "../../modules/tournaments/state/tournament.action";
import {GlobalService} from "../services/global.service";
export class GlobalStateModel {
  countries: [];
  missingFields: [];
  coins: number;
  monthlyJoinsCounts: any;

}

@State<GlobalStateModel>({
  name: 'global_state',
  defaults: {
    countries: [],
    missingFields: [],
    coins: 0,
    monthlyJoinsCounts: null

  }
})

@Injectable()
export class GlobalState {

  constructor(private nzNotificationService: NzNotificationService , private globalService: GlobalService) {
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
  static getMonthlyJoinsCounts(state: GlobalStateModel) {
    return state.monthlyJoinsCounts;
  }
  @Action(GetCountries)
  getCountries({getState, setState}: StateContext<GlobalStateModel>) {
    // console.log(getState())
    const loadCountries = require('../../core/countries/countries.json');
    // console.log(loadCountries)
    const state = getState();
    setState({
      ...state,
      countries: loadCountries,
    });

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

  @Action(SetNotifications)
  notificationsSuccess({getState, setState}: StateContext<GlobalStateModel>, {
    title,
    message,
    type,
    disappear
  }: SetNotifications) {
    this.nzNotificationService[type](title, message, {
      nzDuration: disappear ? disappear : 3000,
      nzClass: type === 'success' ? 'successNotify' : ''
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
  @Action(HandleError)
  HandleError({}, payload) {
    if (payload.payload.status === 500){
      this.nzNotificationService.error('Error', 'Something went wrong, please try again later', {nzClass: 'errorNotify'})
      return ;
    }
    if (!payload.payload.error?.message) {
      for (const key of Object.keys(payload?.payload.error)) {
        for (const singleErr of payload?.payload.error[key]) {
          this.nzNotificationService.error('Error', singleErr, {nzClass: 'errorNotify'})
        }
      }
    } else {
      this.nzNotificationService.error('Error', payload.payload.error.message, {nzClass: 'errorNotify'})

    }
  }

  @Action(SetMissingFields)
  SetMissingFields({getState, setState}, payload) {
    const state = getState();
    const missingFields = []
    if (payload.isValid){
      missingFields.push({title: payload.title, valid: payload.isValid})
    }
    setState({
      ...state,
      missingFields: [...missingFields],
    });
  }

}

