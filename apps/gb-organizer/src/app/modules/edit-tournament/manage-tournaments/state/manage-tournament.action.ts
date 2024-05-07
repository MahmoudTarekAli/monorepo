// create action ManagedTournamentLogs with payload
export class ManagedTournamentLogs {
  static readonly type = '[ManagedTournament] Logs';

  constructor(public payload: any, public page?: any) {
  }
}

export class EmptyTournamentParticipants {
  static readonly type = '[TournamentParticipants] Get';
}

export class GetTournamentAllParticipants {
  static readonly type = '[GetTournamentAllParticipants] Participants';

  constructor(public payload: any) {
  }
}

export class ShuffleSingleBracket {
  static readonly type = '[ShuffleBracket] Bracket';

  constructor(public bracket: any, public type: any, public numberOFParticipantPerGroup?: any, public numberOFQualifiedParticipants?: any) {
  }
}
