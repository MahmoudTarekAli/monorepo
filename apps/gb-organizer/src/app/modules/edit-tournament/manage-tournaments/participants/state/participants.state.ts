import {Action, Actions, ofActionCompleted, Selector, State, StateContext, Store} from '@ngxs/store'
import {Injectable} from '@angular/core'
import {Router, ActivatedRoute} from '@angular/router'
import {tap} from 'rxjs/operators'
import {ParticipantsService} from '../services/participants.service'
import {
  AcceptParticipantSocket,
  CheckInAllParticipant, CheckInParticipantSocket,
  ConfirmAllParticipant,
  DisqualifyAllParticipants, DisqualifyParticipantSocket, GetCheckedInParticipants,
  GetConfirmedParticipants, GetKickedParticipants,
  GetPendingParticipants, JoinParticipantToConfirmedSocket, JoinParticipantToPendingSocket, KickAllParticipants, KickParticipantSocket, RestoreParticipants, RestoreParticipantSocket, SelectAllParticipants, SendMessage, UnJoinParticipantSocket
} from './participants.action'
import {HandleError, SetNotifications} from '../../../../../shared/state/global.action'
import {ManageTournamentService} from "../../services/manage-tournament.service";

export class ParticipantsStateModel {
  confirmedParticipants: any
  pendingParticipants: any
  kickedParticipants: any
  checkedInParticipants: any
  allParticipants: any

}

@State<any>({
  name: 'participants',
  defaults: {
    confirmedParticipants: {},
    pendingParticipants: {},
    kickedParticipants: {},
    allParticipants: [],
    checkedInParticipants: {},

  },
})

@Injectable()
export class ParticipantsState {
  constructor(private participantsService: ParticipantsService, private router: Router, private store: Store, private route: ActivatedRoute,
              private manageTournamentService: ManageTournamentService, private actions$: Actions) {
  }

  @Selector()
  static getConfirmedParticipants(state: ParticipantsStateModel) {
    return state.confirmedParticipants
  }
  @Selector()
  static getCheckedInParticipants(state: ParticipantsStateModel) {
    return state.checkedInParticipants
  }

  @Selector()
  static getPendingParticipants(state: ParticipantsStateModel) {
    return state.pendingParticipants
  }
  @Selector()
  static getKickedParticipants(state: ParticipantsStateModel) {
    return state.kickedParticipants
  }

  @Selector()
  static getAllParticipants(state: ParticipantsStateModel) {
    return state.allParticipants
  }

  @Action(GetConfirmedParticipants)
  getConfirmedParticipants({
                             getState,
                             setState,
                           }: StateContext<ParticipantsStateModel>, payload: GetConfirmedParticipants) {
    console.log(payload.country, ' country')
    return this.participantsService.getConfirmedParticipants(payload.payload, payload.page, payload.search, payload.country === 'Global' ? '' : payload.country, payload.checkedIn, payload.isCompleted, payload.selectedTag).pipe(tap(result => {
      const state = getState()
      console.log(result)
      console.log(state)
      setState({
        ...state,
        confirmedParticipants: result,
      })

    }))
  }
  @Action(GetCheckedInParticipants)
  getCheckedInParticipants({getState, setState}: StateContext<ParticipantsStateModel>, payload: GetCheckedInParticipants) {
    return this.participantsService.getConfirmedParticipants(payload.payload, payload.page, payload.search, payload.country === 'Global' ? '' : payload.country, true, payload.isCompleted).pipe(tap(result => {
      const state = getState()

      console.log(state)
      setState({
        ...state,
        checkedInParticipants: result,
      })

    }))
  }

  @Action(GetPendingParticipants)
  getPendingParticipants({
                           getState,
                           setState,
                         }: StateContext<ParticipantsStateModel>, payload: GetPendingParticipants) {
    console.log(payload, getState())

    return this.participantsService.getPendingParticipants(payload.payload, payload.page, payload.search, payload.country === 'Global' ? '' : payload.country, payload.checkedIn, payload.isCompleted, payload.selectedTag).pipe(tap(result => {
        const state = getState()
        setState({
          ...state,
          pendingParticipants: result,
        })
      }
    ))
  }
  @Action(GetKickedParticipants)
  getKickedParticipants({getState, setState}: StateContext<ParticipantsStateModel>, payload: GetKickedParticipants) {
    console.log(payload, getState())

    return this.participantsService.getKickedParticipants(payload.payload, payload.page, payload.search, payload.country === 'Global' ? '' : payload.country, payload.isCompleted).pipe(tap(result => {
        const state = getState()
        setState({
          ...state,
          kickedParticipants: result,
        })
      }
    ))
  }

