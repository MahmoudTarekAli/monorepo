export class GetTournamentsList {
  static readonly type = '[Tournaments List] Get';

  constructor(public page?: number, public status?: string, public participantsType?: string | null, public gameId?: number | null) {
  }


}

export class GetTournament {
  static readonly type = '[Tournament] Get';

  constructor(public id: string) {
  }
}

export class GetTournamentTeam {
  static readonly type = '[TournamentTeam] Get';

  constructor(public tournamentId: string, public teamId: string) {

  }
}

export class GetTeamAuthority {
  static readonly type = '[TeamAuthority] Get';

  constructor(public tournamentId: string, public teamId: string) {

  }
}

export class IsArenaFollowed {
  static readonly type = '[isArenaFollowed] Post';

  constructor(public arenaId: string) {

  }
}

export class UpdateIsArenaFollowed {
  static readonly type = '[updateArenaFollowed] Post';

  constructor(public isFollowed: boolean) {

  }
}
