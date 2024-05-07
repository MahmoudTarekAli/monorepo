
export class GetMyTeams {
  static readonly type = '[MyTeams] Get';
  constructor() {
  }
}
export class GetTeam {
  static readonly type = '[Team] Get';
  constructor(public id: string , public tournamentId?:string , public isTournament?:boolean) {

  }
}
export class GetTeamStats {
  static readonly type = '[TeamStats] Get';
  constructor(public id: string) {

  }
}
export class UpdateTeam {
  static readonly type = '[UpdateTeam] ';
  constructor(public id: string , public payload: any) {

  }
}
export class CreateTeam {
  static readonly type = '[CreateTeam] ';
  constructor( public payload: any) {

  }
}
export class GetTeamUpcomingMatches {
  static readonly type = '[ UpcomingMatchesTeam] Get ';
  constructor( public id: string) {

  }
}
export class GetTeamJoinTournaments {
  static readonly type = '[JoinTournamentsTeam] Get';
  constructor( public id: string) {

  }
}
export class GetRequest {
  static readonly type = '[TeamRequests] Get';
  constructor( public id: string , public direction:string , public tournamentCode?:string) {
  }
}
export class InviteMember {
  static readonly type = '[InviteMember] ';
  constructor(  public payload:any) {
  }
}
export class CancelMemberRequest {
  static readonly type = '[CancelMemberRequest] ';
  constructor(  public id:string , public direction:string) {
  }
}
export class AcceptTeamMember {
  static readonly type = '[AcceptTeamMember] ';
  constructor(  public id:string , public direction:string , public member:any , public numberOfMemberInTournament?:number) {
  }
}
export class LeaveTeam {
  static readonly type = '[LeaveTeam] ';
  constructor(  public id:number) {
  }
}
export class RemoveTeamMember {
  static readonly type = '[RemoveMember]  ';
  constructor(  public teamId:string , public memberId:string) {
  }
}

export class SelectRole {
  static readonly type = '[SelectRole]';
  constructor(  public id:string , public payload:any , public isTournament?:boolean) {

  }
}
export class SelectTeamMemberTournament {
  static readonly type = '[SelectTeamMemberTournament]';
  constructor(  public tournamentId:string , public teamId:string , public payload:any) {

  }
}
export class UnSelectTeamMemberTournament {
  static readonly type = '[UnSelectTeamMemberTournament]';
  constructor(  public tournamentId:string , public teamId:any , public payload:any) {

  }
}
export class AssignLeader {
  static readonly type = '[AssignLeader]';
  constructor(  public tournamentId:string , public teamId:any , public payload:any) {

  }
}
export class ResetTeamState {
  static readonly type = '[ResetTeamState]';
  constructor( ) {

  }
}

