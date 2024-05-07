import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {TournamentProcessState} from "../state/tournament-process.state";
import {Observable, Subject} from "rxjs";
import {fadeInDownOnEnterAnimation, fadeOutUpOnLeaveAnimation} from "angular-animations";
import {TournamentService} from "../../../tournaments/services/tournament.service";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {GetTournamentAllParticipants} from "../../manage-tournaments/state/manage-tournament.action";
import {ManageTournamentState} from "../../manage-tournaments/state/manage-tournament.state";
import {ActionsExecuting, hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {AddTournament} from "../../../tournaments/state/tournament.action";
import {
  GetTournament,
  PublishNextStage,
  PublishFirstStage, ResetTournament,
  ResetTree,
  UpdateTournament, TournamentCheckIn, TournamentRegistration
} from "../state/tournament-process.action";
import {HandleError, SetNotifications} from "../../../../shared/state/global.action";
import {Router} from "@angular/router";
import {SharedService} from '../../service/shared.service'
import {TournamentProgressService} from "./services/tournament-progress.service";
import {TOURNAMENT_UPDATE_TYPE} from "../../../../core/tournament.enum";
import {takeUntil} from "rxjs/operators";
import {environment} from "../../../../../environments/environment";
import {ManageTournamentService} from "../../manage-tournaments/services/manage-tournament.service";
import {GetMatches, ResetBracket} from "../../manage-tournaments/match-list/state/match-list.action";
import {SetScoreComponent} from "../../manage-tournaments/match-list/set-score/set-score.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {WinnersModalComponent} from "./winners-modal/winners-modal.component";
import {StatusColor} from "../../../../core/match-status.enum";

@Component({
  selector: 'app-tournament-progress',
  templateUrl: './tournament-progress.component.html',
  styleUrls: ['./tournament-progress.component.scss'],
  animations: [
    fadeInDownOnEnterAnimation({anchor: 'enter', duration: 800, translate: '30px'}),
    fadeOutUpOnLeaveAnimation({anchor: 'leave', duration: 400, translate: '30px'}),
  ],
})
export class TournamentProgressComponent implements OnInit, OnDestroy {
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;
  @Select(ManageTournamentState.getTournamentAllParticipants) getTournamentAllParticipants$: Observable<any>;

  @Select(hasActionsExecuting([GetTournament])) getTournamentIsExecuting$: Observable<ActionsExecuting>;
  @Select(hasActionsExecuting([GetTournamentAllParticipants])) getTournamentAllParticipantsIsExecuting$: Observable<ActionsExecuting>;
  environment = environment;
  index = 0
  tournament: any
  isFirstStageBracketPublishable = false
  isSecondStageBracketPublishable = false
  participants: any
  seedParticipantsSize: number
  checkTournamentName: number
  isCorrectTournamentName = false
  private readonly unsubscribe$: Subject<void> = new Subject();
  resetTournamentTextValidation: string
  isConfirmLoading = false;
  isVisible = false;
  @ViewChild('winnersDialog', {static: true}) winnersDialog: TemplateRef<any>;
  isFinishable;
  isNextStageReady: boolean;
  tournamentRegistration: any;
  tournamentCheckIn: any;
  statusColor: any = StatusColor
  authorityType: string
  constructor(private tournamentService: TournamentService, private manageTournamentService: ManageTournamentService, private store: Store,
              private router: Router, private sharedService: SharedService, private tournamentProgressService: TournamentProgressService,
              private modalService: NzModalService, private actions$: Actions) {
    console.log(this.sharedService.tournamentCode)
    this.store.dispatch(new GetTournamentAllParticipants(this.sharedService.tournamentCode))
    this.getTournament.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      if (data?.code) {
        console.log(data)
        this.tournament = data;
        this.tournamentRegistration = data.registration_status === 'on'
        this.tournamentCheckIn = data.check_in_open
        if (this.tournament?.is_published === true) {
          this.getTournamentAllParticipants$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
            this.participants = res
            console.log('here')
            this.getCurrentStepperIndex(res);
            this.manageTournamentService.isNextStageReady(this.sharedService.tournamentCode).subscribe((data: any) => {
              this.isNextStageReady = data
              console.log(this.isNextStageReady)
              this.getCurrentStepperIndex(res);
            })
            this.sharedService.checkAuthority(this.tournament.code).subscribe(res => {
              this.authorityType = res.Authority
              console.log(res.Authority)
            })
          })
        }

      }
      if (data?.tree?.data[0]?.is_published === 1) {
        this.isSecondStageBracketPublishable = true;
      }
    })
    this.actions$.pipe(ofActionSuccessful(PublishNextStage)).subscribe((bracket) => {
      this.store.dispatch(new GetMatches(this.sharedService.tournamentCode, 1))
    });
    this.actions$.pipe(ofActionSuccessful(ResetTournament)).subscribe((tournament) => {
      this.resetTournamentTextValidation = ''
      this.isCorrectTournamentName = false
    })

  }

  ngOnInit(): void {
    this.manageTournamentService.getIsFinishable(this.sharedService.tournamentCode).subscribe((data: any) => {
      console.log(data)
      this.isFinishable = data?.finishable
    })
  }

  seedParticipant() {
    this.tournamentService.seedParticipants({size: this.seedParticipantsSize}, this.sharedService.tournamentCode).subscribe(data => {
      console.log(data);
      this.store.dispatch(new SetNotifications('Seed Participants', `${this.seedParticipantsSize} participants seeded successfully`, 'info', 3000))
      this.seedParticipantsSize = undefined
    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }


  getCurrentStepperIndex(res) {

    if (this.tournament?.is_publishable === true) {
      this.index = 0;
    }
    if (res?.length <= 3 && this.tournament?.is_publishable === false && this.tournament?.tree?.data[0]?.is_published === 0) {
      this.index = 1;
    }
    if (this.tournament?.tree?.data[0]?.is_published === 0) {
      this.index = 1
    }
    if (res?.length >= 2 && this.tournament?.tree?.data[0]?.is_published === 1 && !this.isNextStageReady) {
      this.index = 2
    }
    if (res?.length >= 2 && this.tournament?.tree?.data[0]?.is_published === 1) {
      this.index = 3
    }
    if (this.tournament?.status === 'Finished') {
      this.index = 4
    }

  }

  publishFirstStageBracket() {
    this.router.navigate([`/tournament/${this.tournament?.code}/manage/publish-brackets/${this.tournament?.tree?.data[0].type}`])
  }

  publishSecondStageBracket() {
    if (this.isSecondStageBracketPublishable === false) {
      this.store.dispatch(new SetNotifications('Can Not Publish Bracket', 'You need to have at least 2 participants to publish the bracket', 'error', 5000))
    } else {
      this.store.dispatch(new PublishNextStage(this.tournament?.code));
    }
  }

  publishTournament() {
    this.tournamentProgressService.publishTournament(this.sharedService.tournamentCode).subscribe(tournament => {
      this.store.dispatch(new UpdateTournament(tournament.data, this.sharedService.tournamentCode, TOURNAMENT_UPDATE_TYPE.PUBLISH_TOURNAMENT_UPDATE))
    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }

  startTournament() {
    this.tournamentProgressService.startTournament(this.sharedService.tournamentCode).subscribe(tournament => {
      // this.store.dispatch(new UpdateTournament(tournament.data, this.sharedService.tournamentCode, TOURNAMENT_UPDATE_TYPE.PARTICIPANT_TOURNAMENT_UPDATE))
      this.store.dispatch(new SetNotifications('Start Tournament', 'Tournament Started Successfully', 'success'))
      console.log(tournament)
    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }

  resetTournament() {
    this.store.dispatch(new ResetTournament(this.sharedService.tournamentCode))
  }

  resetSecondStageBracket() {
    this.store.dispatch(new ResetBracket(this.sharedService.tournamentCode, 1))
    //
    // this.tournamentProgressService.resetSecondStage(this.sharedService.tournamentCode).subscribe(tournament => {
    //   this.store.dispatch(new SetNotifications('Reset Bracket', 'Bracket Reset Successfully', 'success'))
    //   console.log(tournament)
    // }, error => {
    //   this.store.dispatch(new HandleError(error))
    // })
  }

  validateTournamentNameSpelling(event) {
    this.isCorrectTournamentName = event.target.value === this.tournament?.name;
  }

  finishTournament() {
    this.modalService.create({
      nzTitle: 'Finish Tournament',
      nzContent: WinnersModalComponent,
      nzData: {
        code: this.tournament?.code,
      },
      nzWidth: '800px',
      nzBodyStyle: {padding: '0px'},
      nzCentered: true,
    });
    // this.isVisible = true;

  }

  indexChange(e) {
    console.log(e)
  }

  checkInTournament(e) {
    // console.log('here')
    this.store.dispatch(new TournamentCheckIn(this.tournament.code, {check_in_open: e}))
  }


  TournamentRegistration(e) {
    this.store.dispatch(new TournamentRegistration(this.tournament.code, e === true ? 'on' : 'off'))
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
