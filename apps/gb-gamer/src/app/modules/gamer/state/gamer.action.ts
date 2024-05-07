

export class GetGamerProfile {
  static readonly type = '[GamerProfile] Get';
  constructor(public slug: string) {
  }
}
export class GetGamerRelationships {
  static readonly type = '[GamerRelationship] Get';
  constructor(public id: number) {
  }
}
export class GetGamerPreferences {
  static readonly type = '[Preferences] Get';
  constructor(public slug: string) {
  }
}
export class GetGamerStatistics {
  static readonly type = '[MatchHistoryStats] Get';
  constructor(public slug: string) {
  }
}
export class GetJoinedChallenges {
  static readonly type = '[JoinedChallenges] Get';
  constructor(public slug: string, public page?: number, public status?:string, public search?:string) {
  }
}
export class GetJoinedTournaments {
  static readonly type = '[JoinedTournaments] Get';
  constructor(public slug: string , public page?: number , public status?:string , public search?: string) {

  }
}
export class GetUpcomingMatches {
  static readonly type = '[UpcomingMatches] Get';
  constructor(public slug: string , public page?: number , public status?:string ) {
  }
}
export class GetUserClaims {
  static readonly type = '[UserClaims] Get';
  constructor( public page?: number) {
  }
}
export class GetLeagueAccounts {
  static readonly type = '[GetLeagueAccounts] Get';
  constructor(public slug?: string, public id?: number , public tournamentCode?: string , public refreshAction?: boolean , public challengeId?: string) {

  }
}

export class DeleteLeagueAccount {
  static readonly type = '[DeleteLeagueAccount] Delete';
  constructor( public id: number) {
  }
}
export class AddLeagueAccount {
  static readonly type = '[AddLeagueAccount] Post';
  constructor( public payload: any) {
  }
}
export class AddFriend {
  static readonly type = '[AddFriend] Post';
  constructor( public payload: any) {
  }
}
export class CancelFriendRequest {
  static readonly type = '[CancelFriend] Post';

  constructor(public id: number) {
  }
}
  export class RemoveFriendRequest {
  static readonly type = '[RemoveFriendRequest] Post';
  constructor( public id: number ) {
  }
}
export class AcceptFriendRequest {
  static readonly type = '[AcceptFriendRequest] Post';
  constructor( public id: number ) {
  }
}

export class ResetGamerState {
  static readonly type = '[ResetGamerState]';
  constructor() {
  }
}
export class UpdatePublisherAccount {
  static readonly type = '[UpdatePublisherAccount]';
  constructor(public accountId: string) {

  }
}
