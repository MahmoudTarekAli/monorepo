import {AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core'
import {Data} from '@angular/router'
import {ParticipantsService} from './services/participants.service'
import {SharedService} from '../../service/shared.service'
import {Actions, ofAction, ofActionCompleted, ofActionDispatched, ofActionSuccessful, Select, Store} from '@ngxs/store'
import {TournamentProcessState} from '../../tournament-process/state/tournament-process.state'
import {fromEvent, Observable} from 'rxjs'
import {
  AcceptParticipantSocket,
  CheckInAllParticipant,
  ConfirmAllParticipant,
  DisqualifyAllParticipants, DisqualifyParticipantSocket, GetCheckedInParticipants,
  GetConfirmedParticipants, GetKickedParticipants,
  GetPendingParticipants, JoinParticipantToConfirmedSocket, JoinParticipantToPendingSocket,
  KickAllParticipants, KickParticipantSocket, RestoreParticipants, RestoreParticipantSocket,
  SelectAllParticipants,
  SendMessage, UnJoinParticipantSocket,
} from './state/participants.action'
import {ParticipantsState} from './state/participants.state'
import {ActionsExecuting, hasActionsExecuting} from '@ngxs-labs/actions-executing'
import {debounceTime, distinctUntilChanged, map, take} from 'rxjs/operators'
import {GlobalState} from '../../../../shared/state/global.state'
import {GetCountries, HandleError, SetNotifications} from '../../../../shared/state/global.action'
import {NzDrawerRef, NzDrawerService} from 'ng-zorro-antd/drawer'
import {NzModalService} from 'ng-zorro-antd/modal'
import {SendMessageComponent} from "../dialogs/send-message/send-message.component";
import {TeamViewComponent} from "../../../../shared/components/team-view/team-view.component";
import {SocketService} from "../../../../services/socket.service";
import * as io from 'socket.io-client';
import {AuthenticationState} from "../../../authentication/state/authentication.state";
import {
  ConfirmationDialogComponent
} from "../../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component";
import {TranslateService} from '@ngx-translate/core'
import {environment} from "../../../../../environments/environment";
import {StatusColor} from "../../../../core/match-status.enum";
import {UpdateTournament} from "../../tournament-process/state/tournament-process.action";
import {TournamentService} from "../../../tournaments/services/tournament.service";
import {TournamentProcessService} from "../../tournament-process/services/tournament-process.service";

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
})
export class ParticipantsComponent implements OnInit, AfterViewInit {
  checked = false
  buttonLoading = false
  loading = false
  indeterminate = false
  listOfData
  listOfCurrentPageData: readonly Data[] = []
  setOfCheckedId = []
  displayedColumns
  requiredInputsColumns = []
  currentPage = 1
  pendingLoad = false
  confirmedParticipants
  pendingParticipants
  // checkedInparticipants
  kickedParticipants
  confirmedPage = 1
  pendingPage = 1
  kickedPage = 1
  typeOfParticipant
  isChecked
  showDisplayedColumns
  tagsColors = [
    {
      color: 'Green',
      hex: '#06D6A0',
      indication: 'Success',
    },
    {
      color: 'Yellow',
      hex: '#FFD166',
      indication: 'Warning'
    },
    {
      color: 'Red',
      hex: '#F94144',
      indication: 'Danger'
    }
    , {
      color: 'Blue',
      hex: '#00A6FB',
      indication: 'Info'
    }
  ]
  selectedFilterTag: string
  selectedCountry = ''
  selectedTagColor: string
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>
  @Select(ParticipantsState.getConfirmedParticipants) getConfirmedParticipants: Observable<any>
  @Select(ParticipantsState.getPendingParticipants) getPendingParticipants: Observable<any>
  @Select(ParticipantsState.getKickedParticipants) getKickedPartipants: Observable<any>
  @Select(ParticipantsState.getAllParticipants) getAllParticipants: Observable<any>
// @Select(ParticipantsState.getCheckedInParticipants) getCheckedInParticipants: Observable<any>
  @Select(hasActionsExecuting([GetPendingParticipants])) getPendingParticipantsIsExecuting$: Observable<ActionsExecuting>
  @Select(hasActionsExecuting([GetKickedParticipants])) getKickedParticipantsIsExecuting$: Observable<ActionsExecuting>
  @Select(hasActionsExecuting([GetConfirmedParticipants])) getConfirmedParticipantsIsExecuting$: Observable<ActionsExecuting>
// @Select(hasActionsExecuting([GetCheckedInParticipants])) getCheckedInParticipantsIsExecuting$: Observable<ActionsExecuting>