  @Action(KickAllParticipants)
  kickAllParticipant({getState, setState}: StateContext<ParticipantsStateModel>, payload: KickAllParticipants) {
    const data = payload.payload.map(data => data?.original?.id)

    return this.participantsService.kickAllParticipants(payload.code, data , payload.isPrevent).pipe(tap(result => {
      const state = getState()
      console.log(state)
      const pendingParticipants = state.pendingParticipants.data.filter(item => !data.includes(item.original.id))
      state.pendingParticipants.data = pendingParticipants
      state.pendingParticipants.count = state.pendingParticipants.count - data.length
      if (payload.isPrevent){
        const kickedParticpants = state.kickedParticipants.data.concat(payload.payload)
        state.kickedParticipants.data = [...kickedParticpants]
        state.kickedParticipants.count = state.kickedParticipants.count + data.length
      }
      setState({
        ...state,
        kickedParticipants: state.kickedParticipants,
        pendingParticipants: state.pendingParticipants,
      })
      this.store.dispatch(new SetNotifications('Success', 'participant kicked successfully', 'success'))
      if (state.pendingParticipants.data.length === 0) {
        this.store.dispatch(new GetPendingParticipants(payload.code, 1))
      }
    }, error => {
      this.store.dispatch(new HandleError(error))
    }))
  }
  @Action(RestoreParticipants)
  restoreParticipant({getState, setState}: StateContext<ParticipantsStateModel>, payload: RestoreParticipants) {
    const data = payload.payload.map(data => data?.original?.id)
    return this.participantsService.restoreParticipants(payload.code, data ).pipe(tap(result => {
      const state = getState()
      console.log(state)
      const kickedParticipants = state.kickedParticipants.data.filter(item => !data.includes(item.original.id))
      state.kickedParticipants.data = kickedParticipants
      state.kickedParticipants.count = state.kickedParticipants.count - data.length
      if (payload.joinPrivacy === 'public'){
        console.log(payload.joinPrivacy)
        const confirmedParticipants = state.confirmedParticipants.data.concat(payload.payload)
        state.confirmedParticipants.data = [...confirmedParticipants]
        state.confirmedParticipants.count = state.confirmedParticipants.count + data.length
      } else {
        console.log('hereee')
        const pendingParticipants = state.pendingParticipants.data.concat(payload.payload)
        state.pendingParticipants.data = [...pendingParticipants]
        state.pendingParticipants.count = state.pendingParticipants.count + data.length
      }
      setState({
        ...state,
        kickedParticipants: state.kickedParticipants,
        pendingParticipants: state.pendingParticipants,
        confirmedParticipants: state.confirmedParticipants
      })
      this.store.dispatch(new SetNotifications('Success', 'participant restored successfully', 'success'))

    }, error => {
      this.store.dispatch(new HandleError(error))
    }))
  }

  @Action(CheckInAllParticipant)
  checkInParticipants({getState, setState}: StateContext<ParticipantsStateModel>, payload: CheckInAllParticipant) {
    const data = payload.payload.map(data => data?.original?.id)
    console.log(payload)
    return this.participantsService.checkInParticipant(payload.code, data, payload.status).pipe(tap(result => {
      const state = getState()
      console.log(state)
      if (payload.status === true) {
        this.store.dispatch(new SetNotifications('Success', 'participant checkedin successfully', 'success'))
      } else {
        this.store.dispatch(new SetNotifications('Success', 'participant unchecked successfully', 'success'))
      }
      console.log(payload.status)
      state.confirmedParticipants.data.filter(item => {
        if (data.includes(item.original.id)) {
          if (payload.status === true) {
            item.has_checked_in = true
          } else {
            item.has_checked_in = false

          }
        }
      })
      setState({
        ...state,
        confirmedParticipants: state.confirmedParticipants,
      })
    }, error => {
      this.store.dispatch(new HandleError(error))
    }))
  }

