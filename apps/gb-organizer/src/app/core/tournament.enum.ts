export enum STAGES {
  FIRST_STAGE = 'first_stage',
  SECOND_STAGE = 'second_stage',
}

export enum BRACKET_TYPES {
  SINGLE_ELIMINATION = 'SingleElimination',
  DOUBLE_ELIMINATION = 'DoubleElimination',
  GROUP_STAGE = 'GroupStage',
  FREE_FOR_ALL = 'FreeForAll',
  ROUND_ROBIN = 'RoundRobin',
}

export enum BRACKET_MATCH_TYPES {
  LOWER = 'losers_matches',
  UPPER = 'winners_matches',
  Matches = 'matches',
}

export enum TOURNAMENT_UPDATE_TYPE {
  BRACKET_TOURNAMENT_UPDATE = 'bracket-tournament-update',
  PARTICIPANT_TOURNAMENT_UPDATE = 'PARTICIPANT-tournament-update',
  PUBLISH_TOURNAMENT_UPDATE = 'PUBLISH-tournament-update',
  REMOVE_SECOND_STAGE = 'remove-second-stage',

}

export enum STAGES_MATCHES_TYPES {
  FIRST_STAGE_MATCHES = 'firstStageMatches',
  SECOND_STAGE_MATCHES = 'secondStageMatches',
}

export enum STAGES_TYPES {
  GROUPS = 'groups',
  ROUNDS = 'rounds',
}