  loadingAction = false
  @ViewChild('searchInput', {static: false}) search: ElementRef;
  @Select(GlobalState.getCountriesList) Countries: Observable<any>;
  displayedHeaderColumn;
  @ViewChild('drawerTemplate', {static: false}) drawerTemplate ?: TemplateRef<{
    $implicit: { value: string };
    drawerRef: NzDrawerRef<string>;
  }>;
  @ViewChild('drawerFooter', {static: true}) drawerFooter: TemplateRef<any>;
  @ViewChild('drawerTitle', {static: true}) drawerTitle: TemplateRef<any>;
  teamMember
  value = 'ng';
  visible = false;
  popoverVisible = false;
  teamMemberIndex
  teamMemberParticipants
  drawerRef
  isCheckedIn = false
  Socket = environment.Socket
  tournamentsNameSpace: any
  tournamentCode;
  radioButtonRemoveValue;
  @Select(AuthenticationState.getAuth) user: Observable<{}>
  participantDataObject;
  tournament;
  filterBadge = false;
  popoverFilterVisible = false;
  popoverColorVisible = false;
  popoverColorSelectionVisible = false
  isCountryValueChanged = false;
  isMobView;
  isInCompleteTeam: boolean;
  isPublished
  gbUrl = environment.gbUrl;

  constructor(private participantsService: ParticipantsService,
              private tournamentService: TournamentProcessService, private sharedService: SharedService, private store: Store, private actions$: Actions,
              private drawerService: NzDrawerService, private modalService: NzModalService, private viewContainerRef: ViewContainerRef, private translateService: TranslateService,
              private socketService: SocketService
  ) {
    // const participantsNameSpace = io.io(this.Socket + '/tournaments', {});
    this.tournamentsNameSpace = io.io(this.Socket + '/tournaments', {
      transports: ['polling'],
      reconnection: true,
      upgrade: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      timeout: 5000,
      autoConnect: true
    });
    this.store.select(state => state.setting).subscribe(data => {
      this.isMobView = data.setting.isMobileView
    })

    this.tournamentsNameSpace.emit('Join', this.sharedService.tournamentCode);

    this.socketService.listen(this.tournamentsNameSpace, this.sharedService.tournamentCode).subscribe((res: any) => {
      console.log(res)
      if (this.participantsService.isActionLoading === false) {
        if (res?.channel === "Disqualify") {
          // const participant = {original: {id: res?.participant_id}}
          this.store.dispatch(new DisqualifyParticipantSocket(this.sharedService.tournamentCode, res?.participants))
          // console.log(res)
        } else if (res?.channel === "Confirm") {
          this.store.dispatch(new AcceptParticipantSocket(this.sharedService.tournamentCode, res?.participants))
        } else if (res?.channel === "Kick") {
          this.store.dispatch(new KickParticipantSocket(this.sharedService.tournamentCode, res?.participants, res?.is_prevent))
        } else if (res?.channel === "UnJoin") {
          this.store.dispatch(new UnJoinParticipantSocket(this.sharedService.tournamentCode, res?.participant_id))
        } else if (res?.channel === "Join") {
          this.store.dispatch(new JoinParticipantToConfirmedSocket(this.sharedService.tournamentCode, res?.participant))
        } else if (res?.channel === "Pending") {
          this.store.dispatch(new JoinParticipantToPendingSocket(this.sharedService.tournamentCode, res?.participant))
        } else if (res?.channel === "Restore") {
          this.store.dispatch(new RestoreParticipantSocket(this.sharedService.tournamentCode, res?.participant, this.tournament.join_privacy))
        }
      }
    })

  }

