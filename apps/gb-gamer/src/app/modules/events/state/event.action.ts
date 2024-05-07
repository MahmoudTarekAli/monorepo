export class GetEvent {
  static readonly type = '[Event] Get';

  constructor(public code: string) {
  }
}

export class GetEventTournaments {
  static readonly type = '[EventTournaments] Get';

  constructor(public code: string, public type: string, public page: any, public gameCode?: string,) {
  }
}

export class GetEventChallenge {
  static readonly type = '[EventChallenge] Get';

  constructor(public code: string, public game?:string) {
  }
}

export class GetEventPlayables {
  static readonly type = '[EventsTournamentsChallenges] Get';

  constructor(public code: string, public page: number = 1) {
  }
}

export class GetEventArenas {
  static readonly type = '[GetEventArenas] Get';

  constructor(public code: string, public page: number = 1) {
  }
}

export class CreateEvent {
  static readonly type = '[CreateEvent] Create';

  constructor(public event: any) {
  }
}

export class UpdateEvent {
  static readonly type = '[UpdateEvent] Update';

  constructor(public event: any, public id: string) {
  }
}

export class GetArenas {
  static readonly type = '[Arenas] Get';
}
