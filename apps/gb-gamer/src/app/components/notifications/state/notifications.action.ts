
export class GetNotifications {
  static readonly type = '[Notifications] Get';
  constructor(public page?:number) {
  }
}
export class GetNotificationsRequest {
  static readonly type = '[NotificationsRequests] Get';
  constructor(public page?:number) {
  }
}
export class AcceptNotificationRequest {
  static readonly type = '[AcceptNotifciation]';
  constructor(public id?:number , public requiredInputs?:any  , public requiredAccounts?:any) {
  }
}
export class DeclineNotificationRequest {
  static readonly type = '[DeclineNotifciation]';
  constructor(public id?:number) {
  }
}
export class GetUnReadNotificationsCount {
  static readonly type = '[UnReadNotificationsCount] Get';
  constructor() {
  }
}
export class GetUnReadRequestsCount {
  static readonly type = '[UnReadRequestsCount] Get';
  constructor() {
  }
}
export class ReadNotification {
  static readonly type = '[ReadNotification]';
  constructor(public id?:number) {
  }
}
export class ReadAllNotification {
  static readonly type = '[ReadAllNotification]';
  constructor() {
  }
}
export class AddSocketNotification {
  static readonly type = '[AddSocketNotification]';
  constructor(public payload:any) {
  }
}