  ngOnInit(): void {
    // this.tournamentsNameSpace.emit('Join', 'Qc0pNIcfIn1C');
    // this.tournamentsNameSpace.on('Qc0pNIcfIn1C', (msg) => {
    //   console.log(msg)
    // })
    this.loading = true
    this.store.dispatch(new GetCountries())
    this.typeOfParticipant = 'confirmed'
    this.getTournament.subscribe(tournament => {
      console.log(tournament)
      if (tournament?.code) {
        this.tournament = tournament
        this.tagsColors = this.tournament.participants_highlights
        this.tournamentCode = tournament.code
        this.isPublished = tournament.is_published
        this.loading = false

      }


      if (tournament?.participants_type === 'single') {
        this.displayedColumns = ['participant_name', 'country']
        if (tournament.connected_accounts_required) {
          this.displayedColumns.push('riot_account_id', 'rank')
        }
        if (tournament.supportedRequiredInputsKeys) {
          tournament.supportedRequiredInputsKeys.forEach(element => {
            this.requiredInputsColumns.push(element.placeholder)
            this.displayedColumns?.push(element.placeholder)

          })
        }

      } else if (tournament?.participants_type === 'teams') {
        this.displayedColumns = ['participant_name', 'players', 'country']
        if (tournament.connected_accounts_required) {
          this.displayedColumns.push('riot_account_id', 'rank')
        }
        if (tournament.supportedRequiredInputsKeys) {
          tournament.supportedRequiredInputsKeys.forEach(element => {
            console.log(element)
            this.requiredInputsColumns.push(element.placeholder)
            this.displayedColumns?.push(element.placeholder)

          })
          console.log(this.displayedColumns)
        }
        this.displayedColumns.push('last_updated_at')

      }
      if (tournament?.participants_type) {
        this.user.subscribe((res: any) => {
          console.log(res)
          if (res?.roles) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < res.roles.length; i++) {
              if (res.roles[i].name === 'SuperAdmin') {
                this.displayedColumns?.push('ip_conflict_country')
              }
            }
          }
        })
        const displayedColumnFilter = this.displayedColumns.filter((item) => item !== 'participant_name')
        this.showDisplayedColumns = displayedColumnFilter.map(column => ({
          label: this.translateService.instant(column),
          value: column,
          checked: true
        }));
      }

    })
    // this.pendingLoad = true;
    // this.loading = true;
    // this.actions$.pipe(ofActionSuccessful(GetConfirmedParticipants , GetPendingParticipants , GetKickedParticipants )).subscribe((res: any) => {
    //   this.loading = false
    // })

    this.getConfirmed(1)
    this.getPending(1)
    this.getKicked(1)
    // this.getCheckedIn(1)
  }

  ngAfterViewInit() {
    fromEvent(this.search?.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(500)

      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.search.nativeElement.value = text
      this.filterParticipants()

    });
  }

  getPending(page, search ?) {
    this.store.dispatch(new GetPendingParticipants(this.sharedService.tournamentCode, page, search, this.selectedCountry))
    this.getPendingParticipants.subscribe(res => {
      if (res?.count) {
        this.pendingParticipants = res
        this.pendingLoad = false
        this.selectAllParticipantPage(false, this.pendingParticipants.data)

      }
    })
  }

  getKicked(page, search ?) {
    this.store.dispatch(new GetKickedParticipants(this.sharedService.tournamentCode, page, search, this.selectedCountry))
    this.getKickedPartipants.subscribe(res => {
      if (res?.count) {
        this.kickedParticipants = res
        this.pendingLoad = false
        this.selectAllParticipantPage(false, this.kickedParticipants.data)

      }
    })
  }

  getConfirmed(page, search ?) {
    this.store.dispatch(new GetConfirmedParticipants(this.sharedService.tournamentCode, page, search, this.selectedCountry, this.isCheckedIn))
    this.getConfirmedParticipants.subscribe(res => {
      // console.log(res)
      if (res?.count) {
        this.confirmedParticipants = res
        console.log(this.listOfData)
        this.selectAllParticipantPage(false, this.confirmedParticipants.data)
      }
    })
  }

