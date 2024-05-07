import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatchListService} from "../services/match-list.service";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {GetTournamentParticipants, ReplaceParticipant, UpdateMatchScore} from "../state/match-list.action";
import {take, takeUntil} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {MatchListState} from "../state/match-list.state";
import {NzModalRef} from "ng-zorro-antd/modal";
import {SetNotifications} from "../../../../../shared/state/global.action";

@Component({
  selector: 'app-replace-player',
  templateUrl: './replace-player.component.html',
  styleUrls: ['./replace-player.component.scss']
})
export class ReplacePlayerComponent implements OnInit, OnDestroy {
  @Input() stage?: any;
  @Input() groupIndex?: any;
  @Input() tournamentCode: any;
  @Input() selectedBracketMatchType: any;
  @Input() match: any;
  @Select(MatchListState.getTournamentParticipants) getTournamentParticipants$: Observable<any>;
  private readonly unsubscribe$: Subject<void> = new Subject();
  selectedParticipant: any
  selectedSide: any
  participants = []
  searchValues: any

  constructor(private matchListService: MatchListService, private store: Store, private actions$: Actions, public modal: NzModalRef) {
  }

  ngOnInit(): void {
    this.store.dispatch(new GetTournamentParticipants(this.tournamentCode))
    this.getTournamentParticipants$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.participants = data
    })
  }

  findParticipant(participantName): any {
    if (participantName) {
      return this.searchValues = this.participants.filter(participant => participant.original.participant_name.toLowerCase().includes(participantName.toLowerCase()))
    }
  }

  submit() {
    const payload = {
      participant_id: this.selectedParticipant.participant_id,
      participant: this.selectedParticipant,
      side: this.selectedSide
    }
    this.store.dispatch(new ReplaceParticipant(this.selectedBracketMatchType, this.match.code, payload, this.stage, this.groupIndex))
    this.actions$.pipe(take(1), ofActionSuccessful(ReplaceParticipant)
    ).subscribe(() => {
      this.store.dispatch(new SetNotifications('Replace Player', 'Replace Player Successfully', 'success', 3000))
      this.modal.close()
    })

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
