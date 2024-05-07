import {Component, OnInit} from '@angular/core';
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {TournamentProcessState} from "../../tournament-process/state/tournament-process.state";
import {Observable, Subject} from "rxjs";
import {MatchListService} from "../match-list/services/match-list.service";
import {SharedService} from "../../service/shared.service";
import {GetTournamentAllMatches} from "./state/issues-claims.action";
import {IssuesClaimsState} from "./state/issues-claims.state";
import {takeUntil} from "rxjs/operators";
import {ActionsExecuting, hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {GetPendingParticipants} from "../participants/state/participants.action";
import {SetScoreComponent} from "../match-list/set-score/set-score.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'app-issues-claims',
  templateUrl: './issues-claims.component.html',
  styleUrls: ['./issues-claims.component.scss']
})
export class IssuesClaimsComponent implements OnInit {
  matchesWithClaims = []
  issues = []
  isMobileView: boolean
  participantsType: string;
  loading = false
  @Select(TournamentProcessState.getTournament) getTournament$: Observable<any>;
  @Select(IssuesClaimsState.getTournamentAllMatches) getTournamentAllMatches$: Observable<any>;

  private readonly unsubscribe$: Subject<void> = new Subject();
  @Select(hasActionsExecuting([GetTournamentAllMatches])) getPendingParticipantsIsExecuting$: Observable<ActionsExecuting>

  constructor(public router: Router , private matchListService: MatchListService, private store: Store, private sharedService: SharedService, private actions$: Actions, private modalService: NzModalService) {
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting;
      this.isMobileView = state.isMobileView;
    });
  }

  ngOnInit(): void {
    this.loading = true
    this.getTournament$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      if (res?.tree) {
        this.store.dispatch(new GetTournamentAllMatches(res?.tree?.data[0]?.id))
      }
      if (res?.participants_type) {
        this.participantsType = res?.participants_type
      }
    })
    this.getTournamentAllMatches$.pipe(takeUntil(this.unsubscribe$)).subscribe(matches => {
      if (matches) {
        if (matches?.winnersMatches || matches?.losersMatches) {
          matches = [...matches?.winnersMatches, ...matches?.losersMatches]
        }
        this.matchesWithClaims = matches.filter(match => match?.claims && match?.claims?.length > 0 && match?.status !== 'Finished')
        this.issues = matches.filter(match => match?.has_conflict && !match?.on_solution);
        console.log(this.matchesWithClaims)
      }
    })
    this.actions$.pipe(ofActionSuccessful(GetTournamentAllMatches)).subscribe(() => {
      this.loading = false
    })
  }
  navigateToMatchProfile(match) {
    this.router.navigate([`/match/${match.code}`])
  }
  openSetScoreModal(match) {
    // console.log(this.getTreeTypeRoundOrGroup())
    console.log(match)
    this.modalService.create({
      nzTitle: 'Set Score',
      nzContent: SetScoreComponent,
      nzFooter: null,
      nzData: {
        selectedBracketMatchType: 'matches',
        match,
        roundOrGroup: match,
        stage: 'firstStageMatches',
        roundIndex: match.round?.order - 1,
        component: 'issues_claims',
        groupIndex: match.round?.order - 1,
        participantsType: this.participantsType,
      },
      nzWidth: '800px',
      nzBodyStyle: {padding: '0px'},
      nzCentered: true,
    });
  }
}
