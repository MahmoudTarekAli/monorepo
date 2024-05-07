import {State, Action, StateContext, Selector, createSelector, Store} from '@ngxs/store'
import {
  AcceptTeamMember,
  AssignLeader,
  CancelMemberRequest,
  CreateTeam,
  GetMyTeams,
  GetRequest,
  GetTeam,
  GetTeamJoinTournaments,
  GetTeamStats,
  GetTeamUpcomingMatches,
  InviteMember,
  LeaveTeam,
  RemoveTeamMember,
  ResetTeamState,
  SelectRole,
  SelectTeamMemberTournament,
  UnSelectTeamMemberTournament,
  UpdateTeam
} from './team.action'
import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {GamerService} from "../../gamer/service/gamer.service";
import {TeamsService} from "../service/teams.service";
import {Team} from "../../../shared/models/team";
import {GetGamerStatistics, ResetGamerState} from "../../gamer/state/gamer.action";
import {GamerStateModel} from "../../gamer/state/gamer.state";
import {HandleError, SetNotifications} from "../../../shared/state/global.action";
import {GlobalService} from "../../../shared/service/global.service";

export class TeamStateModel {
  teams: [];
  team: Team | null;
  statistics: any;
  upComingMatches: any;
  joinedTournaments: any;
  requests: any;
}

@State<TeamStateModel>({
  name: 'team',
  defaults: {
    teams: [] ,
    team: null,
    statistics: {},
    upComingMatches: {},
    joinedTournaments: [],
    requests: {incoming : [] , outgoing: []}

  }
})

@Injectable()
export class TeamState {
 tournamentOutgoingCode:string
 tournamentIncomingCode:string
  constructor(private gamerService: GamerService , private teamService:TeamsService , private router:Router , private store:Store , private globalService:GlobalService) {

  }

  @Selector()
  static getMyTeams(state: TeamStateModel) {
    return state.teams;
  }
  @Selector()
  static getTeam(state: TeamStateModel) {
    return state.team;
  }
  @Selector()
  static getTeamStats(state: TeamStateModel) {
    return state.team;
  }
  @Selector()
  static getJoinedTournaments(state: TeamStateModel) {
    return state.joinedTournaments;
  }
  @Selector()
  static getUpcomingMatches(state: TeamStateModel) {
    return state.upComingMatches;
  }
  @Selector()
  static getRequests(state: TeamStateModel) {
    return state.requests;
  }

