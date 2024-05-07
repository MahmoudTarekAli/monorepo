import {StepperStep} from "../../models/stepper-step";

export class OpenJoinTournamentDialog {
  static readonly type = '[Open Join Tournament Dialog] Get';

  constructor(public tournamentId: string) {
  }
}

export class CompareRequiredInputs {
  static readonly type = '[Compare Required Inputs] Get';

  constructor(public tournamentId: string) {
  }
}

export class UpdateStepperState {
  static readonly type = '[Stepper] Update Stepper State';

  constructor(public payload: StepperStep[]) {
  }
}

export class SetActiveStepId {
  static readonly type = '[Set Stepper ActiveId] Active'

  constructor(public id: number) {
  }
}


export class IsJoined {
  static readonly type = '[IsJoined] Get';
  constructor(public tournamentId: string) {
  }
}
export class UpdateIsJoined {
  static readonly type = '[UpdateIsJoined] Get';
  constructor(public isJoined: boolean) {
  }
}
export class UpdateIsJoinedData {
  static readonly type = '[UpdateIsJoinedData] Get';
  constructor(public isJoinedData: any) {
  }
}
