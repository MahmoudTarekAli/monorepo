import {State, Action, StateContext, Selector, createSelector, Store} from '@ngxs/store'
import {
  CreateEvent, GetArenas,
  GetEvent, GetEventArenas, GetEventChallenge, GetEventPlayables, GetEventTournaments, UpdateEvent
} from './event.action'
import {tap} from 'rxjs/operators';
import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from '@angular/router'
import {Tournament} from "../../../shared/models/tournament";
import {Game} from "../../../shared/models/game";
import {GlobalService} from "../../../shared/service/global.service";
import {EventsService} from "../service/events.service";
import {Challenge} from "../../../shared/models/challenge";
import {HandleError, SetNotifications} from "../../../shared/state/global.action";

export class EventStateModel {
  event: {};
  games: Game[];
  tournaments: Tournament[];
  challenges: any;
  playables: any;
  eventArenas: any
  events: [];
  arenas: [];

}

@State<EventStateModel>({
  name: 'events',
  defaults: {
    event: {},
    tournaments: [],
    games: [],
    challenges: [],
    playables: null,
    eventArenas: null,
    arenas: [],
    events: []
  }
})

@Injectable()
export class EventState {

  constructor(private eventsService: EventsService, private router: Router, private store: Store, private globalService: GlobalService, private activatedRoute: ActivatedRoute) {
  }

  @Selector()
  static getEvent(state: EventStateModel) {
    return state.event;
  }

  @Selector()
  static getEventTournamentsOrChallenges(state: EventStateModel) {
    return state.tournaments;
  }

  @Selector()
  static getEventChallenges(state: EventStateModel) {
    return state.challenges;
  }

  @Selector()
  static getEventPlayables(state: EventStateModel) {
    return state.playables;
  }

  @Selector()
  static getEventArenas(state: EventStateModel) {
    return state.eventArenas;
  }
  @Selector()
  static getMyArenas(state: EventStateModel) {
    return state.arenas;
  }

  @Action(GetEvent)
  getEvent({getState, setState}: StateContext<EventStateModel>, payload: any) {
    return this.eventsService.getEvent(payload.code).pipe(tap((result) => {
      setState({
        ...getState(),
        event: result,
      });
    }));
  }


  @Action(GetEventTournaments)
  getEventTournaments({getState, setState}: StateContext<EventStateModel>, payload: any) {
    return this.eventsService.getEventTournaments(payload.code, payload.type, payload.gameCode, payload.page).pipe(tap((result) => {
      setState({
        ...getState(),
        tournaments: result,
      });
    }));
  }

  @Action(GetEventChallenge)
  getEventChallenges({getState, setState}: StateContext<EventStateModel>, payload: any) {
    return this.eventsService.getEventChallenges(payload.code , payload.game).pipe(tap((result:any) => {
      setState({
        ...getState(),
        challenges: result.data,
      });
    }));
  }

  @Action(GetEventPlayables)
  getEventPlayables({getState, setState}: StateContext<EventStateModel>, payload: any) {
    const state = getState();
    if (state.playables?.data.length > 0 && Number(state.playables?.page) === payload.page) {
      return;
    }
    return this.eventsService.getEventPlayables(payload.code, payload.page).pipe(tap((result) => {
      setState({
        ...getState(),
        playables: result,
      });
    }));
  }

  @Action(GetEventArenas)
  getEventsArenas({getState, setState}: StateContext<EventStateModel>, payload: any) {
    const state = getState();
    if (state.eventArenas?.data.length > 0 && Number(state.eventArenas?.meta?.current_page) === payload.page) {
      return;
    }
    return this.eventsService.getEventArenas(payload.code, payload.page).pipe(tap((result) => {
      setState({
        ...getState(),
        eventArenas: result,
      });
    }));
  }


  @Action(CreateEvent)
  createEvent({getState, setState}: StateContext<EventStateModel>, payload: CreateEvent) {
    const state = getState();
    return this.eventsService.createEvent(payload.event).pipe(tap((result: any) => {
      this.store.dispatch(new SetNotifications('Success', 'Event Added Successfully', 'success'))
      this.router.navigateByUrl(`/events/${result.data.slug}`)
      setState({
        ...getState(),
        // events: [...state.events.concat(result)],
      });
    }, error => {
      this.store.dispatch(new HandleError(error))

    }));
  }


  @Action(UpdateEvent)
  updateEvent({getState, setState}: StateContext<EventStateModel>, payload: UpdateEvent) {
    const state = getState();
    return this.eventsService.updateEvent(payload.event, payload.id).pipe(tap((result: any) => {
      this.store.dispatch(new SetNotifications('Success', 'Event Updated Successfully', 'success'))
      setState({
        ...getState(),
        event: result,
      });
    }, error => {
      this.store.dispatch(new HandleError(error))
    }));
  }

  @Action(GetArenas)
  getArenas({getState, setState}: StateContext<EventStateModel>) {

    return this.eventsService.getArenas().pipe(tap((result) => {
      const state = getState();
      console.log(result)
      setState({
        ...state,
        arenas: result,
      });
    }));
  }
}
