
export class GetLeagueServers {
  static readonly type = '[LeagueServers] Get';
  constructor() {
  }
}

export class GetBlockedUsers {
  static readonly type = '[BlockedUsers] Get';
  constructor() {
  }
}
export class GetSocialAccounts {
  static readonly type = '[GetSocialAccounts] Get';
  constructor() {
  }
}
export class DisconnectSocialAccount {
  static readonly type = '[DisconnectSocialAccount] Delete';
  constructor(public socialId:string) {
  }
}
export class GetThirdPartyIntegration {
  static readonly type = '[GetThirdPartyIntegration] Get';
  constructor() {
  }
}
export class DisconnectThirdParty {
  static readonly type = '[DisconnectThirdParty] Delete';
  constructor(public phoneNumber:string) {
  }
}

