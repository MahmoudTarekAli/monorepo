

export class GetChallengesList {
  static readonly type = '[ChallengesList] Get';
  constructor(public page?: number  , public type?: string , public gameCode?: string , public startAt: string = '' , public endDate: string = '') {
  }
}
export class GetChallenge {
  static readonly type = '[Challenge] Get';
  constructor(public challengeId?: number) {
  }
}

export class CreateChallenge {
  static readonly type = '[Create Challenge] ';
  constructor(public payload: any) {
  }
}
export class UpdateChallenge {
  static readonly type = '[Update Challenge] ';
  constructor(public id: string , public payload: any) {
  }
}


export class GetChallengesGames {
  static readonly type = '[Challenges Games] Get';
  constructor() {}
}


export class GetGameSettings {
  static readonly type = '[ChallengeGameSettings] Get';
  constructor(public gameCode: string) {
  }
}
export class GetChallengeSettings {
  static readonly type = '[ChallengeSettings] Get';
  constructor() {
  }
}
