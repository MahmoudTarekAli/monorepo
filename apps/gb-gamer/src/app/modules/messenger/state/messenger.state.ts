import {State, Action, StateContext, Selector, createSelector, Store} from '@ngxs/store'
import {
    CloseChatBox,
    OpenChatBox, ReOrderChatBoxList, SetActiveChat, SetMessagesList, SetMessengerCount,
} from './messenger.action'
import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router'
import {MessengerService} from "../service/messenger.service";
import {Chat, chatbox} from "../modal/messenger";
import {User} from "../../authentication/models/user";

export class HomeStateModel {
    chatboxes: chatbox[];
    chat: Chat[];
    activeChat: Chat | undefined;
    messengerCount: number
}

@State<HomeStateModel>({
    name: 'chat',
    defaults: {
        chatboxes: [],
        chat: [],
        activeChat: undefined,
        messengerCount: 0
    }
})

@Injectable()
export class MessengerState {

    constructor(private homeService: MessengerService, private router: Router, private store: Store, private activatedRoute: ActivatedRoute) {
    }

    @Selector()
    static getChatList(state: HomeStateModel) {
        return state.chatboxes;
    }

    @Selector()
    static getMessages(state: HomeStateModel) {
        return state.chat;
    }

    @Selector()
    static getActiveChat(state: HomeStateModel) {
        return state.activeChat;
    }

    @Selector()
    static getMessengerCount(state: HomeStateModel) {
        return state.messengerCount;
    }

    @Action(OpenChatBox)
    openChatBox({getState, setState, patchState}: StateContext<HomeStateModel>, payload: OpenChatBox) {
        const state = getState()
        let chatboxes = state.chatboxes
        let showTrueCounter = 0;
        chatboxes.forEach((item, index) => {
            if (item.show && index < 2) {
                showTrueCounter++;
            } else {
                item.show = false;
            }
        });
        chatboxes = [payload.chat, ...state.chatboxes]
        setState({
            ...getState(),
            chatboxes: chatboxes
        });

    }

    @Action(CloseChatBox)
    closeChatBox({getState, setState, patchState}: StateContext<HomeStateModel>, payload: CloseChatBox) {
        const state = getState()
        const chatboxes = state.chatboxes.filter(chat => {
            return chat.chat.id !== payload.chat
        })
        if (chatboxes.length > 2) {
            chatboxes[2].show = true;
        } else {
            chatboxes.forEach(chat => chat.show = true);
        }
        setState({
            ...getState(),
            chatboxes: chatboxes
        });
    }

    @Action(ReOrderChatBoxList)
    reOrderChatBoxList({getState, setState, patchState}: StateContext<HomeStateModel>, payload: ReOrderChatBoxList
    ) {
        const state = getState()
        setState({
            ...getState(),
            chatboxes: payload.list
        });
    }

  @Action(SetMessagesList)
  SetMessagesList({getState, setState, patchState}: StateContext<HomeStateModel>, payload: SetMessagesList) {
    const state = getState()
    let conversations = [...state.chat, payload.list]
    conversations = conversations.sort((a: any, b: any) => {
        // if (a.type && b.type === 'private') {
            a.updated_at = a.last_message?.created_at?.seconds ? a.last_message?.created_at?.seconds : a.last_message?.created_at
            b.updated_at = b.last_message?.created_at?.seconds ? b.last_message?.created_at?.seconds : b.last_message?.created_at
        // }
       return  b.updated_at  - a.updated_at
    })
    // return conversations unique
    conversations = conversations.filter((conversation, index, self) => {
        return index === self.findIndex((t) => (
            t.id === conversation.id
        ))
    })
    setState({
      ...getState(),
      chat: conversations
    });
  }


    @Action(SetActiveChat)
    setActiveChat({getState, setState, patchState}: StateContext<HomeStateModel>, payload: SetActiveChat) {
        setState({
            ...getState(),
            activeChat: payload.chat
        });
    }


    @Action(SetMessengerCount)
    setMessengerCount({getState, setState, patchState}: StateContext<HomeStateModel>, payload: SetMessengerCount) {
        setState({
            ...getState(),
            messengerCount: payload.count
        });
    }
}




