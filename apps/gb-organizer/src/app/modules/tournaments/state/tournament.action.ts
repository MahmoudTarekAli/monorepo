import {Tournament} from '../models/tournament';

export class AddTournament {
  static readonly type = '[Tournament] Add';

  constructor(public payload: Tournament) {
  }
}

export class GetTournaments {
  static readonly type = '[Tournament] Get';

  constructor(public page?: number  , public name?: string, public status?: string, public ParticipantsType?: boolean, public arenaId?: number, public gameId?: number , public startAt?: string, public createdAt?: string) {
  }


}

export class GetOrganizedTournaments {
  static readonly type = '[OrganizedTournament] Get';

  constructor(public page?: number, public status?: string, public name?: string) {
  }

}

export class ChangePage {
  static readonly type = '[pagination] Get';

  constructor(public funcName: string, public stateName, public page?: number) {
  }
}

export class GetArenas {
  static readonly type = '[Arenas] Get';
}

export class GetGames {
  static readonly type = '[Games] Get';
}

export class GetFeaturedGames {
  static readonly type = '[Featured Games] Get';
  constructor(public isMostUsed?: any) {
  }
}


export class UpdateTournament {
  static readonly type = '[Tournament] Update';

  constructor(public payload: Tournament, public id: number) {
  }
}
export class GetGameSettings {
  static readonly type = '[Game Settings] Get';
  constructor(public gameCode: string) {
  }
}