  @Action(CreateTeam)
  createTeam({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    return this.teamService.createTeam(payload.payload).pipe(tap((res:any) => {
      console.log(res)
      // @ts-ignore
      state.teams.unshift(res)
      this.router.navigateByUrl('/teams/' + res.id);
      this.store.dispatch(new SetNotifications('Success', 'Team is updated successfully' , 'success'))

    }));
  }
  @Action(UpdateTeam)
  updateTeam({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    return this.teamService.updateTeam(payload.id,payload.payload).pipe(tap((res:any) => {
      this.store.dispatch(new SetNotifications('Success', 'Team is updated successfully' , 'success'))

      // this.router.navigateByUrl('/teams/' + res.id);

    }));
  }
  @Action(GetMyTeams)
  getMyTeams({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    if(state.teams?.length > 0){
      return
    }
    return this.teamService.getMyTeams().pipe(
      tap((result) => {
        const state = getState();
        setState({
          ...state,
          teams: result
        });
      }))
  }
  @Action(GetTeam)
  getTeam({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    return this.teamService.getTeam(payload.id , payload.tournamentId , payload.isTournament).pipe(
      tap((result:any) => {
        this.teamService.isTeamOwner = this.gamerService.isOwner(result.owner.id)
        // console.log(result.owner.id , this.teamService.isTeamOwner)
        // console.log(this.gamerService.isOwner(result.owner.id))
        const state = getState();
        setState({
          ...state,
          team: result
        });
      }))
  }
  @Action(GetTeamStats)
  getTeamStats({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    if(state.statistics?.length > 0){
      return
    }
    return this.teamService.getTeamMatchHistoryStats(payload.id).pipe(tap((result) => {
      setState({
        ...getState(),
        statistics: result.stats,
      });
    }));
  }
  @Action(GetTeamUpcomingMatches)
  getUpcomingMatches({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    if(state.upComingMatches?.length > 0){
      return
    }
    return this.teamService.getTeamUpcomingMatches(payload.id).pipe(tap((res) => {
      setState({
        ...getState(),
        upComingMatches: res,
      });
    }));
  }
  @Action(GetTeamJoinTournaments)
  getTeamJoinTournaments({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    if(state.joinedTournaments?.length > 0){
      return
    }
    return this.teamService.getTeamJoinedTournaments(payload.id).pipe(tap((res) => {
      setState({
        ...getState(),
        joinedTournaments: res,
      });
    }));
  }
  @Action(GetRequest)
  getRequests({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    console.log(state.requests?.outgoing , payload?.tournamentCode)
    if(state.requests?.[payload.direction]?.length > 0 && ((payload.direction == 'outgoing' && this.tournamentOutgoingCode == payload?.tournamentCode) || (payload.direction == 'incoming' && this.tournamentIncomingCode == payload?.tournamentCode))) {
      return
    }
    if (payload.direction == 'outgoing') {
      this.tournamentOutgoingCode = payload?.tournamentCode
    }else {
      this.tournamentIncomingCode = payload?.tournamentCode
    }
    return this.globalService.getRequests(payload.id , payload.direction , payload.tournamentCode).pipe(tap((res) => {
      state.requests[payload.direction] = res
      setState({
        ...getState(),
        requests: state.requests,
      });
    }));
  }
  @Action(InviteMember)
  inviteMember({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    return this.globalService.postRequest(payload.payload).pipe(tap((res) => {
      this.store.dispatch(new SetNotifications('Success', 'Invitation is sent successfully' , 'success'))
      state.requests.outgoing.push(res.request)
      setState({
        ...getState(),
        requests: state.requests,
      })
    }, error => {
      this.store.dispatch(new HandleError(error))

    }));
  }
  @Action(AcceptTeamMember)
  acceptTeamMember({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    return this.globalService.updateRequest(payload.id).pipe(tap((res) => {
      this.store.dispatch(new SetNotifications('Success', 'Member is joined team successfully' , 'success'))
      state.requests[payload.direction] = state.requests?.[payload.direction].filter((item:any) => item.id !== payload.id)

      let member = {...payload.member , roles: ['Player']}
      if(state.team) {
        const numberofMemberInTeam = state?.team.members['data'].filter((item:any) => item.is_joined).length
        console.log(numberofMemberInTeam , payload.numberOfMemberInTournament)
        if(numberofMemberInTeam < payload.numberOfMemberInTournament){
          member.is_joined = true
        }
      }

      if(state.team){
        state.team.members['data'].push(member)
      }
      setState({
        ...getState(),
        requests: state.requests,
        team: state.team
      })
    }, error => {
      this.store.dispatch(new HandleError(error))

    }));
  }
  @Action(SelectRole)
  selectRole({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    return this.teamService.selectRole(payload.id , payload.payload , payload.isTournament).pipe(tap((res) => {
      this.store.dispatch(new SetNotifications('Success', 'Role is selected successfully' , 'success'))
      setState({
        ...getState(),
        team: res,
      })
    }, error => {
      this.store.dispatch(new HandleError(error))

    }));
  }

  @Action(CancelMemberRequest)
  cancelMemberRequest({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    return this.globalService.cancelRequest(payload.id).pipe(tap((res) => {
      this.store.dispatch(new SetNotifications('Success', 'Invitation is cancelled successfully' , 'success'))
      state.requests[payload.direction] = state.requests?.[payload.direction].filter((item:any) => item.id !== payload.id)
      setState({
        ...getState(),
        requests: state.requests,
      })
    },error => {
      this.store.dispatch(new HandleError(error))
    }));
  }
  @Action(RemoveTeamMember)
  removeTeamMember({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    return this.teamService.removeMember(payload.teamId , payload.memberId).pipe(tap((res) => {
      this.store.dispatch(new SetNotifications('Success', 'Member is removed successfully' , 'success'))
      setState({
        ...getState(),
        team: res.team,
      })
    },error => {
      this.store.dispatch(new HandleError(error))
    }));
  }
  @Action(LeaveTeam)
  leaveTeam({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    return this.teamService.leaveTeam(payload.id).pipe(tap((res) => {
      this.store.dispatch(new SetNotifications('Success', 'You left team successfully' , 'success'))
      setState({
        ...getState(),
        team: res.team,
      })
    },error => {
      this.store.dispatch(new HandleError(error))
    }));
  }
  @Action(UnSelectTeamMemberTournament)
  unselectTeamMemberTournament({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    return this.teamService.unSelectTournamentTeamMember(payload.tournamentId, payload.teamId , payload.payload).pipe(tap((res) => {
      this.store.dispatch(new SetNotifications('Success', 'Member is unselected successfully' , 'success'))
      setState({
        ...getState(),
        team: res.team,
      })
    },error => {
      this.store.dispatch(new HandleError(error))
    }));
  }
  @Action(SelectTeamMemberTournament)
  selectTeamMemberTournament({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    return this.teamService.selectTournamentTeamMember(payload.tournamentId, payload.teamId , payload.payload).pipe(tap((res) => {
      this.store.dispatch(new SetNotifications('Success', 'Member is selected successfully' , 'success'))
      setState({
        ...getState(),
        team: res.team,
      })
    },error => {
      this.store.dispatch(new HandleError(error))
    }));
  }
  @Action(AssignLeader)
  assignLeader({getState, setState}: StateContext<TeamStateModel>, payload: any) {
    const state = getState()
    return this.teamService.assignLeader(payload.tournamentId, payload.teamId , payload.payload).pipe(tap((res) => {
      this.store.dispatch(new SetNotifications('Success', 'Leader is transferred successfully' , 'success'))
      setState({
        ...getState(),
        team: res.team,
      })
    },error => {
      this.store.dispatch(new HandleError(error))
    }));
  }
  @Action(ResetTeamState)
  resetState({getState, setState}: StateContext<TeamStateModel>) {
    const state = getState();
    return setState({
      ...state,
      teams: [] ,
      team: null,
      statistics: {},
      upComingMatches: {},
      joinedTournaments: [],
      requests: {incoming : [] , outgoing: []}

    });
  }

}







