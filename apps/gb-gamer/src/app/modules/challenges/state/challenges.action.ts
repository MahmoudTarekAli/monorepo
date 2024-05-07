
export class GetChallengesList {
  static readonly type = '[ChallengesList] Get';
  constructor(public page?: number, public status?: string[] , public game_code?:string) {
  }
}
export class UpdateSocketChallenge {
  static readonly type = '[ChallengesSocket] Get';
  constructor(public payload:any) {
  }
}

export class GetChallenge {
  static readonly type = '[Challenge] Get';
  constructor(public code?: string ) {
  }
}
export class GetIsJoinedChallenge {
  static readonly type = '[Challenge Is Joined] Get';
  constructor(public code?: string ) {
  }
}
export class ClaimScore {
  static readonly type = '[ClaimScore] Get';
  constructor(public code?: string , public password?:string) {
  }
}
export class GetParticipants {
  static readonly type = '[Challenge Participants ] Get';
  constructor(public code?: string , public page?:number) {
  }
}
export class JoinChallenge {
  static readonly type = '[Join Challenge ] Post';
  constructor(public id?: string , public payload?:any) {
  }
}

// export class FilterChallenges {
//   static readonly type = '[Challenges Filters] Get';
//   constructor(public genres?:string) {
//   }
// }

