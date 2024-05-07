export class GetMatches {
  static readonly type = '[GetMatches] Matches';

  constructor(public id: string, public stage: any, public type?: string) {
  }
}

export class SetMatches {
  static readonly type = '[SetMatches] matches'

  constructor(public rounds: any, public bracketType: any, public stage: any) {
  }
}


export class ChangeStage {
  static readonly type = '[ChangeStage] Stage';

  constructor(public stage: any) {
  }
}

export class GetMatch {
  static readonly type = '[GetMatch] Match';

  constructor(public selectedMatch: any, public matchPayload?: any) {
  }
}

export class GetTournamentParticipants {
  static readonly type = '[GetTournamentParticipants] Participants';

  constructor(public id: string) {
  }
}

export class UpdateMatchScore {
  static readonly type = '[UpdateMatchScore] Match';

  constructor(public selectedBracketMatchType: string, public match: any, public payload: any, public stage: any, public round: string, public index: number, public fromSocket?: boolean) {
  }
}

export class QualifyWinner {
  static readonly type = '[QualifyWinner] Winner';

  constructor(public selectedBracketMatchType: string, public match: any, public stage: any, public round: string, public index: number, public fromSocket?: boolean) {
  }
}

export class UpdateParticipantScoreFreeForAll {
  static readonly type = '[UpdateMatchScoreFFA] FFA';

  constructor(public stage: any, public payload: any, public groupIndex: string) {

  }
}

export class UpdateMatchStatus {
  static readonly type = '[UpdateMatchStatus] Match';

  // manualApplyStatus is used to changed status manually after set the match score
  constructor(public selectedBracketMatchType: string, public match: any, public payload: any, public stage: any, public index: number, public manualApplyStatus?: boolean) {
  }
}

export class UpdateRoundMatchesStatus {
  static readonly type = '[UpdateRoundMatchesStatus] Round';

  constructor(public selectedBracketMatchType: string, public tournamentId: string, public treeId: any, public payload: any, public stage: any, public index: number) {
  }
}

export class ReplaceParticipant {
  static readonly type = '[ReplaceParticipant] Replace';

  constructor(public selectedBracketMatchType: string, public matchCode: any, public payload: any, public stage: any, public index: number) {
  }
}

export class ResetMatches {
  static readonly type = '[ResetMatches] Reset';

  constructor(public selectedBracketMatchType: string, public tournamentCode: any, public payload: any, public stage: any, public index: number) {
  }
}

export class SetMatchesDate {
  static readonly type = '[SetMatchesDate] Date';

  constructor(public selectedBracketMatchType: string, public tournamentId: string, public treeId: any, public payload: any, public stage: any, public index: number) {
  }
}

export class ResetBracket {
  static readonly type = '[ResetBracket] ResetBracket';

  constructor(public tournamentCode: any, public stageIndex: number) {
  }
}



export class ResetState {
  static readonly type = '[Reset State] Reset Matches';

  constructor() {
  }
}
