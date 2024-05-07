import {Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {ManageTournamentState} from "../../state/manage-tournament.state";
import {Observable, Subject} from "rxjs";
import {bounceInDownOnEnterAnimation, bounceInUpAnimation, bounceInUpOnEnterAnimation, bounceOutDownOnLeaveAnimation, fadeInDownOnEnterAnimation, fadeInOnEnterAnimation, flashAnimation, flashOnEnterAnimation, heartBeatOnEnterAnimation, pulseAnimation, pulseOnEnterAnimation, rubberBandAnimation, shakeAnimation, shakeOnEnterAnimation, tadaOnEnterAnimation} from "angular-animations";
import {TournamentProcessState} from "../../../tournament-process/state/tournament-process.state";
import {ActionsExecuting, hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {AddTournament} from "../../../../tournaments/state/tournament.action";
import {GetTournamentAllParticipants, ShuffleSingleBracket} from "../../state/manage-tournament.action";
import {BRACKET_TYPES, STAGES, TOURNAMENT_UPDATE_TYPE} from '../../../../../core/tournament.enum'
import {ActivatedRoute} from '@angular/router'
import {ManageTournamentService} from '../../services/manage-tournament.service'
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-free-for-all-round-robin-elimination',
  templateUrl: './free-for-all-round-robin-elimination.component.html',
  styleUrls: ['./free-for-all-round-robin-elimination.component.scss'],
  animations: [
    // bounceInDownOnEnterAnimation({anchor: 'enter', duration: 800}),
    heartBeatOnEnterAnimation({anchor: 'enter', duration: 1500}),
  ],
})
export class FreeForAllRoundRobinEliminationComponent implements OnInit, OnDestroy {
  @Select(ManageTournamentState.getTournamentAllParticipants) getTournamentAllParticipants$: Observable<any>;
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;
  @Select(ManageTournamentState.getTournamentBracket) getTournamentBracket$: Observable<any>;
  @Select(hasActionsExecuting([GetTournamentAllParticipants])) isGetTournamentAllParticipants$: Observable<ActionsExecuting>;

  tournament: any
  participants: any;
  bracket: any
  isDroppable: boolean
  checkedGroupIndex: number
  selectedPlayersIndexes = []
  selectedPlayers = []
  selectedGroup: any;
  bracketType = BRACKET_TYPES
  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(private route: ActivatedRoute, private manageTournamentService: ManageTournamentService, private store: Store) {

  }

  ngOnInit(): void {
    this.getTournament.pipe(takeUntil(this.unsubscribe$)).subscribe((tournament) => {
      this.tournament = tournament
      this.manageTournamentService.redirectToStageRoute(tournament)
      if (tournament.code) {
        this.getTournamentAllParticipants$.pipe(takeUntil(this.unsubscribe$)).subscribe((res) => {
          if (res.length > 0) {
            this.participants = res;
            this.store.dispatch(new ShuffleSingleBracket(res, BRACKET_TYPES.FREE_FOR_ALL, this.tournament?.tree?.data[0]?.group_settings?.no_of_participants_in_group))
            this.getTournamentBracket$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
              if (data.length > 0) {
                this.bracket = data
                console.log(this.bracket)
              }
            })
          }
        })
      }
    })
  }


  selectParticipant(event, participant, participantIndex, groupIndex, group) {
    // +1 only for check which group is selected not working if you start from 0
    this.checkedGroupIndex = groupIndex + 1
    participant.checked = !participant.checked
    this.selectedGroup = group
    this.selectedPlayers = group.filter((item) => item.checked === true)
    console.log(this.selectedPlayers)
    // return array of indexes of selected players has checked true
    this.selectedPlayersIndexes = this.selectedPlayers.map((item) => group.indexOf(item))
    console.log(this.selectedPlayersIndexes)

    // reset all group state
    if (group.filter((item) => item.checked === true).length === 0) {
      this.checkedGroupIndex = undefined
    }
  }


  convertNumberToLetter(num: number) {
    return String.fromCharCode(65 + num);
  }

  dropPlayers(groupIndex) {
    console.log('here', this.selectedGroup, groupIndex)
    this.bracket[this.checkedGroupIndex - 1] = this.selectedGroup.filter((item, index) => !this.selectedPlayersIndexes.includes(index));
    this.bracket[groupIndex] = this.bracket[groupIndex].concat(this.selectedPlayers)
    // set checked to false for each item moved to the new group
    this.bracket[groupIndex].map((item) => item.checked = false)

    this.checkedGroupIndex = undefined
    this.selectedPlayersIndexes = []
    this.selectedPlayers = []
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
