import {State, Action, StateContext, Selector, createSelector, Store} from '@ngxs/store'
import {
  AcceptFriendRequest,
  AddFriend,
  AddLeagueAccount, CancelFriendRequest,
  DeleteLeagueAccount,
  GetGamerPreferences,
  GetGamerProfile, GetGamerRelationships,
  GetGamerStatistics,
  GetJoinedChallenges,
  GetJoinedTournaments,
  GetLeagueAccounts,
  GetUpcomingMatches,
  GetUserClaims, RemoveFriendRequest, ResetGamerState, UpdatePublisherAccount,
} from './gamer.action'
import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {GlobalService} from "../../../shared/service/global.service";
import {GamerService} from "../service/gamer.service";
import {Router} from "@angular/router";
import {GamerProfile} from "../../../shared/models/gamer";
import {HandleError, SetNotifications} from "../../../shared/state/global.action";

export class GamerStateModel {
  gamer:GamerProfile | null
  upComingMatches: [];
  preferences: [];
  statistics: any;
  joinedTournaments: any;
  joinedChallenges: any;
  claims:any;
  connectedLeagueAccounts:any;
  newLeagueAccount:any;
  relationships:any;

}

@State<GamerStateModel>({
  name: 'gamer',
  defaults: {
    gamer: null ,
    upComingMatches: [],
    preferences: [],
    statistics: {},
    joinedTournaments: {},
    joinedChallenges: {},
    claims: {},
    connectedLeagueAccounts: [],
    newLeagueAccount: {},
    relationships: null,
  }
})

@Injectable()
export class GamerState {
  slug;
  tournamentCode;
  tournamentSearch;
  tournamentStatus;
  gameId;
  challengeId
  constructor(private gamerService: GamerService, private router: Router, private store: Store, private globalService:GlobalService) {

  }

  @Selector()
  static getGamerProfile(state: GamerStateModel) {
    return state.gamer;
  }
  @Selector()
  static getUpcomingMatches(state: GamerStateModel) {
    return state.upComingMatches;
  }
  @Selector()
  static getPreferences(state: GamerStateModel) {
    return state.preferences;
  }
  @Selector()
  static getMatchStatistics(state: GamerStateModel) {
    return state.statistics;
  }
  @Selector()
  static getJoinedTournaments(state: GamerStateModel) {
    return state.joinedTournaments;
  }
  @Selector()
  static getJoinedChallenges(state: GamerStateModel) {
    return state.joinedChallenges;
  }
 @Selector()
  static getClaims(state: GamerStateModel) {
    return state.claims;
  }
  @Selector()
  static getConnectedLeagueAccounts(state: GamerStateModel) {
    return state.connectedLeagueAccounts;
  }
  @Selector()
  static getNewLeagueAccount(state: GamerStateModel) {
    return state.newLeagueAccount;
  }
 @Selector()
  static getRelations(state: GamerStateModel) {
    return state.relationships;
  }


