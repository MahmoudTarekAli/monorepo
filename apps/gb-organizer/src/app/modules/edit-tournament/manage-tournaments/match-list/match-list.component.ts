import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatchListService} from "./services/match-list.service";
import {SharedService} from "../../service/shared.service";
import {Actions, ofActionCompleted, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {Observable, Subject} from "rxjs";
import {ActionsExecuting, hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {
  ChangeStage,
  GetMatches,
  GetTournamentParticipants, QualifyWinner,
  ReplaceParticipant,
  ResetMatches, SetMatchesDate,
  UpdateMatchScore,
  UpdateMatchStatus,
  UpdateRoundMatchesStatus
} from "./state/match-list.action";
import {distinctUntilChanged, take, takeUntil} from "rxjs/operators";
import {TournamentProcessState} from "../../tournament-process/state/tournament-process.state";
import {
  BRACKET_MATCH_TYPES,
  BRACKET_TYPES,
  STAGES,
  STAGES_MATCHES_TYPES,
  STAGES_TYPES
} from '../../../../core/tournament.enum'
import {SetNotifications} from "../../../../shared/state/global.action";
import {NzModalService} from "ng-zorro-antd/modal";
import {SetScoreComponent} from "./set-score/set-score.component";
import {SendMessageComponent} from "../dialogs/send-message/send-message.component";
import {ReplacePlayerComponent} from "./replace-player/replace-player.component";
import {AnimationOptions} from "ngx-lottie";
import {MatchListState} from "./state/match-list.state";
import {NzDrawerRef, NzDrawerService} from "ng-zorro-antd/drawer";
import {TeamViewComponent} from "../../../../shared/components/team-view/team-view.component";
import {ActivatedRoute, Router} from "@angular/router";
import * as io from "socket.io-client";
import {SocketService} from "../../../../services/socket.service";
import {
  AcceptParticipantSocket,
  DisqualifyParticipantSocket, GetConfirmedParticipants,
  KickParticipantSocket
} from "../participants/state/participants.action";
import {AuthenticationState} from "../../../authentication/state/authentication.state";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss'],
})
export class MatchListComponent implements OnInit, OnDestroy {
  @Select(TournamentProcessState.getTournament) getTournament$: Observable<any>;
  @Select(hasActionsExecuting([GetMatches])) isGetMatches$: Observable<ActionsExecuting>;
  @Select(MatchListState.getTournamentStage) getTournamentStage$: Observable<any>;
  private readonly unsubscribe$: Subject<void> = new Subject();
  matchListStages: any
  isMobileView = false;
  selectedStage = 0;
  selectedBracketMatchType = BRACKET_MATCH_TYPES.UPPER
  STAGES = STAGES
  selectedRoundIndex = 0;
  selectedGroupIndex = 0;
  selectedTabName: any;
  isStageFreeForAll: boolean
  BRACKET_TYPES = BRACKET_TYPES
  BRACKET_MATCHES_TYPES = BRACKET_MATCH_TYPES
  allMatchesCheckbox;
  selectedMatchesPerRound = []
  requiredInputs = []
  showRequiredInputs = false
  showMatchDate = false
  isStageDoubleElimination: boolean
  bracketMatchType: string
  rounds: any
  selectedMatchDate: string
  searchText: string
  stages: any
  user: any
  selectedMatches = []
  string = String
  teamMember
  teamMemberIndex
  teamMemberParticipants
  drawerRef
  loading = false;
  // tournament: any
  tournamentsNameSpace: any
  Socket = environment.Socket
  changedParticipants
  @ViewChild('drawerTemplate', {static: false}) drawerTemplate?: TemplateRef<{
    $implicit: { value: string };
    drawerRef: NzDrawerRef<string>;
  }>;
  @ViewChild('drawerFooter', {static: true}) drawerFooter: TemplateRef<any>;
  @ViewChild('drawerTitle', {static: true}) drawerTitle: TemplateRef<any>;
  @Select(AuthenticationState.getAuth) getUser: Observable<any>;
  pageIndex = 1;
  pageSize = 10
  paginatedItems = []
  loadingIndicator = false

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // returns false if user added changes to score and navigated to a different route without saving changes
    return !(this.changedParticipants?.length > 0)
  }

  constructor(private matchListService: MatchListService,
              private cd: ChangeDetectorRef, private sharedService: SharedService, private store: Store, private drawerService: NzDrawerService,
              private modalService: NzModalService, private actions$: Actions, private router: Router, private activatedRoute: ActivatedRoute, private socketService: SocketService) {
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
    this.tournamentsNameSpace.emit('Join', this.sharedService.tournamentCode);
    this.tournamentsNameSpace.emit('Count', this.sharedService.tournamentCode);

  }

  ngOnInit(): void {

    this.loadingIndicator = true;
    this.getUser.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user
    })
    this.socketService.listen(this.tournamentsNameSpace, this.sharedService.tournamentCode).subscribe((res: any) => {
      console.log(res.bracket_type, BRACKET_TYPES.FREE_FOR_ALL)
      if (res.bracket_type !== BRACKET_TYPES.FREE_FOR_ALL) {

        console.log('here')
        if (res.sender_id !== this.user.id) {
          for (const match of res?.matches) {
            // console.log(match.matches)
            this.store.dispatch(new UpdateMatchScore(this.selectedBracketMatchType, match, {
              score_home: match?.home?.score,
              score_away: match?.away?.score,
              side: 'home'
            }, match?.current_stage?.name === 'first_stage' ? 0 : 1, 'groups', match?.round.order - 1, true))
          }
        }
        for (const match of res?.matches) {
          // console.log(res.matches)
          this.store.dispatch(new QualifyWinner(this.selectedBracketMatchType, match, match?.current_stage?.name === 'first_stage' ? 0 : 1, 'groups', match?.round?.order - 1))
        }
      }
    })

    this.matchListService.changedParticipants.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.changedParticipants = data
    })
    this.getTournament$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      if (res?.code) {
        // this.tournament = res
      }
    })
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.stage) {
        this.selectedStage = parseInt(params.stage) - 1
        // this.selectStage(this.selectedStage)
      }
    })
    this.store.dispatch(new GetMatches(this.sharedService.tournamentCode, this.selectedStage))
    this.store.dispatch(new ChangeStage(this.selectedStage))
    this.actions$.pipe(ofActionCompleted(GetConfirmedParticipants)).subscribe(() => this.loadingIndicator = false);
    this.getTournamentStage$.pipe(takeUntil(this.unsubscribe$)).subscribe(stage => {
      this.selectedStage = stage
    })
    this.actions$.pipe(takeUntil(this.unsubscribe$), ofActionSuccessful(UpdateMatchScore)).subscribe(action => {
      this.store.dispatch(new UpdateMatchStatus(this.selectedBracketMatchType, action.match, {status: 'Finished'}, action.stage, action.index, true))
    })
    this.store.select(state => state.setting).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      const state = data.setting;
      this.isMobileView = state.isMobileView;
    });
    this.store.select(state => state.match_list).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {

      this.matchListStages = data;
      this.stages = data.stages
      this.cd.markForCheck();
      if (this.stages.length > 0) {
        this.isStageFreeForAll = this.stages?.[this.selectedStage]?.type === BRACKET_TYPES.FREE_FOR_ALL;
        this.isStageDoubleElimination = this.stages?.[this.selectedStage]?.type === BRACKET_TYPES.DOUBLE_ELIMINATION;
        this.getBracketMatchType(this.selectedBracketMatchType)
        this.setCheckedPropertyToFalseForAllMatchesInGroup()
      }

    })

  }

  selectStage(stage) {
    this.selectedStage = stage;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        stage: stage + 1
      },
      queryParamsHandling: 'merge',
    });
    this.store.dispatch(new ChangeStage(this.selectedStage))
    this.store.dispatch(new GetMatches(this.sharedService.tournamentCode, this.selectedStage))
    this.actions$.pipe(ofActionSuccessful(GetMatches)).subscribe(() => {
      this.isStageFreeForAll = this.stages[this.selectedStage]?.type === BRACKET_TYPES.FREE_FOR_ALL;
    })
  }

  selectUpperOrLowerBracketMatches(bracketMatchType) {
    console.log(this.selectedBracketMatchType)
    this.selectedBracketMatchType = bracketMatchType
    this.setCheckedPropertyToFalseForAllMatchesInGroup()
  }

  setSelectedTabName(e) {
    this.selectedGroupIndex = e.index;
    this.selectedTabName = e
    this.pageIndex = 1
    this.setCheckedPropertyToFalseForAllMatchesInGroup()
    this.resetSelectedMatches()
  }

  selectAllMatchesInGroup(event): void {
    this.stages[this.selectedStage]?.groups[this.selectedGroupIndex][this.selectedBracketMatchType].map(match => match.checked = event)
    this.selectedMatches = event ? this.stages[this.selectedStage]?.groups[this.selectedGroupIndex][this.selectedBracketMatchType] : []
  }

  // set checked property to false for all matches in groups
  setCheckedPropertyToFalseForAllMatchesInGroup(): any {
    this.allMatchesCheckbox = false
    this.stages[this.selectedStage]?.groups?.forEach(group => {
      group[this.selectedBracketMatchType].forEach(match => {
        match.checked = false
      })
    })
  }

  // get only selected matches (not all) per group
  selectMatch(e, code): void {
    this.stages[this.selectedStage]?.groups?.[this.selectedGroupIndex]?.[this.selectedBracketMatchType].map(match => {
      if (match.code === code) {
        match.checked = e
      }
    })
    this.selectedMatches = this.stages[this.selectedStage]?.groups?.[this.selectedGroupIndex]?.[this.selectedBracketMatchType].filter(match => {
      return match.checked === true
    })
    this.allMatchesCheckbox = this.stages[this.selectedStage]?.groups[this.selectedGroupIndex][this.selectedBracketMatchType].every(match => match.checked)
  }

  // get home and away from selected matches and send it to send message component to exclude them from the list
  excludeParticipantsFromMatches() {
    // exclude home and away from selected matches and put them in an array
    const participants = []
    this.selectedMatches.forEach(match => {
      const participantIds = participants.map(participant => participant.participant_id)
      if (!participantIds.includes(match.home.participant_id)) {
        participants.push(match.home)
      }
      if (!participantIds.includes(match.away.participant_id)) {
        participants.push(match.away)
      }
    })
    return participants
  }

  /////////////////////////  update matches   /////////////////////////

  updateMatchStatus(match, status) {
    this.store.dispatch(new UpdateMatchStatus(this.selectedBracketMatchType, match, {status}, this.selectedStage, this.selectedGroupIndex))
  }

  setRoundLive(status) {
    const payload = {
      status,
      [this.stages[this.selectedStage].rounds ? 'round_id' : 'group_id']: this.stages[this.selectedStage]?.groups?.[this.selectedGroupIndex].id,
      codes: this.selectedMatches.map(match => match.code)
    }
    if (this.selectedMatches.every(match => match.checked === false) && this.selectedMatchesPerRound.every(match => match.checked === false)) {
      this.store.dispatch(new SetNotifications('Error', 'Please select at least one match', 'info'))
      return
    }
    this.store.dispatch(new UpdateRoundMatchesStatus(this.selectedBracketMatchType, this.sharedService.tournamentCode, this.stages[this.selectedStage].id, payload, this.selectedStage, this.selectedGroupIndex))
  }

  openRequiredInputs(match) {
    if (match?.home?.tournament_participant === null && match?.away?.tournament_participant === null) {
      return
    } else {
      this.showRequiredInputs = true
      const away = {
        requiredInputs: match.away.tournament_participant.supported_required_inputs,
        participant: match.away,
      }
      const home = {
        requiredInputs: match.home.tournament_participant.supported_required_inputs,
        participant: match.home,
      }
      this.requiredInputs.push(home, away)
      console.log(this.requiredInputs)
    }

  }

  closeRequiredInputs() {
    this.showRequiredInputs = false
    this.requiredInputs = []
  }

  getBracketMatchType(selectedBracketMatchType) {
    console.log(selectedBracketMatchType)
    console.log(this.isStageDoubleElimination)
    if (this.isStageDoubleElimination === true) {
      return this.selectedBracketMatchType = this.selectedBracketMatchType ? selectedBracketMatchType : BRACKET_MATCH_TYPES.UPPER
    } else if (this.isStageDoubleElimination === false) {
      return this.selectedBracketMatchType = BRACKET_MATCH_TYPES.Matches
    }
  }


  resetMatches() {
    const payload = {
      [this.stages[this.selectedStage].rounds ? 'round_id' : 'group_id']: this.stages[this.selectedStage]?.groups?.[this.selectedGroupIndex].id,
      codes: this.selectedMatches.length > 0 ? this.selectedMatches.map(matches => matches.code) : this.selectedMatchesPerRound.map(matches => matches.id)
    }
    if (this.selectedMatches.every(matches => matches.checked === false) && this.selectedMatchesPerRound.every(matches => matches.checked === false)) {
      this.store.dispatch(new SetNotifications('Error', 'Please select at least one match', 'info'))
      return
    }
    this.store.dispatch(new ResetMatches(this.selectedBracketMatchType, this.sharedService.tournamentCode, payload, this.selectedStage, this.selectedGroupIndex))
  }


  setMatchDate(date) {
    const payload = {
      date,
      codes: this.selectedMatches.length > 0 ? this.selectedMatches.map(matches => matches.code) : this.selectedMatchesPerRound.map(matches => matches.id)
    }
    this.store.dispatch(new SetMatchesDate(this.selectedBracketMatchType, this.sharedService.tournamentCode, this.stages[this.selectedStage].id, payload, this.selectedStage, this.selectedGroupIndex))
    this.actions$.pipe(ofActionSuccessful(SetMatchesDate)).subscribe((action) => {
      this.showMatchDate = false
    })
  }

  openSetMatchDateDialog() {
    if (this.selectedMatches.every(matches => matches.checked === false) && this.selectedMatchesPerRound.every(matches => matches.checked === false)) {
      this.store.dispatch(new SetNotifications('Error', 'Please select at least one match', 'info'))
      return
    }
    this.showMatchDate = true
  }


  resetSelectedMatches(): void {
    if (this.selectedMatches) {
      this.selectAllMatchesInGroup(false)
      this.selectedMatches = []
      this.allMatchesCheckbox = false
    }
  }

  openSetScoreModal(match) {
    this.modalService.create({
      nzTitle: 'Set Score',
      nzContent: SetScoreComponent,
      nzFooter: null,
      nzData: {
        selectedBracketMatchType: this.selectedBracketMatchType,
        match,
        roundOrGroup: 'groups',
        stage: this.selectedStage,
        roundIndex: this.selectedRoundIndex,
        groupIndex: this.selectedGroupIndex
      },
      nzWidth: '800px',
      nzBodyStyle: {padding: '0px'},
      nzCentered: true,
    });
  }

  sendMessage() {
    this.modalService.create({
      nzTitle: 'Send Message',
      nzContent: SendMessageComponent,
      nzData: {
        participants: this.excludeParticipantsFromMatches()
      },
      nzFooter: null,
      nzWidth: '700px',
    });

  }

  openTeamDrawer(data) {
    this.matchListService.getTournamentTeamMember(this.sharedService.tournamentCode, data?.participant_id).subscribe((res) => {
      this.teamMember = data
      this.drawerRef = this.drawerService.create<TeamViewComponent, { value: string }, string>({
        nzTitle: this.drawerTitle,
        nzFooter: this.drawerFooter,
        nzContent: TeamViewComponent,
        nzContentParams: {
          data: res?.data?.members?.data,
          componentName: 'match-list'
        },
        nzWidth: this.isMobileView ? '90%' : '550px',

      });
    })

  }

  replacePlayer(match) {
    this.modalService.create({
      nzTitle: 'Replace Player',
      nzContent: ReplacePlayerComponent,
      nzFooter: null,
      nzData: {
        selectedBracketMatchType: this.selectedBracketMatchType,
        tournamentCode: this.sharedService.tournamentCode,
        match,
        stage: this.selectedStage,
        groupIndex: this.selectedGroupIndex
      },
      nzCentered: true,
      nzWidth: '700px',
      // @ts-ignore
    });
  }

  ngOnDestroy() {
    this.store.dispatch(new ChangeStage(0))
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  navigateToMatchProfile(match) {
    this.router.navigate([`/match/${match.code}`])
  }

  changePage(event) {
    this.pageIndex = event
  }

  updateItemsToShow(items) {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedItems = items.slice(startIndex, endIndex);
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }

}

