import {User} from "../models/user";


export class SetUser {
  static readonly type = '[Auth] User';
  constructor() {}
}
export class UserCompleted {
  static readonly type = '[Auth] User Completed';
  constructor() {}
}
export class LogOut {
  static readonly type = '[Auth] logout';
  constructor(public payload: boolean) {}
}

export class UpdateUser {
  static readonly type = '[User] Update User';
  constructor(public payload: User) {}
}
