import {Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {TournamentService} from "../../../../tournaments/services/tournament.service";
import {Select, Store} from "@ngxs/store";
import {TournamentProcessState} from "../../../tournament-process/state/tournament-process.state";
import {Observable, Subject} from "rxjs";
import {ManageTournamentService} from "../../services/manage-tournament.service";
import {ManageTournamentState} from "../../state/manage-tournament.state";
import {bounceAnimation, bounceInUpOnEnterAnimation, fadeInDownOnEnterAnimation, fadeInOnEnterAnimation, fadeOutUpOnLeaveAnimation, flashAnimation, pulseAnimation, rubberBandAnimation, shakeAnimation} from "angular-animations";
import {SetNotifications} from "../../../../../shared/state/global.action";
import {ActionsExecuting, hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {GetTournamentAllParticipants, ShuffleSingleBracket} from "../../state/manage-tournament.action";
import {BRACKET_TYPES} from "../../../../../core/tournament.enum";
import {take, takeUntil} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-single-elimination',
  templateUrl: './single-double-elimination.component.html',
  styleUrls: ['./single-double-elimination.component.scss'],
})
export class SingleDoubleEliminationComponent implements OnInit, OnDestroy {
  participants: any;
  bracket: any
  @Select(ManageTournamentState.getTournamentAllParticipants) getTournamentAllParticipants$: Observable<any>;
  @Select(hasActionsExecuting([GetTournamentAllParticipants])) isGetTournamentAllParticipants$: Observable<ActionsExecuting>;
  selectedIndexes = [];
  @ViewChildren("awayCheckboxes") awayCheckboxes: QueryList<ElementRef>;
  @ViewChildren("homeCheckbox") homeCheckbox: QueryList<ElementRef>;
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;
  @Select(ManageTournamentState.getTournamentBracket) getTournamentBracket$: Observable<any>;
  bracketType = BRACKET_TYPES.SINGLE_ELIMINATION
  private readonly unsubscribe$: Subject<void> = new Subject();
  checkedIndexes = []

  constructor(private manageTournamentService: ManageTournamentService, private store: Store) {

    this.getTournamentAllParticipants$.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
      if (res.length > 0) {
        this.participants = res;
        console.log(this.participants)
        this.store.dispatch(new ShuffleSingleBracket(res, BRACKET_TYPES.SINGLE_ELIMINATION));
      }
      this.getTournamentBracket$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
        if (data.length > 0) {
          this.bracket = data
          console.log(this.bracket)
        }
      })
    })
    this.getTournament.pipe(takeUntil(this.unsubscribe$)).subscribe(tournament => {
      this.manageTournamentService.redirectToStageRoute(tournament)
    })
  }

  ngOnInit(): void {
  }


  // switch between home or away players
  swapBetweenTwoPlayers(array, index1, index2, object1, object2) {
    [array[index1][object1], array[index2][object2]] = [array[index2][object2], array[index1][object1]];
    this.store.dispatch(new SetNotifications('Swap Player', `player <span class="font-weight-bold font-size-16">${array[index1][object1].original.participant_name}</span> and <span class="font-weight-bold font-size-16">${array[index2][object2].original.participant_name}</span> swapped successfully`, 'info', 0));
    this.resetSwap();
  }

  pushSelectedIndex(e, i, object, participantHome?, participantAway?) {
    // check if the match has two bye or swap bye with bye
    if (this.checkedIndexes.length > 0) {
      if (this.checkedIndexes[0]?.participant?.original?.participant_name === '--') {
        if (i === this.checkedIndexes[0].index) {
          this.checkedIndexes.push({index: i, participant: this.bracket[i][object]})
        } else {
          // @ts-ignore
          if (Object.values(this.bracket[i])[0].original.participant_name === '--') {
            this.checkedIndexes.push({index: i, participant: Object.values(this.bracket[i])[0]})
          } else {
            this.checkedIndexes.push({index: i, participant: Object.values(this.bracket[i])[1]})
          }
        }
      } else {
        this.checkedIndexes.push({index: i, participant: this.bracket[i][object]})
      }
    } else {
      this.checkedIndexes.push({index: i, participant: this.bracket[i][object]})
    }
    if (e === false) {
      this.selectedIndexes = []
    } else {
      this.selectedIndexes.push({index: i, object, participantHome, participantAway});
      // console.log(this.selectedIndexes)
    }
  }

  applySwap() {
    if (this.checkedIndexes[0]?.participant?.original?.participant_name === '--' && this.checkedIndexes[1]?.participant?.original?.participant_name === '--') {
      this.store.dispatch(new SetNotifications('Can Not Swap', `You Must Have at least one player & can not swap bye with bye`, 'error', 0));
      this.resetSwap();
      return
    }
    this.swapBetweenTwoPlayers(this.bracket, this.selectedIndexes[0]?.index, this.selectedIndexes[1]?.index, this.selectedIndexes[0]?.object, this.selectedIndexes[1]?.object);
  }

  resetSwap() {
    this.selectedIndexes = []
    this.checkedIndexes = []
    this.homeCheckbox.forEach((element) => {
      // @ts-ignore
      element.nzChecked = false;
    });
    this.awayCheckboxes.forEach((element) => {
      // @ts-ignore
      element.nzChecked = false;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
