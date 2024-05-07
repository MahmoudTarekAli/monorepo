
export class GetGamesList {
  static readonly type = '[Games] Get';
  constructor(public page?: number, public genres?: string[]) {
  }
}
export class GetTrendingGames {
  static readonly type = '[Trending Games] Get';
  constructor() {
  }
}
export class GetGame {
  static readonly type = '[Game] Get';
  constructor(public code?: string ) {
  }
}
export class FollowGame {
  static readonly type = '[Follow Game] ';
  constructor(public code?: string  , public isFollow?: boolean) {

  }
}
export class AddToFavourite {
  static readonly type = '[Add Favorite Game] ';
  constructor(public code?: string) {

  }
}
export class GetTournamentsGame {
  static readonly type = '[Tournaments Game] Get';
  constructor(public code: string , public status?: string , public page?: number) {
  }
}
export class GetChallengesGame {
  static readonly type = '[Challenges] Get';
  constructor(public page?: number , public per_page?:number , public status?:string[] , public game?:string ) {
  }
}


export class GetGenres {
  static readonly type = '[Genres] Get';
  constructor() {
  }
}
export class FilterGames {
  static readonly type = '[Games Filters] Get';

  constructor(public code?: string, public isSearch?: boolean) {
  }
}
  export class SearchGames {
    static readonly type = '[Games Search] Get';

    constructor(public code?:string){
    }

}

