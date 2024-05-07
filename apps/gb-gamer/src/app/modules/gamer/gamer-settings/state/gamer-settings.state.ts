import {State, Action, StateContext, Selector, createSelector, Store} from '@ngxs/store'
import {
  DisconnectSocialAccount, DisconnectThirdParty,
  GetBlockedUsers,
  GetLeagueServers,
  GetSocialAccounts,
  GetThirdPartyIntegration,
} from './gamer-settings.action'
import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {GlobalService} from "../../../../shared/service/global.service";
import {GamerService} from "../../service/gamer.service";
import {Router} from "@angular/router";
import {User} from "../../../authentication/models/user";
import {HandleError, SetNotifications} from "../../../../shared/state/global.action";
import {GetLeagueAccounts} from "../../state/gamer.action";
import {AuthService} from "../../../authentication/services/auth.service";

export class GamerSettingsStateModel {
  leagueServers: any;
  blockedUsers: User[];
  socialAccounts:any;
  thirdParties:any
}

@State<GamerSettingsStateModel>({
  name: 'gamerSettings',
  defaults: {
    leagueServers: [],
    blockedUsers: [],
    socialAccounts: [],
    thirdParties: null
  }
})

@Injectable()
export class GamerSettingsState {

  constructor(private gamerService: GamerService, private router: Router, private store: Store, private authService:AuthService) {

  }

  @Selector()
  static getLeagueServers(state: GamerSettingsStateModel) {
    return state.leagueServers;
  }
  @Selector()
  static getBlockedUsers(state: GamerSettingsStateModel) {
    return state.blockedUsers;
  }
 @Selector()
  static getSocialAccounts(state: GamerSettingsStateModel) {
    return state.socialAccounts;
  }
 @Selector()
  static getThirdParties(state: GamerSettingsStateModel) {
    return state.thirdParties;
  }

  @Action(GetLeagueServers)
  getLeagueServers({getState, setState}: StateContext<GamerSettingsStateModel>, payload: any) {
    return this.gamerService.getLeagueServers().pipe(tap((result) => {
      const state = getState()
      const leagueServers =  Object.entries(result).map(([key, value]) => ({ key, value }));

      console.log(result)
      setState({
        ...getState(),
        leagueServers: leagueServers,
      });
    }));
  }
  @Action(GetBlockedUsers)
  getBlockedUsers({getState, setState}: StateContext<GamerSettingsStateModel>, payload: any) {
    return this.gamerService.getBlockedUsers().pipe(tap((result) => {
      const state = getState()
      console.log(result)
      setState({
        ...getState(),
        blockedUsers: result.data,
      });
    }));
  }
  @Action(GetSocialAccounts)
  getSocialAccounts({getState, setState}: StateContext<GamerSettingsStateModel>, payload: any) {
    return this.gamerService.getSocialAccounts().pipe(tap((result) => {
      const state = getState()
      console.log(result)
      setState({
        ...getState(),
        socialAccounts: result,
      });
    }));
  }
  @Action(DisconnectSocialAccount)
  disconnectSocialAccount({getState, setState}: StateContext<GamerSettingsStateModel>, payload: any) {
    return this.gamerService.disconnectSocialAccount(payload.socialId).pipe(tap((result) => {
      const state = getState()
      console.log(state.socialAccounts )
      state.socialAccounts = state.socialAccounts.filter((account) => account.social_id !== payload.socialId)
      this.store.dispatch(new GetLeagueAccounts(this.authService?.userAuth?.slug , null , null , true))
      this.store.dispatch(new SetNotifications('Success', `Account is disconnected successfully` , 'success'))

      setState({
        ...getState(),
        socialAccounts: state.socialAccounts ,
      });
    },error => {
      this.store.dispatch(new HandleError(error))
    }));
  }
  @Action(GetThirdPartyIntegration)
  getThirdPartyIntegration({getState, setState}: StateContext<GamerSettingsStateModel>, payload: any) {
    return this.gamerService.getThirdParties().pipe(tap((result) => {
      setState({
        ...getState(),
        thirdParties: result,
      });
    }));
  }
  @Action(DisconnectThirdParty)
  disconnectThirdParty({getState, setState}: StateContext<GamerSettingsStateModel>, payload: any) {
    return this.gamerService.disconnectThirdParty(payload.phoneNumber).pipe(tap((result) => {
      const state = getState()
      state.thirdParties = state.thirdParties.filter((account) => account.phone_number !== payload.phoneNumber)
      this.store.dispatch(new SetNotifications('Success', `Third party is disconnected successfully` , 'success'))

      setState({
        ...getState(),
        thirdParties: state.thirdParties ,
      });
    },error => {
      this.store.dispatch(new HandleError(error))
    }));
  }



}







