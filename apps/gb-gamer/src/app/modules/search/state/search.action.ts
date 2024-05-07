export class GetSearch {
  static readonly type = '[Search] Get';

  constructor(public word: string) {
  }
}

export class GetSearchFiltered {
  static readonly type = '[Search Filtered] Get';

  constructor(public word: string, public api: string, public page: number) {
  }
}


export class SetSearch {
  static readonly type = '[Search] Set';

  constructor(public data: any) {
  }
}