  @Action(DisqualifyAllParticipants)
  disqualifyAllParticipants({
                              getState,
                              setState,
                              // tslint:disable-next-line:align
                            }: StateContext<ParticipantsStateModel>, payload: DisqualifyAllParticipants) {
    console.log(payload.payload)
    const data = payload.payload.map(data => data?.original?.id)
    return this.participantsService.AcceptdisqualifyAllParticipants(payload.code, data, 0).pipe(tap(result => {
      const state = getState()
      // this.store.dispatch(new GetConfirmedParticipants(payload.code, 1))
      const pending = state.pendingParticipants.data.concat(payload.payload)
      // console.log(pending)
      state.pendingParticipants.data = [...pending]
      state.pendingParticipants.count = state.pendingParticipants.count + data.length
      state.confirmedParticipants.count = state.confirmedParticipants.count - data.length
      state.confirmedParticipants.data = state.confirmedParticipants.data.filter(item => !data.includes(item.original.id))
      state.confirmedParticipants.data = [...state.confirmedParticipants.data]

      setState({
        ...state,
        pendingParticipants: state.pendingParticipants,
        confirmedParticipants: state.confirmedParticipants,
      })
      this.participantsService.getFirstPageOfParticipants(GetConfirmedParticipants, payload.code, state.confirmedParticipants.data)
      this.store.dispatch(new SetNotifications('Success', 'participant disqualified successfully', 'success'))

    }, error => {
      this.store.dispatch(new HandleError(error))
    }))
  }

  @Action(ConfirmAllParticipant)
  confirmAllParticipant({
                          getState,
                          setState,
                          // tslint:disable-next-line:align
                        }: StateContext<ParticipantsStateModel>, payload: ConfirmAllParticipant) {
    const data = payload.payload.map(data => data?.original?.id)
    return this.participantsService.AcceptdisqualifyAllParticipants(payload.code, data, 1).pipe(tap(result => {
      const state = getState()
      // this.store.dispatch(new GetConfirmedParticipants(payload.code, 1))
      const pending = state.confirmedParticipants.data.concat(payload.payload)
      console.log(pending)
      // handle confirmed participants sate ( count and data) to add new confirmed participants to list and increase count
      state.confirmedParticipants.data = [...pending]
      state.confirmedParticipants.count = state.confirmedParticipants.count + data.length
      // handle pending participants sate ( count and data) to add new pending participants to list and increase count
      state.pendingParticipants.count = state.pendingParticipants.count - data.length
      state.pendingParticipants.data = state.pendingParticipants.data.filter(item => !data.includes(item.original.id))
      state.pendingParticipants.data = [...state.pendingParticipants.data]
      setState({
        ...state,
        pendingParticipants: state.pendingParticipants,
        confirmedParticipants: state.confirmedParticipants,
      })
      // handle if pending participants list is empty to get new page
      this.participantsService.getFirstPageOfParticipants(GetPendingParticipants, payload.code, state.pendingParticipants.data)
      this.store.dispatch(new SetNotifications('Success', 'participant Accepted successfully', 'success'))

    }, error => {
      this.store.dispatch(new HandleError(error))
    }))
  }

  @Action(SendMessage)
  sendMessage({getState, setState}: StateContext<ParticipantsStateModel>, payload: SendMessage) {
    return this.manageTournamentService.sendMessage(payload.code, payload.payload).pipe(tap(result => {
      console.log(result)
      const state = getState()
      this.store.dispatch(new SetNotifications('Success', 'message sent successfully', 'success'))
    }, error => {
      this.store.dispatch(new HandleError(error))
    }))
  }


  @Action(SelectAllParticipants)
  selectAll({getState, setState}: StateContext<ParticipantsStateModel>, payload: SelectAllParticipants) {
    return this.participantsService.selectAllParticipants(payload.code, payload.type , payload.search, payload.country === 'Global' ? '' : payload.country, payload.checkedIn, payload.isCompleted).pipe(tap(result => {
      const state = getState()
      setState({
        ...state,
        allParticipants: result,
      })
    }, error => {
      this.store.dispatch(new HandleError(error))
    }))
  }

