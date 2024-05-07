export class GetTree {
  static readonly type = '[tree] MatchesTree';

  constructor(public payload: any , public type: string) {
  }
}
export class GetWinnerTree {
  static readonly type = '[winnerTree] MatchesTree';

  constructor(public payload: any , public type: string) {
  }
}
export class GetLoserTree {
  static readonly type = '[loserTree] MatchesTree';

  constructor(public payload: any , public type: string) {
  }
}

// export class GetTournamentParticipants {
//   static readonly type = '[GetTournamentParticipants] Participants';
//
//   constructor(public id: string) {
//   }
// }
