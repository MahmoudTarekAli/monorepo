import {Component, HostListener, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {TournamentProcessState} from "../../../tournament-process/state/tournament-process.state";
import {Observable, Subject} from "rxjs";
import {ActionsExecuting, hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {
  ChangeStage,
  GetMatches,
  UpdateMatchScore,
  UpdateMatchStatus,
  UpdateParticipantScoreFreeForAll
} from "../state/match-list.action";
import {MatchStatus} from "../../../../../core/match-status.enum";
import {MatchListService} from "../services/match-list.service";
import {SharedService} from "../../../service/shared.service";
import {takeUntil} from "rxjs/operators";
import {HandleError, SetNotifications} from "../../../../../shared/state/global.action";
import {BRACKET_TYPES, STAGES} from '../../../../../core/tournament.enum'
import {MatchListState} from "../state/match-list.state";
import {TeamViewComponent} from "../../../../../shared/components/team-view/team-view.component";
import {NzDrawerRef, NzDrawerService} from "ng-zorro-antd/drawer";
import {StateReset} from "ngxs-reset-plugin";
import {SendMessageComponent} from "../../dialogs/send-message/send-message.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {FilterPipe} from "../../../../../shared/pipes/filter.pipe";

@Component({
  selector: 'app-free-for-all',
  templateUrl: './free-for-all.component.html',
  styleUrls: ['./free-for-all.component.scss']
})
export class FreeForAllComponent implements OnInit, OnDestroy {
  selectedStage: string
  isMobileView = false;
  selectedGroupIndex = 0;
  selectedMatchIndex = 0;
  participantsOfFreeForAllGroup: any
  freeForAllGroups: any
  @Select(MatchListState.getTournamentStage) getTournamentStage$: Observable<any>;
  @Select(TournamentProcessState.getTournament) getTournament$: Observable<any>;
  @Select(hasActionsExecuting([GetMatches])) isGetMatches$: Observable<ActionsExecuting>;
  private readonly unsubscribe$: Subject<void> = new Subject();
  scoringVariables = []
  allParticipantCheckbox = false
  matchStatus = MatchStatus
  displayedColumns = []
  selectedStatus: any
  changedParticipants = []
  matchCode: string
  searchText
  stages: any
  selectedParticipants = []
  teamMember
  @ViewChild('drawerTemplate', {static: false}) drawerTemplate?: TemplateRef<{
    $implicit: { value: string };
    drawerRef: NzDrawerRef<string>;
  }>;
  @ViewChild('drawerFooter', {static: true}) drawerFooter: TemplateRef<any>;
  @ViewChild('drawerTitle', {static: true}) drawerTitle: TemplateRef<any>;


  constructor(private matchListService: MatchListService, private sharedService: SharedService, private store: Store, private drawerService: NzDrawerService,
              private actions$: Actions, private modalService: NzModalService) {
  }

  ngOnInit(): void {
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting;
      this.isMobileView = state.isMobileView;
    });
    this.getTournament$.subscribe(tournament => {
      if (tournament.supportedRequiredInputsKeys) {
        tournament.supportedRequiredInputsKeys.forEach(element => {
          if (element.category) {
            this.displayedColumns.push(element.placeholder)
          }
        })
      }

    })
    this.getTournamentStage$.pipe(takeUntil(this.unsubscribe$)).subscribe(stage => {
      this.selectedStage = stage
      this.selectedMatchIndex = 0
      this.selectedGroupIndex = 0

    })
    this.store.select(state => state.match_list).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.stages = data.stages
      this.getSelectedFreeForAllGroups()
      this.setFreeForAllGroups()
      this.createFreeForAllColumns()
    })

  }

  // get selected free for all participants depend on selected group and set checked to false for all free for all participants
  getSelectedFreeForAllGroups(groupChange?: boolean): any {
    this.resetSelectedParticipants()
    console.log(this.stages[this.selectedStage]?.groups[this.selectedGroupIndex]?.matches)
    console.log(this.stages[this.selectedStage]?.groups[this.selectedGroupIndex]?.matches[this.selectedMatchIndex])
    this.participantsOfFreeForAllGroup = this.stages[this.selectedStage]?.groups[this.selectedGroupIndex]?.matches[this.selectedMatchIndex]?.participants
    console.log(this.participantsOfFreeForAllGroup)
    if (this.stages?.[this.selectedStage]?.groups?.[this.selectedGroupIndex]?.matches?.[this.selectedMatchIndex]) {
      for (const participant of this.stages?.[this.selectedStage]?.groups?.[this.selectedGroupIndex]?.matches?.[this.selectedMatchIndex]?.participants) {
        participant.checked = false
      }
    }
  }

  // set free for all groups participants depend on stage
  setFreeForAllGroups(): any {
    this.freeForAllGroups = this.stages[this.selectedStage]?.groups
  }

  // create free for all dynamic columns
  createFreeForAllColumns(): any {
    this.scoringVariables = this.stages[this.selectedStage]?.scoring_variables
    console.log(this.scoringVariables)
  }

  selectParticipant(e, i): void {
    this.stages[this.selectedStage].groups[this.selectedGroupIndex].matches[this.selectedMatchIndex].participants[i].checked = e
    this.selectedParticipants = this.stages[this.selectedStage]?.groups[this.selectedGroupIndex]?.matches[this.selectedMatchIndex]?.participants.filter(participant => {
      return participant.checked === true
    })
    this.allParticipantCheckbox = this.stages[this.selectedStage]?.groups[this.selectedGroupIndex].matches[this.selectedMatchIndex]?.participants.every(match => match.checked)
  }

  selectAllParticipantInGroup(event): void {
    this.participantsOfFreeForAllGroup.map(participant => participant.checked = event)
    this.selectedParticipants = event ? this.stages[this.selectedStage]?.groups[this.selectedGroupIndex].matches[this.selectedMatchIndex]?.participants : []
  }

  resetSelectedParticipants(): void {
    if (this.participantsOfFreeForAllGroup) {
      this.selectAllParticipantInGroup(false)
      this.selectedParticipants = []
      this.allParticipantCheckbox = false
    }
  }

  openTeamDrawer(data) {
    console.log(data)
    this.teamMember = data
    this.matchListService.getTournamentTeamMember(this.sharedService.tournamentCode, data?.participant_id).subscribe((res) => {
      console.log(res.data.members.data)
      const drawerRef = this.drawerService.create<TeamViewComponent, { value: string }, string>({
        nzTitle: this.drawerTitle,
        nzFooter: this.drawerFooter,
        nzContent: TeamViewComponent,
        nzContentParams: {
          data: res?.data?.members?.data,
          leader: res?.data?.leader,
          componentName: 'match-list'
        },
        nzWidth: this.isMobileView ? '90%' : '550px',

      })
    })

  }

  sendMessage() {
    console.log(this.selectedParticipants)
    this.modalService.create({
      nzTitle: 'Send Message',
      nzContent: SendMessageComponent,
      nzData: {
        participants: this.selectedParticipants
      },
      nzFooter: null,
      nzWidth: '700px',
    });

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    console.log(this.changedParticipants)
    if (this.changedParticipants.length > 0) {
      this.store.dispatch(
        new StateReset(MatchListState)
      );
    }
  }

  updateStatus(status) {
    this.matchCode = this.stages[this.selectedStage]?.groups[this.selectedGroupIndex].matches[this.selectedMatchIndex].code
    this.matchListService.updateStatus(this.matchCode, {status}).subscribe(res => {
      this.selectedStatus = null
      // this.store.dispatch(new SetNotifications('Update Status', 'Status updated successfully', 'success'))
    }, error => {
      this.selectedStatus = null
      this.store.dispatch(new HandleError(error));
    })
  }

  getParticipants(data) {
    const isParticipantFound = this.changedParticipants.findIndex(participant => participant.participant_id === data.participant_id)
    if (isParticipantFound !== -1) {
      this.changedParticipants[isParticipantFound] = data
      this.matchListService.changedParticipants.next(this.changedParticipants)

    } else {
      this.changedParticipants.push(data);
      this.matchListService.changedParticipants.next(this.changedParticipants)

    }
  }

  submitScoreFreeForAll() {
    this.matchCode = this.stages[this.selectedStage].groups[this.selectedGroupIndex].matches[this.selectedMatchIndex].code
    this.matchListService.setScore(this.matchCode, {participants: this.changedParticipants}).subscribe(res => {
      console.log(res)
      // res.group.participants = res.group.group_participants
      res.group.matches[0].participants = res.group.group_participants
      this.store.dispatch(new UpdateParticipantScoreFreeForAll(this.selectedStage, res.group, res.group.id))
      // this.store.dispatch(new SetNotifications('Set Score', 'Score set successfully', 'success'))
      this.changedParticipants = []
      this.matchListService.changedParticipants.next(this.changedParticipants)
    }, error => {
      this.store.dispatch(new HandleError(error));
    })
  }

  getData(e) {

    console.log(e)
  }
}
