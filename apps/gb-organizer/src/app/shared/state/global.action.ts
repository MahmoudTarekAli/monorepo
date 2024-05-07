import {Tournament} from "../../modules/tournaments/models/tournament";

export class GetCountries {
  static readonly type = '[Countries] Get';
}

export class SetNotifications {
  static readonly type = '[Notification] Success';

  constructor(public title: string, public message: string, public type: string, public disappear?: any) {
  }
}
export class GetCoins {
  static readonly type = '[Coins] Get';

  constructor() {
  }
}
export class GetMonthlyJoinCount {
  static readonly type = '[GetMonthlyJoinCount] Get';

  constructor(public slug: string) {
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
