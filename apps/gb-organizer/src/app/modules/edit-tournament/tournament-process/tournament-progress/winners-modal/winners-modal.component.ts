import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {TournamentProcessService} from "../../services/tournament-process.service";
import {fromEvent, Observable} from "rxjs";
import {debounceTime, distinctUntilChanged, map, take} from "rxjs/operators";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {SetNotifications} from "../../../../../shared/state/global.action";
import {FinishTournament, GetTournament, UpdateTournament} from "../../state/tournament-process.action";
import {TOURNAMENT_UPDATE_TYPE} from "../../../../../core/tournament.enum";
import {TournamentProcessState} from "../../state/tournament-process.state";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-winners-modal',
  templateUrl: './winners-modal.component.html',
  styleUrls: ['./winners-modal.component.scss']
})
export class WinnersModalComponent implements OnInit, AfterViewInit {
  isConfirmLoading = false;
  code;
  winners = [];
  selectedWinner
  participants
  tournamentData
  @ViewChild('searchInput', {static: false}) searchInput;
  @Select(TournamentProcessState.getTournament) tournament: Observable<any>;

  constructor(private tournamentProcessService: TournamentProcessService,
              private modalService: NzModalService, public modal: NzModalRef, private store: Store, private actions$: Actions) {

  }


  ngOnInit(): void {
    this.tournamentProcessService.getSuggestedWinners(this.code).subscribe((res) => {
      console.log(res)
      this.winners = res.data
    })
    this.tournamentProcessService.getAllowedParticipants(this.code).subscribe((res) => {
      this.participants = res.data
    })
    this.actions$.pipe(ofActionSuccessful(FinishTournament)).subscribe(() => {
      this.modal.close()
    })
  }

  ngAfterViewInit() {
    // fromEvent(this.searchInput?.nativeElement, 'keyup').pipe(
    //   map((event: any) => {
    //     return event.target.value;
    //   })
    //   , debounceTime(500)
    //
    //   , distinctUntilChanged()
    // ).subscribe((text: string) => {
    //     this.tournamentProcessService.getAllowedParticipants(this.code, text).subscribe((res) => {
    //       this.participants = res.data
    //     })
    // });
  }

  pushToWinner(winner) {
    console.log(winner)
    const winnerParticpant = this.participants.find((participant) => participant.original.id === winner)
    console.log(winnerParticpant)
    this.winners.push(winnerParticpant.original)
    console.log(this.winners)
  }

  finishTournament() {
    this.tournament.pipe(take(1)).subscribe((tournament) => {
      console.log(tournament)
      this.tournamentData = tournament
    })
    //get from array of winners the id and rank = index
    const participants = []
    console.log(this.winners)
    this.winners.forEach((winner, index) => {
      participants.push({id: winner?.participant_id ?? winner?.id , rank: index + 1})
    })
    this.store.dispatch(new FinishTournament(this.code, {participants}))

  }

  removeParticipant(index) {
    // const index = this.winners.indexOf(participant)
    this.winners.splice(index, 1)
  }
}
