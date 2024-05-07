export class GetTournamentAllMatches {
  static readonly type = '[GetTournamentAllMatches] AllMatches';

  constructor(public id: string) {
  }
}
export class UpdateMatchScoreClaims {
  static readonly type = '[UpdateMatchScoreClaims] Match';

  constructor( public match: any , public payload: any) {

  }
}
