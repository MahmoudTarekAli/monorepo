import {Tournament} from "../../../tournaments/models/tournament";

export class UpdateTournament {
  static readonly type = '[Tournament] Update';

  constructor(public payload: any, public id: any, public updateType?: any) {
  }
}

export class GetTournament {
  static readonly type = '[ReturnTournament] Get';

  constructor(public payload: {}) {
  }

}

export class GetEvents {
  static readonly type = '[Events] Get';
}

export class GetThirdParties {
  static readonly type = '[ThirdParties] Get';
}


export class PublishFirstStage {
  static readonly type = '[PublishFirstStage] PublishFirstStage';

  constructor(public tournamentCode, public payload?: any) {
  }
}

export class ResetTree {
  static readonly type = '[ResetTree] ResetTree';

  constructor(public tournamentCode: any, public stageIndex: number) {
  }
}

export class PublishNextStage {
  static readonly type = '[PublishNextStage] NextStage';

  constructor(public tournamentCode: any) {
  }
}

export class ResetTournament {
  static readonly type = '[ResetTournament] ResetTournament';

  constructor(public tournamentCode: any) {
  }
}

export class TournamentRegistration {
  static readonly type = '[TournamentRegistration] TournamentRegistration';

  constructor(public tournamentCode: any, public registrationToggle: any) {
  }
}

export class TournamentCheckIn {
  static readonly type = '[TournamentCheckIn] TournamentCheckIn';

  constructor(public tournamentCode: any, public checkInToggle: any) {
  }
}
export class FinishTournament {
  static readonly type = '[FinishTournament] FinishTournament';

  constructor(public tournamentCode: any , public participants: any) {
  }
}
export class DeleteTournament {
  static readonly type = '[DeleteTournament] DeleteTournament';

  constructor(public tournamentCode: any) {
  }
}
export class CancelTournament {
  static readonly type = '[CancelTournament] CancelTournament';

  constructor(public tournamentCode: any , public status: any) {
  }
}
export class GetUserAuthority {
  static readonly type = '[getUserAuthority] UserAuthority';

  constructor(public tournamentCode: any) {
  }
}
