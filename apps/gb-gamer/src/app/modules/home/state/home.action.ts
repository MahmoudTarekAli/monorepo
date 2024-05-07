export class GetTournaments {
  static readonly type = '[Tournaments] Get';
  constructor(public page?: number , public status?:string , public per_page?:number , public collection?:string) {
  }
}

export class GetChallenges {
  static readonly type = '[Challenges] Get';
  constructor(public page?: number , public per_page?:number , public status?:string[] , public game?:string ) {
  }
}

export class GetFeaturedGames {
  static readonly type = '[Featured Games] Get';
  constructor(public page?: number) {
  }
}

export class GetBanners {
  static readonly type = '[Banners Games] Get';
  constructor() {
  }
}
export class GetPremiumPlayable {
  static readonly type = '[Premium Playable] Get';
  constructor() {
  }
}
export class GetStoreProducts {
  static readonly type = '[Store Products] Get';
  constructor(public page?: number) {
  }
}