// getCheckedIn(page, search?) {
//   this.store.dispatch(new GetCheckedInParticipants(this.sharedService.tournamentCode, page, search, this.selectedCountry))
//   this.getCheckedInParticipants.subscribe(res => {
//     // console.log(res)
//     if (res?.count) {
//       this.checkedInparticipants = res
//       console.log(this.listOfData)
//       this.selectAllParticipantPage(false, this.checkedInparticipants.data)
//     }
//   })
// }

  tabsChange(event) {
    console.log(event)
    if (event === 0) {
      this.selectAllParticipantPage(false, this.pendingParticipants?.data)
      this.typeOfParticipant = 'confirmed'
      if (this.search.nativeElement.value !== '' || this.selectedCountry !== '') {
        this.search.nativeElement.value = ''
        this.selectedCountry = ''
        this.isCheckedIn = false
        this.getConfirmed(1, '')
      }
    } else if (event === 1) {
      this.selectAllParticipantPage(false, this.confirmedParticipants?.data)
      this.typeOfParticipant = 'pending'
      if (this.search.nativeElement.value !== '' || this.selectedCountry !== '') {
        this.search.nativeElement.value = ''
        this.selectedCountry = null
        this.isCheckedIn = false

        this.getPending(1, '')
      }
    } else {
      this.typeOfParticipant = 'kicked'
      if (this.search.nativeElement.value !== '' || this.selectedCountry !== '') {
        this.search.nativeElement.value = ''
        this.selectedCountry = null
        this.isCheckedIn = false
        this.getKicked(1, '')
      }

    }
  }


  changePage(page, type): void {
    if (type === 'confirmed'
    ) {
      this.confirmedPage = page
      this.store.dispatch(new GetConfirmedParticipants(this.sharedService.tournamentCode, this.confirmedPage))
    } else {
      this.pendingPage = page
      this.store.dispatch(new GetPendingParticipants(this.sharedService.tournamentCode, this.pendingPage))
    }
  }

  filterParticipants(page ?) {
    if (this.typeOfParticipant === 'pending') {
      this.pendingPage = page ? page : 1
      this.store.dispatch(new GetPendingParticipants(this.sharedService.tournamentCode, this.pendingPage, this.search.nativeElement.value, this.selectedCountry, this.isCheckedIn, this.isInCompleteTeam, this.selectedFilterTag))
    } else if (this.typeOfParticipant === 'confirmed') {
      this.confirmedPage = page ? page : 1
      this.store.dispatch(new GetConfirmedParticipants(this.sharedService.tournamentCode, page ? page : 1, this.search.nativeElement.value, this.selectedCountry, this.isCheckedIn, this.isInCompleteTeam, this.selectedFilterTag))
    } else {
      this.kickedPage = page ? page : 1
      this.store.dispatch(new GetKickedParticipants(this.sharedService.tournamentCode, page ? page : 1, this.search.nativeElement.value, this.selectedCountry, this.isInCompleteTeam))
    }
  }

  onItemChecked(checked
                  :
                  boolean, index, participants
  ):
    void {
    this.listOfCurrentPageData = participants
    this.listOfCurrentPageData[index].checked = checked
    this.isChecked = this.listOfCurrentPageData.some(data => data.checked)
    this.setOfCheckedId = this.listOfCurrentPageData.filter(data => data.checked === true)
    // this.setOfCheckedId = this.listOfCurrentPageData.filter(data => {
    //   if (data.checked === true){
    //     return data.checked = true
    //   } else {
    //     this.checked = false
    //     return data.checked = false
    //
    //   }
    // })
  }

  selectAll() {
    this.buttonLoading = true
    this.store.dispatch(new SelectAllParticipants(this.sharedService.tournamentCode, this.typeOfParticipant, this.search.nativeElement.value, this.selectedCountry, this.isCheckedIn, this.isInCompleteTeam))
    this.actions$.pipe(take(1), ofActionSuccessful(SelectAllParticipants)).subscribe(() => {
      this.getAllParticipants.pipe(take(1)).subscribe(res => {
        this.listOfCurrentPageData = res.data
        for (const participant of this?.listOfCurrentPageData) {
          participant.checked = true
          this.checked = true
        }
        this.setOfCheckedId = this.listOfCurrentPageData.filter(data => data.checked === true)
      })
      this.buttonLoading = false
    })


  }

  selectAllParticipantPage(checked, participants)
    :
    void {
    this.listOfCurrentPageData = participants || []
    // console.log(participants)
    for (const participant of this?.listOfCurrentPageData
      ) {
      participant.checked = checked
      participant.visible = false
      this.checked = checked
    }
// console.log(this.listOfCurrentPageData)
    this.isChecked = this.listOfCurrentPageData.some(data => data.checked)
    this.setOfCheckedId = this.listOfCurrentPageData.filter(data => data.checked === true)
// console.log(this.setOfCheckedId)
  }

  resetPagination() {
    this.currentPage = 1
    // console.log(this.isChecked)
  }

  kickParticipants(participant, index, participants, isPrevent ?, isDrawer ?) {
    this.participantsService.isActionLoading = true

    this.store.dispatch(new KickAllParticipants(this.sharedService.tournamentCode, [participant], isPrevent))
    this.actionExecuting(KickAllParticipants, true)
    this.checkIsDrawerOpenend(isDrawer, KickAllParticipants, participant, index, participants, false)

  }

  restoreParticipant(participant, index, participants, isDrawer ?) {
    this.participantsService.isActionLoading = true

    this.store.dispatch(new RestoreParticipants(this.sharedService.tournamentCode, [participant], this.tournament.join_privacy))
    this.actionExecuting(RestoreParticipants, true)

    this.checkIsDrawerOpenend(isDrawer, RestoreParticipants, participant, index, participants, false)

  }

  disqualifyParticipant(participant, index, participants, isDrawer ?) {
    this.participantsService.isActionLoading = true
    this.store.dispatch(new DisqualifyAllParticipants(this.sharedService.tournamentCode, [participant]))
    this.actionExecuting(DisqualifyAllParticipants, true)
    this.checkIsDrawerOpenend(isDrawer, DisqualifyAllParticipants, participant, index, participants, false)
  }

  confirmParticipants(participant, index, participants, isDrawer ?) {
    this.participantsService.isActionLoading = true

    this.store.dispatch(new ConfirmAllParticipant(this.sharedService.tournamentCode, [participant]))
    this.actionExecuting(ConfirmAllParticipant, true)

    this.checkIsDrawerOpenend(isDrawer, ConfirmAllParticipant, participant, index, participants, false)
  }

  checkIsDrawerOpenend(isDrawer, DrawerType, participant, index, participants, checked) {
    if (isDrawer) {
      this.closeDrawer(DrawerType)
    } else {
      this.onItemChecked(checked, index, participants)

    }
  }

  checkInParticipant(participant, index, participants, status) {
    this.store.dispatch(new CheckInAllParticipant(this.sharedService.tournamentCode, [participant], status))
    this.actionExecuting(CheckInAllParticipant, true)

  }

  sendRequest(type, isPrevent ?)
    :
    void {
    // this.loadingAction = true
    this.participantsService.isActionLoading = true
    const requestData = this.listOfCurrentPageData.filter(data => data?.checked)
    if (type === 'disqualify'
    ) {
      // console.log(requestData.length  , this.confirmedParticipants.data.length)
      this.store.dispatch(new DisqualifyAllParticipants(this.sharedService.tournamentCode, requestData))
      this.actionExecuting(DisqualifyAllParticipants)
    } else if (type === 'accept') {
      this.store.dispatch(new ConfirmAllParticipant(this.sharedService.tournamentCode, requestData))
      this.actionExecuting(ConfirmAllParticipant)
    } else if (type === 'kick') {
      this.store.dispatch(new KickAllParticipants(this.sharedService.tournamentCode, requestData, isPrevent))
      this.actionExecuting(KickAllParticipants)
    } else if (type === 'checkin') {
      this.store.dispatch(new CheckInAllParticipant(this.sharedService.tournamentCode, requestData, true))
      this.actionExecuting(CheckInAllParticipant)
    } else if (type === 'remove-checkin') {
      this.store.dispatch(new CheckInAllParticipant(this.sharedService.tournamentCode, requestData, false))
      this.actionExecuting(CheckInAllParticipant)
    } else if (type === 'restore') {
      this.store.dispatch(new RestoreParticipants(this.sharedService.tournamentCode, requestData, this.tournament.join_privacy))
      this.actionExecuting(RestoreParticipants)
    }
  }

  openTeamDrawer(data) {
    console.log(this.isMobView)
    this.teamMember = data
    this.drawerRef = this.drawerService.create<TeamViewComponent, { value: string }, string>({
      nzTitle: this.drawerTitle,
      nzFooter: this.drawerFooter,
      nzContent: TeamViewComponent,
      nzContentParams: {
        data: data?.tournamentMembers,
        tournament: this.tournament,
        leader: data?.original?.leader,
        componentName: 'participants'
      },
      nzWidth: this.isMobView ? '90%!important' : '550px!important',
    })
    // this.drawerRef.afterClose.subscribe(() => {
    //   this.teamMember = null
    // });
  }

  sendMessage(participant ?) {
    console.log(participant)
    // const requestData =  this.listOfCurrentPageData.filter(data => data?.checked)
    this.modalService.create({
      nzTitle: 'Send Message',
      nzContent: SendMessageComponent,
      nzData: {
        participants: participant ? [participant] : this.listOfCurrentPageData.filter(data => data?.checked),
      },
      nzFooter: null,
      nzWidth: '1500px',
    });

  }

  filterCountryValue(value) {
    this.isCountryValueChanged = true
  }

  filterCountry(country) {
    this.selectedCountry = country === 'Global' ? '' : country
    console.log(this.selectedCountry)
    this.filterParticipants()
    this.isCountryValueChanged = false

  }

  filterCheckedIn(checked) {
    this.isCheckedIn = checked
    this.filterParticipants()

  }


  closeDrawer(actionName) {
    console.log(actionName)
    this.actions$.pipe(ofActionSuccessful(actionName)).subscribe(() => {
      this.drawerRef.close()
    })
  }

  actionExecuting(actionName, isSelectAll ?) {
    this.loadingAction = true
    this.actions$.pipe(ofActionCompleted(actionName)).subscribe(() => this.loadingAction = false);
    if (!isSelectAll) {
      this.actions$.pipe(ofActionSuccessful(actionName)).subscribe(() => {
        this.setOfCheckedId = []
        for (const participant of this?.listOfCurrentPageData) {
          participant.checked = false
        }
        this.participantsService.isActionLoading = false

        this.listOfCurrentPageData = []
        this.isChecked = false
        this.checked = false
      });
    }

  }

  exportAsExcelFile() {
    const bool = this.typeOfParticipant === 'pending' ? false : true
    this.participantsService.getPDF(this.sharedService.tournamentCode, bool, 1, this.search.nativeElement.value, this.selectedCountry, this.isCheckedIn).subscribe((res: any) => {
      const downloadURL = window.URL.createObjectURL(res);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.click();

    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }

  isNotSelected(value) {
    return this.displayedColumns.indexOf(value) === -1;
  }

  changeRemoveValue(value) {
    this.getPendingParticipants.subscribe(res => {
      if (res?.count) {
        this.pendingParticipants = res
        this.pendingLoad = false
      }
    })
    if (this.pendingParticipants.data[this.participantDataObject.index]?.visible) {
      this.pendingParticipants.data[this.participantDataObject.index].visible = false
    }
    this.popoverVisible = false
    this.modalService.create({
      nzTitle: null,
      nzContent: ConfirmationDialogComponent,
      nzData: {
        message: `Confirm you want to kick this user from this  Tournament ${value ? 'forever' : 'temporarily'} ?`
      },
      nzClassName: 'confirmation-modal',
      nzFooter: null,
      nzWidth: '400px',
    }).afterClose.subscribe((res) => {

      if (res === 'confirm') {
        console.log(value)
        // this.store.dispatch(new KickAllParticipants(this.sharedService.tournamentCode, [this.participantDataObject.data ], value))
        if (this.participantDataObject.isSingleUser) {
          this.kickParticipants(this.participantDataObject.data, this.participantDataObject.index, this.participantDataObject.participants, value, this.participantDataObject.isTeam)
        } else {
          this.sendRequest('kick', value)
        }
      }
      this.participantDataObject = {}
      this.radioButtonRemoveValue = null
    });


  }

  passData(data, index, participants, isSingleUser, isTeam ?) {
    console.log(index)
    this.participantDataObject = {data, index, participants, isSingleUser}
  }

  clearFilters() {
    for (const column of this.showDisplayedColumns) {
      column.checked = true
    }
    if (this.selectedCountry !== '') {
      this.selectedCountry = ''
      this.isCountryValueChanged = true
    }
    if (this.selectedFilterTag) {
      this.selectedFilterTag = ''
    }
    this.isInCompleteTeam = null
    this.filterParticipantsCountry(null, true)
    this.popoverFilterVisible = false
    this.filterBadge = false

  }

  filterParticipantsCountry(is_completed ?, reset ?) {
    const displayedColumnss = this.showDisplayedColumns.filter(column => column.checked === true).map(column => column.value)
    this.displayedColumns = ['participant_name', ...displayedColumnss]
    if (this.isCountryValueChanged) {
      this.filterCountry(this.selectedCountry)
    }
    if (is_completed === false || is_completed || reset || this.selectedFilterTag) {
      this.filterParticipants()
    }

    this.popoverFilterVisible = false
    this.filterBadge = true
  }

  log(event) {
    console.log(event)
    console.log(this.tagsColors)
  }

  saveTagsColors() {
    const participants_highlights = this.tagsColors
    this.tournamentService.UpdateTournament({participants_highlights}, this.tournamentCode).subscribe(data => {
      this.store.dispatch(new SetNotifications('Success', 'Highlights Updated successfully', 'success'))
    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }

  setTagsToUsers(isClear?: boolean) {
    const body = {
      highlight: isClear ? null : this.selectedTagColor,
      participants_ids: this.setOfCheckedId.map(user => user.participant_id)
    }
    this.tournamentService.highlightParticipant(this.tournamentCode, body).subscribe(data => {
      if (isClear) {
        this.store.dispatch(new SetNotifications('Success', 'Participant Tags Removed successfully', 'success'))
      } else {
        this.store.dispatch(new SetNotifications('Success', 'Participant Tags set successfully', 'success'))

      }
      this.selectedTagColor = ''
      this.popoverColorSelectionVisible = false
      if (this.typeOfParticipant === 'confirmed') {
        this.getConfirmed(this.confirmedPage, '')
      }
      if (this.typeOfParticipant === 'pending') {
        this.getPending(this.pendingPage, '')
      }
    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }

  getHexValue(color: string): string {
    const selectedColor = this.tagsColors.find((c) => c.color === color);
    return selectedColor ? selectedColor.hex : '';
  }

}
