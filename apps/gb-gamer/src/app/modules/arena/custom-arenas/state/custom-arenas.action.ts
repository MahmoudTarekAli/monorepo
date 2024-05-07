
export class CreateArena {
  static readonly type = '[Create Arena] ';
  constructor(public payload:any) {
  }
}

export class GetCustomArenaTournaments {
  static readonly type = '[TournamentsCustomArenas] Get';
  constructor(public arenaSlug?: string , public status?:string[] , public gameCode?:string , public statusType?:string) {
  }
}
export class GetCustomArenaGames {
  static readonly type = '[CustomArenaGames] Get';
  constructor(public arenaSlug?: string ) {
  }
}
