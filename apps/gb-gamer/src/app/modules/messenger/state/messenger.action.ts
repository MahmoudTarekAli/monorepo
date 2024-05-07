import {User} from "../../authentication/models/user";
import {Chat, chatbox} from "../modal/messenger";

export class OpenChatBox {
  static readonly type = '[openChatBox] Open';

  constructor(public chat: chatbox) {
  }
}

export class CloseChatBox {
  static readonly type = '[closeChatBox] Close';

  constructor(public chat: string) {
  }
}

export class ReOrderChatBoxList {
  static readonly type = '[ReOrderChatBoxList] reOrder';

  constructor(public list: chatbox[]) {
  }
}

export class SetMessagesList {
  static readonly type = '[MessagesList] Set';

  constructor(public list: any) {
  }
}

export class GetChatMessages {
  static readonly type = '[ChatMessages] Get';

  constructor(public list: any) {
  }
}


export class SetActiveChat {
  static readonly type = '[SetActiveChat] Set';

  constructor(public chat: Chat | undefined) {
  }
}

export class SendMessage {
  static readonly type = '[SendMessage] Set';

  constructor(public chat: Chat | undefined) {
  }
}


export class SetMessengerCount {
  static readonly type = '[MessengerCount] Set';

  constructor(public count: number) {
  }
}
