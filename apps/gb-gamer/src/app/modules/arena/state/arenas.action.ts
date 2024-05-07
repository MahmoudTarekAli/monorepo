export class CreateArena {
  static readonly type = '[Create Arena] ';

  constructor(public payload: any) {
  }
}

export class UpdateArena {
  static readonly type = '[Update Arena] ';

  constructor(public code: string, public payload: any) {
  }
}

export class GetArenasList {
  static readonly type = '[Active Arenas] Get';

  constructor(public page?: number, public search?: string) {
  }
}

export class GetChallengesArena {
  static readonly type = '[ChallengesArena] Get';

  constructor(public arenaSlug: string, public page?: number, public per_page?: number, public status?: string[]) {
  }

}

export class GetArenaEvents {
  static readonly type = '[ArenaEvents] Get';

  constructor(public slug: string) {
  }

}

export class GetArena {
  static readonly type = '[Arena] Get';

  constructor(public code: string) {
  }
}

export class FollowUnFollowArena {
  static readonly type = '[FollowUnFollowArena ] ';

  constructor(public code?: string, public type?: string) {

  }
}

export class GetFeaturedArenas {
  static readonly type = '[Featured Arenas] Get';

  constructor() {
  }
}

export class GetTournamentsArena {
  static readonly type = '[Tournaments Arena] Get';

  constructor(public code: string, public page?: number, public status?: any) {
  }
}

export class AssignUnassignRole {
  static readonly type = '[Assign Role]';

  constructor(public code: string, public payload: any, public type: string) {
  }
}

export class GetControllers {
  static readonly type = '[Controllers] Get';

  constructor(public code: string) {
  }
}

export class SearchArenas {
  static readonly type = '[Arenas Search] Get';

  constructor(public code: string, public type: string) {
  }

}

export class ManageArenaActions {
  static readonly type = '[Manage Arena Actions]';

  constructor(public slug: string, public payload: any) {
  }
}