  @Action(GetGamerProfile)
  getGamerProfile({getState, setState}: StateContext<GamerStateModel>, payload: any) {
    return this.gamerService.getGamerProfile(payload.slug).pipe(tap((result) => {
      const state = getState()
      console.log(result)
      setState({
        ...getState(),
        gamer: result,
      });
    },error => {
      console.log(error)
      if (error.status ===  404){
        this.router.navigate(['/404'])
      }
    }));
  }
  @Action(GetGamerRelationships)
  getGamerRelationship({getState, setState}: StateContext<GamerStateModel>, payload: any) {
    console.log(payload)
    return this.gamerService.getGamerRelation(payload.id).pipe(tap((result) => {
      const state = getState()
      console.log(result)
      setState({
        ...getState(),
        relationships: result,
      });
    }));
  }
  @Action(AddFriend)
  addFriend({getState, setState}: StateContext<GamerStateModel>, payload: any) {
    console.log(payload)
    return this.globalService.postRequest(payload.payload).pipe(tap((result) => {
      const state = getState()
      this.store.dispatch(new SetNotifications('Success', 'Friend is added successfully' , 'success'))
      if (state.gamer){
        state.gamer.friendship_request.friendRequestID = result.request.id
        state.gamer.friendship_request.hasSentFriendRequestTo = true
      }
      setState({
        ...getState(),
        relationships: result,
        gamer: state.gamer
      });
    }, (error) => {
      this.store.dispatch(new HandleError(error))
    }));
  }
  @Action(CancelFriendRequest)
  cancelFriendRequest({getState, setState}: StateContext<GamerStateModel>, payload: any) {
    return this.globalService.cancelRequest(payload.id).pipe(tap((result) => {
      const state = getState()
      this.store.dispatch(new SetNotifications('Success', `Friend request is cancelled successfully` , 'success'))
      state.relationships.friend = false

      if (state.gamer){
        state.gamer.friendship_request.hasSentFriendRequestTo = false
        state.gamer.friendship_request.hasFriendRequestFrom = false
      }
      setState({
        ...getState(),
        relationships: state.relationships,
        gamer: state.gamer
      });
    }, (error) => {
      this.store.dispatch(new HandleError(error))
    }));
  }
  @Action(RemoveFriendRequest)
  removeFriendRequest({getState, setState}: StateContext<GamerStateModel>, payload: any) {
    return this.gamerService.removeFriend(payload.id).pipe(tap((result) => {
      const state = getState()
      this.store.dispatch(new SetNotifications('Success', `Friend request is removed successfully` , 'success'))
      state.relationships.friend = false
      // if (state.gamer) {
        // state.gamer.friendship_request.hasFriendRequestFrom = false
        // state.gamer.friendship_request.hasSentFriendRequestTo = false
      // }
      setState({
        ...getState(),
        relationships: state.relationships,
      });
    }, (error) => {
      this.store.dispatch(new HandleError(error))
    }));
  }
  @Action(AcceptFriendRequest)
  acceptFriendRequest({getState, setState}: StateContext<GamerStateModel>, payload: any) {
    return this.globalService.updateRequest(payload.id).pipe(tap((result) => {
      const state = getState()
      this.store.dispatch(new SetNotifications('Success', 'Friend request is accepted successfully' , 'success'))
      state.relationships.friend = true

      if (state.gamer){
        state.gamer.friendship_request.hasFriendRequestFrom = false
      }
      setState({
        ...getState(),
        relationships: state.relationships,
        gamer: state.gamer
      });
    }, (error) => {
      this.store.dispatch(new HandleError(error))
    }));
  }

