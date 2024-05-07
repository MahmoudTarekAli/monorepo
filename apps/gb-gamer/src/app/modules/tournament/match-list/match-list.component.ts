import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatchListService} from "./services/match-list.service";
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
import {take, takeUntil} from "rxjs/operators";

import {NzModalService} from "ng-zorro-antd/modal";
import {MatchListState} from "./state/match-list.state";
import {NzDrawerRef, NzDrawerService} from "ng-zorro-antd/drawer";
import {ActivatedRoute, Router} from "@angular/router";
import * as io from "socket.io-client";
import {TournamentState} from "../state/tournament.state";
import {Tournament} from "../../../shared/models/tournament";
import {BRACKET_MATCH_TYPES, BRACKET_TYPES, STAGES} from "../../../core/tournament.enum";
import {GlobalService} from "../../../shared/service/global.service";
import {SetNotifications} from "../../../shared/state/global.action";
import {TeamViewComponent} from "../../../shared/components/team-view/team-view.component";
import {AuthenticationState} from "../../authentication/state/authentication.state";
import {SocketService} from "../../../shared/service/socket.service";
import {environment} from "../../../../environments/environment";
import {TournamentService} from "../service/tournament.service";

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss'],
})
export class MatchListComponent implements OnInit, OnDestroy {
  @Select(TournamentState.getTournament) getTournament$: Observable<Tournament>;
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
  @Select(AuthenticationState.getUser) getUser: Observable<any>;
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
              private cd: ChangeDetectorRef, private sharedService: GlobalService, private store: Store, private drawerService: NzDrawerService,
              private modalService: NzModalService, private tournamentService: TournamentService ,private actions$: Actions, private router: Router, private activatedRoute: ActivatedRoute, private socketService: SocketService) {
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
    this.tournamentsNameSpace.emit('Join', this.tournamentService.tournamentCode);
    this.tournamentsNameSpace.emit('Count', this.tournamentService.tournamentCode);

  }

  ngOnInit(): void {
    this.loadingIndicator = true;
    this.getUser.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user
    })
    this.socketService.listen(this.tournamentsNameSpace, this.tournamentService.tournamentCode).subscribe((res: any) => {
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
      if (params['stage']) {
        this.selectedStage = parseInt(params['stage']) - 1
        this.selectStage(this.selectedStage)
      }
    })
    console.log(this.tournamentService.tournamentCode)
    this.store.dispatch(new GetMatches(this.tournamentService.tournamentCode, this.selectedStage))
    this.store.dispatch(new ChangeStage(this.selectedStage))
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

      // console.log(data)
      this.isStageFreeForAll = this.stages?.[this.selectedStage]?.type === BRACKET_TYPES.FREE_FOR_ALL;
      this.isStageDoubleElimination = this.stages?.[this.selectedStage]?.type === BRACKET_TYPES.DOUBLE_ELIMINATION;
      this.getBracketMatchType()
      this.setCheckedPropertyToFalseForAllMatchesInGroup()
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
    this.store.dispatch(new GetMatches(this.tournamentService.tournamentCode, this.selectedStage))
    this.actions$.pipe(ofActionSuccessful(GetMatches)).subscribe(() => {
      this.isStageFreeForAll = this.stages[this.selectedStage]?.type === BRACKET_TYPES.FREE_FOR_ALL;
    })
  }

  selectUpperOrLowerBracketMatches(bracketMatchType) {
    this.selectedBracketMatchType = bracketMatchType
  }

  setSelectedTabName(e) {
    this.selectedGroupIndex = e.index;
    this.selectedTabName = e
    this.pageIndex = 1
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


  getBracketMatchType() {
    if (this.isStageDoubleElimination) {
      return this.selectedBracketMatchType = BRACKET_MATCH_TYPES.UPPER
    } else {
      return this.selectedBracketMatchType = BRACKET_MATCH_TYPES.Matches
    }
  }


  openTeamDrawer(data) {
    this.matchListService.getTournamentTeamMember(this.tournamentService.tournamentCode, data?.participant_id).subscribe((res) => {
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


  ngOnDestroy() {
    this.store.dispatch(new ChangeStage(0))
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }

}

