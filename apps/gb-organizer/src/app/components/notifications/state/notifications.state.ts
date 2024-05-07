import {State, Action, StateContext, Selector, Store} from '@ngxs/store';
import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {
  AcceptNotificationRequest, AddSocketNotification,
  DeclineNotificationRequest,
  GetNotifications,
  GetNotificationsRequest, GetUnReadNotificationsCount, GetUnReadRequestsCount, ReadAllNotification, ReadNotification
} from "./notifications.action";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {NotificationsService} from "../service/notifications.service";
import {HandleError, SetNotifications} from "../../../shared/state/global.action";
import {GlobalService} from "../../../shared/services/global.service";

export class NotificationsStateModel {
  notifications: any;
  requests: any;
  unReadRequestsCount: number;
  unReadNotificationsCount: number;
}

@State<NotificationsStateModel>({
  name: 'notification_state',
  defaults: {
    notifications: {data: [], meta_data: null},
    requests: [],
    unReadRequestsCount: 0,
    unReadNotificationsCount: 0

  }
})

@Injectable()
export class NotificationsState {

  constructor(private nzNotificationService: NzNotificationService, private notificationsService: NotificationsService,
              private globalService: GlobalService, private store: Store) {
  }

  @Selector()
  static getNotifications(state: NotificationsStateModel) {
    return state.notifications;
  }

  @Selector()
  static getRequests(state: NotificationsStateModel) {
    return state.requests;
  }

  @Selector()
  static getUnreadNotificationsCount(state: NotificationsStateModel) {
    return state.unReadNotificationsCount;
  }

  @Selector()
  static getUnreadRequestsCount(state: NotificationsStateModel) {
    return state.unReadRequestsCount;
  }


  @Action(GetNotifications)
  getNotifications({getState, setState}: StateContext<NotificationsStateModel>, payload: any) {
    const state = getState()
    // && state.notifications.meta_data?.page === payload.page
    if (state.notifications?.data?.length > 0 && payload.page === 1) {
      return true;
    }
    return this.notificationsService.getNotifications(payload.page).pipe(tap((result: any) => {
      if (payload.page > 1) {
        state.notifications.data = state.notifications.data.concat(result.data)
        state.notifications.meta_data = result.meta_data
      }else{
        state.notifications = result
      }
      return setState({
        ...getState(),
        notifications: state.notifications,
      });
    }));
  }

  @Action(GetNotificationsRequest)
  getRequests({getState, setState}: StateContext<NotificationsStateModel>, payload: any) {
    const state = getState()
    if (state.requests?.length > 0 && payload?.page === 1) {
      return true
    }
    return this.globalService.getSpecificRequest('notifications', payload.page).pipe(tap((result: any) => {
      return setState({
        ...getState(),
        requests: result,
      });
    }));
  }

  @Action(GetUnReadRequestsCount)
  getUnReadRequestsCount({getState, setState}: StateContext<NotificationsStateModel>, payload: any) {
    const state = getState()
    if (state.unReadRequestsCount !== 0) {
      return true;

    }
    return this.notificationsService.getUnreadRequestsCount().pipe(tap((result: any) => {
      return setState({
        ...getState(),
        unReadRequestsCount: result.requests_count,
      });
    }));
  }

  @Action(GetUnReadNotificationsCount)
  getUnReadNotificationsCount({getState, setState}: StateContext<NotificationsStateModel>) {
    const state = getState()
    if (state.unReadRequestsCount !== 0) {
      return true;
    }
    return this.notificationsService.getCountUnreadNotifications().pipe(tap((result: any) => {
      return setState({
        ...getState(),
        unReadNotificationsCount: result.count,
      });
    }));
  }

  @Action(ReadNotification)
  readNotification({getState, setState}: StateContext<NotificationsStateModel>, payload: any) {
    const state = getState()
    return this.notificationsService.readNotification(payload.id).pipe(tap((res) => {
      state.notifications.data = state.notifications.data.map((item: any) => {
        if (item.id === payload.id) {
          item.is_read = true
        }
        return item
      })
      state.unReadNotificationsCount = state.unReadNotificationsCount - 1
      return setState({
        ...getState(),
        notifications: state.notifications,
        unReadNotificationsCount: state.unReadNotificationsCount
      });
    }, error => {
      this.store.dispatch(new HandleError(error))

    }));
  }

  @Action(ReadAllNotification)
  readAllNotification({getState, setState}: StateContext<NotificationsStateModel>, payload: any) {
    const state = getState()
    return this.notificationsService.readAllNotification().pipe(tap((res) => {
      this.store.dispatch(new SetNotifications('Success', res?.message, 'success'))
      state.notifications.data = state.notifications.data.map((item: any) => {
        item.is_read = true
        return item
      })
      state.unReadNotificationsCount = 0
      return setState({
        ...getState(),
        notifications: state.notifications,
        unReadNotificationsCount: state.unReadNotificationsCount

      });
    }, error => {
      this.store.dispatch(new HandleError(error))

    }));
  }

  @Action(AcceptNotificationRequest)
  acceptNotificationRequest({getState, setState}: StateContext<NotificationsStateModel>, payload: any) {
    const state = getState()
    return this.globalService.updateRequest(payload.id , payload.requiredInputs , payload.requiredAccounts).pipe(tap((res:any) => {
      this.store.dispatch(new SetNotifications('Success', res?.message, 'success'))
      state.requests = state.requests?.filter((item: any) => item.id !== payload.id)
      state.unReadRequestsCount = state.unReadRequestsCount - 1

      setState({
        ...getState(),
        requests: state.requests,
        unReadRequestsCount: state.unReadRequestsCount
      })

    }, error => {
      this.store.dispatch(new HandleError(error))

    }));
  }

  @Action(DeclineNotificationRequest)
  declineNotificationRequest({getState, setState}: StateContext<NotificationsStateModel>, payload: any) {
    const state = getState()
    return this.globalService.cancelRequest(payload.id).pipe(tap((res:any) => {
      this.store.dispatch(new SetNotifications('Success', res?.message, 'success'))
      state.requests = state.requests?.filter((item: any) => item.id !== payload.id)
      state.unReadRequestsCount = state.unReadRequestsCount - 1
      setState({
        ...getState(),
        requests: state.requests,
        unReadRequestsCount: state.unReadRequestsCount
      })

    }, error => {
      this.store.dispatch(new HandleError(error))

    }));
  }
  @Action(AddSocketNotification)
  addSocketNotification({getState, setState}: StateContext<NotificationsStateModel>, payload: any) {
    const state = getState()
      // && state.notifications.meta_data.page === 1
    if(state.notifications.data.length > 0){
      const arrayNotifications = state.notifications.data
      console.log(payload.payload)
      arrayNotifications.unshift(payload.payload.data)
      state.notifications.data = [...arrayNotifications]
      // console.log(state.notifications)
    }
    state.unReadNotificationsCount = payload.payload.countUnread
    setState({
        ...getState(),
        notifications: state.notifications,
        unReadRequestsCount: state.unReadRequestsCount

      });
  }

}