  @Action(GetUpcomingMatches)
  getUpcomingMatches({getState, setState}: StateContext<GamerStateModel>, payload: any ) {
    const state = getState()
    if(state.upComingMatches?.length > 0 && this.slug === payload.slug && !payload.status){
      return
    }
    return this.gamerService.getUpcomingMatches(payload.slug , payload.page , payload.status).pipe(tap((result) => {
        setState({
          ...getState(),
          upComingMatches: result,
        });
      }));
  }
  @Action(GetGamerPreferences)
  getGamerPreferences({getState, setState}: StateContext<GamerStateModel>, payload: any) {
    const state = getState()
    if(state.preferences?.length > 0){
      return
    }
    return this.gamerService.getPreferences(payload.slug).pipe(tap((result) => {
        setState({
          ...getState(),
          preferences: result,
        });
      }));
  }
  @Action(GetGamerStatistics)
  getGamerStatistics({getState, setState}: StateContext<GamerStateModel>, payload: any) {
    const state = getState()
    if(state.statistics?.length > 0){
      return
    }
    return this.gamerService.getMatchHistoryStats(payload.slug).pipe(tap((result) => {
        setState({
          ...getState(),
          statistics: result.stats,
        });
      }));
  }
  @Action(GetJoinedTournaments)
  getJoinedTournaments({getState, setState}: StateContext<GamerStateModel>, payload: any) {
    const state = getState()
    if(state.joinedTournaments?.data?.length > 0 && state?.joinedTournaments?.meta?.current_page === payload?.page && this.slug === payload.slug && this.tournamentSearch === payload?.search && this.tournamentStatus === payload?.status){
      return
    }
    this.slug = payload.slug
    this.tournamentSearch  = payload.search
    this.tournamentStatus  = payload.status
    return this.gamerService.getJoinedTournaments(payload.slug , payload.page , payload.status ,  payload.search).pipe(tap((result) => {
        setState({
          ...getState(),
          joinedTournaments: result,
        });
      }));
  }
  @Action(GetJoinedChallenges)
  getJoinedChallenges({getState, setState}: StateContext<GamerStateModel>, payload: any) {
    const state = getState()
    //check length of object
    if(state.joinedChallenges?.data?.length > 0 && state.joinedChallenges?.meta?.current_page === payload?.page && this.slug === payload.slug && !payload.search && !payload.status ){
      return
    }
    return this.gamerService.getJoinedChallenges(payload.slug , payload.page , payload.status , payload.search).pipe(tap((result) => {
        setState({
          ...getState(),
          joinedChallenges: result,
        });
      }));
  }
  @Action(GetUserClaims)
  getUserClaims({getState, setState}: StateContext<GamerStateModel>, payload: any) {
    const state = getState()
    if(state.claims?.data?.length > 0 && state.claims?.current_page === payload?.page){
      return
    }
    return this.gamerService.getUsersClaims(payload.page).pipe(tap((result) => {
        setState({
          ...getState(),
          claims: result,
        });
      }));
  }
  @Action(GetLeagueAccounts)
  getLeagueAccounts({getState, setState}: StateContext<GamerStateModel>, payload: any) {
    const state = getState()
    if(state.connectedLeagueAccounts?.length > 0 && this.slug === payload?.slug && this.tournamentCode === payload?.tournamentCode && this.challengeId === payload?.challengeId && !payload?.refreshAction && this.gameId === payload?.id){
      return
    }
    this.tournamentCode = payload.tournamentCode
    this.slug = payload.slug
    this.gameId = payload?.id
    this.challengeId = payload?.challengeId
    console.log(payload.challengeId)
    return this.globalService.getPublisherAccounts(payload.slug, payload.id , payload.tournamentCode , payload.challengeId).pipe(tap((result) => {
        setState({
          ...getState(),
          connectedLeagueAccounts: result,
        });
      }));
  }
  @Action(DeleteLeagueAccount)
  deleteLeagueAccount({getState, setState}: StateContext<GamerStateModel>, payload: any) {
    const state = getState()

    return this.gamerService.deleteLeagueAccount( payload.id).pipe(tap((result) => {
      state.connectedLeagueAccounts = state.connectedLeagueAccounts.filter((item: { id: any; }) => item.id !== payload.id)
      setState({
          ...getState(),
          connectedLeagueAccounts: state.connectedLeagueAccounts,
        });
      this.store.dispatch(new SetNotifications('Success', 'game is deleted successfully' , 'success'))

    },error => {
      this.store.dispatch(new HandleError(error))
    }));
  }
  @Action(AddLeagueAccount)
  addLeagueAccount({getState, setState}: StateContext<GamerStateModel>, payload: any) {
    const state = getState()
    return this.gamerService.linkLeague(payload.payload).pipe(tap((result) => {
        state.connectedLeagueAccounts.push(result)
        setState({
          ...getState(),
          connectedLeagueAccounts: state.connectedLeagueAccounts,
          newLeagueAccount: result
        });
      this.store.dispatch(new SetNotifications('Success', 'League Account is added successfully' , 'success'))

      },error => {
        this.store.dispatch(new HandleError(error))
      }));
  }
  @Action(UpdatePublisherAccount)
  updatePublisherAccount({getState, setState}: StateContext<GamerStateModel>, payload: any) {
    return this.gamerService.updatePublisherAccount(payload.accountId).pipe(tap((result) => {
      const state = getState()
        let indexOfAccounts = state.connectedLeagueAccounts.findIndex(account => account.id === payload.accountId);
      if (indexOfAccounts !== -1) {
        state.connectedLeagueAccounts[indexOfAccounts] = result
      }
        setState({
          ...getState(),
          connectedLeagueAccounts: state.connectedLeagueAccounts,
        });
      this.store.dispatch(new SetNotifications('Success', 'League Account is Updated successfully' , 'success'))

      },error => {
        this.store.dispatch(new HandleError(error))
      }));
  }
  @Action(ResetGamerState)
  resetState({getState, setState}: StateContext<GamerStateModel>) {
    const state = getState();
    return setState({
      ...state,
      gamer: null ,
      upComingMatches: [],
      preferences: [],
      statistics: {},
      joinedTournaments: {},
      joinedChallenges: {},
      claims: {},
      connectedLeagueAccounts: [],
      newLeagueAccount: {}
    });
  }

}