  @Action(DisqualifyParticipantSocket)
  disqualifyParticipantSocket({getState, setState,
                                // tslint:disable-next-line:align
                              }: StateContext<ParticipantsStateModel>, payload: DisqualifyParticipantSocket) {
    console.log(payload.payload)
    const data = payload.payload.data.map(data => data?.participant_id)
    const state = getState()

    if (state.confirmedParticipants.data.some(item => data.includes(item.original.id))) {
      const pending = state.pendingParticipants.data.concat(payload.payload.data.map(item => ({...item, checked: false})))
      // console.log(pending)
      state.pendingParticipants.data = [...pending]
      state.pendingParticipants.count = state.pendingParticipants.count + data.length
      state.confirmedParticipants.count = state.confirmedParticipants.count - data.length
      state.confirmedParticipants.data = state.confirmedParticipants.data.filter(item => !data.includes(item.participant_id))
      state.confirmedParticipants.data = [...state.confirmedParticipants.data]
      setState({
        ...state,
        pendingParticipants: state.pendingParticipants,
        confirmedParticipants: state.confirmedParticipants,
      })
      this.participantsService.getFirstPageOfParticipants(GetConfirmedParticipants, payload.code, state.confirmedParticipants.data)

    }
  }

  @Action(AcceptParticipantSocket)
  acceptParticipantSocket({getState, setState}: StateContext<ParticipantsStateModel>, payload: AcceptParticipantSocket) {
    const data = payload.payload.data.map(data => data?.participant_id)
    const state = getState()
    // console.log(state.confirmedParticipants.data.some(item => item.participant_id === participantId))
    if (state.pendingParticipants.data.some(item => data.includes(item.original.id))) {
      const confirmedPartic = state.confirmedParticipants.data.concat(payload.payload.data.map(item => ({...item, checked: false})))
      state.confirmedParticipants.data = [...confirmedPartic]
      state.confirmedParticipants.count = state.confirmedParticipants.count + data.length
      state.pendingParticipants.count = state.pendingParticipants.count - data.length
      state.pendingParticipants.data = state.pendingParticipants.data.filter(item => !data.includes(item.participant_id))
      state.pendingParticipants.data = [...state.pendingParticipants.data]

      setState({
        ...state,
        pendingParticipants: state.pendingParticipants,
        confirmedParticipants: state.confirmedParticipants,
      })
      this.participantsService.getFirstPageOfParticipants(GetPendingParticipants, payload.code, state.pendingParticipants.data)

    }
  }
  @Action(KickParticipantSocket)
  kickParticipantSocket({getState, setState}: StateContext<ParticipantsStateModel>, payload: KickParticipantSocket) {
    const data = payload.payload.data.map(data => data?.participant_id)
    const state = getState()
    // console.log(state.confirmedParticipants.data.some(item => item.participant_id === participantId))
    if (state.pendingParticipants.data.some(item => data.includes(item.original.id))) {
      state.pendingParticipants.count = state.pendingParticipants.count - data.length
      state.pendingParticipants.data = state.pendingParticipants.data.filter(item => !data.includes(item.participant_id))
      state.pendingParticipants.data = [...state.pendingParticipants.data]
      this.participantsService.getFirstPageOfParticipants(GetPendingParticipants, payload.code, state.pendingParticipants.data)
      console.log(payload.isPrevent)
      if (payload.isPrevent){
        const kickedParticpants = state.kickedParticipants.data.concat(payload.payload)
        state.kickedParticipants.data = [...kickedParticpants]
        state.kickedParticipants.count = state.kickedParticipants.count + data.length
      }
      setState({
        ...state,
        pendingParticipants: state.pendingParticipants,
      })
    }
  }
  @Action(JoinParticipantToConfirmedSocket)
  joinParticipantToConfirmedSocket({getState, setState}: StateContext<ParticipantsStateModel>, payload: JoinParticipantToConfirmedSocket) {
    const participant = {...payload.payload, checked: false}
    const state = getState()
    const confirmedPartici = state.confirmedParticipants.data.concat([participant])
    // console.log(pending)
    state.confirmedParticipants.data = [...confirmedPartici]
    state.confirmedParticipants.count = state.confirmedParticipants.count + 1
    this.participantsService.getFirstPageOfParticipants(GetPendingParticipants, payload.code, state.confirmedParticipants.data)
    setState({
        ...state,
        confirmedParticipants: state.confirmedParticipants,
      })
  }
  @Action(JoinParticipantToPendingSocket)
  joinParticipantToPendingSocket({getState, setState}: StateContext<ParticipantsStateModel>, payload: JoinParticipantToPendingSocket) {
    const participant = {...payload.payload, checked: false}
    const state = getState()
    const confirmedPartici = state.pendingParticipants.data.concat([participant])
    // console.log(pending)
    state.pendingParticipants.data = [...confirmedPartici]
    state.pendingParticipants.count = state.pendingParticipants.count + 1
    this.participantsService.getFirstPageOfParticipants(GetPendingParticipants, payload.code, state.pendingParticipants.data)
    setState({
        ...state,
        confirmedParticipants: state.confirmedParticipants,
      })
  }
  @Action(UnJoinParticipantSocket)
  unJoinParticipantSocket({getState, setState}: StateContext<ParticipantsStateModel>, payload: UnJoinParticipantSocket) {
    console.log(payload.payload)
    const participantId = payload.payload
    const state = getState()
    // console.log(state.confirmedParticipants.data.some(item => item.participant_id === participantId))
    if (state.pendingParticipants.data.some(item => item.participant_id === participantId)) {
      state.pendingParticipants.count = state.pendingParticipants.count - 1
      state.pendingParticipants.data = state.pendingParticipants.data.filter(item => item.participant_id !== participantId)
      state.pendingParticipants.data = [...state.pendingParticipants.data]
    } else {
      state.confirmedParticipants.count = state.confirmedParticipants.count - 1
      state.confirmedParticipants.data = state.confirmedParticipants.data.filter(item => item.participant_id !== participantId)
      state.confirmedParticipants.data = [...state.confirmedParticipants.data]
    }
    this.participantsService.getFirstPageOfParticipants(GetPendingParticipants, payload.code, state.pendingParticipants.data)
    setState({
      ...state,
      pendingParticipants: state.pendingParticipants,
      confirmedParticipants: state.confirmedParticipants,
    })
  }
  @Action(RestoreParticipantSocket)
  restoreParticipantSocket({getState, setState}: StateContext<ParticipantsStateModel>, payload: RestoreParticipantSocket) {
    const data = payload.payload.data.map(data => data?.participant_id)
    const state = getState()
    // console.log(state.confirmedParticipants.data.some(item => item.participant_id === participantId))
    if (state.kickedParticipants.data.some(item => data.includes(item.original.id))) {
      state.kickedParticipants.count = state.kickedParticipants.count - data.length
      state.kickedParticipants.data = state.kickedParticipants.data.filter(item => !data.includes(item.participant_id))
      state.kickedParticipants.data = [...state.kickedParticipants.data]
      if (payload.joinPrivacy === 'public'){
        const confirmedParticipants = state.confirmedParticipants.data.concat(payload.payload)
        state.confirmedParticipants.data = [...confirmedParticipants]
        state.confirmedParticipants.count = state.confirmedParticipants.count + data.length
      } else {
        const pendingParticipants = state.pendingParticipants.data.concat(payload.payload)
        state.pendingParticipants.data = [...pendingParticipants]
        state.pendingParticipants.count = state.pendingParticipants.count + data.length
      }
      this.participantsService.getFirstPageOfParticipants(GetPendingParticipants, payload.code, state.pendingParticipants.data)
      setState({
        ...state,
        kickedParticipants: state.pendingParticipants,
        confirmedParticipants: state.confirmedParticipants,
        pendingParticipants: state.pendingParticipants,
      })
    }
  }
  // @Action(CheckInParticipantSocket)
  // checkInParticipantSocket({
  //                               getState,
  //                               setState,
  //                               // tslint:disable-next-line:align
  //                             }: StateContext<ParticipantsStateModel>, payload: DisqualifyAllParticipants) {
  //   const participantId = payload.payload
  //   const state = getState()
  //   // console.log(state.confirmedParticipants.data.some(item => item.participant_id === participantId))
  //   state.confirmedParticipants.data.filter(item => {
  //     if (item.participant_id === participantId) {
  //       if (payload.status === true) {
  //         item.has_checked_in = true
  //       } else {
  //         item.has_checked_in = false
  //
  //       }
  //     }
  //   })
  //   setState({
  //     ...state,
  //     confirmedParticipants: state.confirmedParticipants,
  //   })
  // }

}


