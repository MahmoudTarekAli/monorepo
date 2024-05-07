export class GetConfirmedParticipants {
  static readonly type = '[GetConfirmedParticipants] ConfirmedParticipants';

  constructor(public payload: any, public page?: any, public search?: any, public country?: any, public checkedIn?: any, public isCompleted?: any, public selectedTag?: string) {
  }
}

export class GetPendingParticipants {
  static readonly type = '[GetParticipants] PendingParticipants';

  constructor(public payload: any, public page?: any, public search?: any, public country?: any, public checkedIn?: any, public isCompleted?: any, public selectedTag?: string) {
  }
}

export class GetKickedParticipants {
  static readonly type = '[GetParticipants] KickedParticipants';

  constructor(public payload: any, public page?: any, public search?: any, public country?: any, public isCompleted?: any) {
  }
}

export class GetCheckedInParticipants {
  static readonly type = '[CheckedInParticipants] CheckedInParticipants';

  constructor(public payload: any, public page?: any, public search?: any, public country?: any, public isCompleted?: any) {
  }
}

// export class KickParticipants {
//   static readonly type = '[KickParticipants] KickParticipants';
//
//   constructor(public payload: any, public id: any) {
//   }
// }
// export class DisqualifyParticipant {
//   static readonly type = '[DisqualifyParticipant] DisqualifyParticipant';
//
//   constructor(public code: any, public payload: any) {
//   }
// }
export class KickAllParticipants {
  static readonly type = '[KickAllParticipants] KickAllParticipants';

  constructor(public code: any, public payload: any, public isPrevent?: boolean) {
  }
}

export class SelectAllParticipants {
  static readonly type = '[SelectAllParticipants] SelectAllParticipants';

  constructor(public code: any, public type: any, public search?: any, public country?: any, public checkedIn?: any, public isCompleted?: any) {
  }
}

export class DisqualifyAllParticipants {
  static readonly type = '[DisqualifyAllParticipants] DisqualifyAllParticipants';

  constructor(public code: any, public payload: any) {
  }

}

export class CheckInAllParticipant {
  static readonly type = '[CheckInAllParticipant] CheckInAllParticipant';

  constructor(public code: any, public payload: any, public status: any) {
  }
}

export class ConfirmAllParticipant {
  static readonly type = '[ConfirmAllParticipant] ConfirmAllParticipant';

  constructor(public code: any, public payload: any) {
  }
}

export class SendMessage {
  static readonly type = '[SendMessage] SendMessage';

  constructor(public code: any, public payload: any) {
  }
}

export class DisqualifyParticipantSocket {
  static readonly type = '[DisqualifyParticipantSocket] DisqualifyParticipantSocket';

  constructor(public code: any, public payload: any) {
  }
}

export class AcceptParticipantSocket {
  static readonly type = '[AcceptParticipantSocket] AcceptParticipantSocket';

  constructor(public code: any, public payload: any) {
  }
}

export class KickParticipantSocket {
  static readonly type = '[KickParticipantSocket] KickParticipantSocket';

  constructor(public code: any, public payload: any, public isPrevent: any) {
  }
}

export class UnJoinParticipantSocket {
  static readonly type = '[UnJoinParticipantSocket] UnJoinParticipantSocket';

  constructor(public code: any, public payload: any) {
  }
}

export class JoinParticipantToConfirmedSocket {
  static readonly type = '[JoinParticipantToConfirmedSocket] JoinParticipantToConfirmedSocket';

  constructor(public code: any, public payload: any) {
  }
}

export class JoinParticipantToPendingSocket {
  static readonly type = '[JoinParticipantToPendingSocket] JoinParticipantToPendingSocket';

  constructor(public code: any, public payload: any) {
  }
}

export class CheckInParticipantSocket {
  static readonly type = '[CheckInParticipantSocket] CheckInParticipantSocket';

  constructor(public code: any, public payload: any) {
  }
}

export class RestoreParticipants {
  static readonly type = '[RestoreParticipants] RestoreParticipants';

  constructor(public code: any, public payload: any, public joinPrivacy: any) {
  }
}

export class RestoreParticipantSocket {
  static readonly type = '[RestoreParticipantSocket] RestoreParticipantSocket';

  constructor(public code: any, public payload: any, public joinPrivacy: any) {
  }
}

// export class ConfirmParticipant {
//   static readonly type = '[ConfirmParticipant] ConfirmParticipant';
//
//   constructor(public payload: any, public id: any) {
//   }
// }
