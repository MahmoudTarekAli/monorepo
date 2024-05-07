interface NotificationAction {
  type: 'success' | 'error' | 'warning' | 'blank' | 'info'; // specify the allowed values for the type property
  title: string;
  message: string;
  disappear?: number;
}

export class GetCountries {
  static readonly type = '[Countries] Get';
}

export class SetNotifications {
  static readonly type = '[Notification] Success';

  constructor(public title: string, public message: string, public type: string, public disappear?: any) {
  }
}


export class HandleError {
  static readonly type = '[Auth] Error';

  constructor(public payload: any) {
  }
}

export class SetMissingFields {
  static readonly type = '[MissingFields] Missing';

  constructor(public title: string, public isValid: boolean) {
  }
}

export class GetLeaderboard {
  static readonly type = '[LeaderBoard] Get';

  constructor(public code: string) {
  }
}

export class GetGameLeaderboardPoints {
  static readonly type = '[LeaderBoard Points] Get';

  constructor(public id: number, public page: number) {
  }
}

export class GetCoins {
  static readonly type = '[Coins] Get';

  constructor() {
  }
}

export class GetFriends {
  static readonly type = '[Friends] Get';

  constructor() {
  }
}
export class GetMonthlyJoinCount {
  static readonly type = '[GetMonthlyJoinCount] Get';

  constructor(public slug:string) {
  }
}

export class SetSearchKey {
  static readonly type = '[Search Action] SET ACTION';
  constructor(public word: string, public filter?: string) {
  }
}

