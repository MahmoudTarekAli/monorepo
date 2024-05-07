export enum TimelineStatus {
  COMPLETED,
  INACTIVE,
}

export enum TimeLineKeys {
  JOINED,
  COMPLETE_TEAM,
  APPROVED,
  CHECK_IN,
  TOURNAMENT_STARTS,
  FINISHED
}

export interface Timeline {
  key: TimeLineKeys
  status: TimelineStatus;
  title: string;
  subTitle: string;
  show: boolean
}
