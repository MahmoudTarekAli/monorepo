import {Component, OnInit} from '@angular/core';
import {ManageTournamentService} from "../../services/manage-tournament.service";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {ManageTournamentState} from "../../state/manage-tournament.state";
import {Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {GetTournamentAllParticipants} from "../../state/manage-tournament.action";
import {BRACKET_TYPES, STAGES, STAGES_MATCHES_TYPES, STAGES_TYPES} from "../../../../../core/tournament.enum";
import {TournamentProcessState} from "../../../tournament-process/state/tournament-process.state";
import {ActionsExecuting, hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {SharedService} from "../../../service/shared.service";
import {Router} from "@angular/router";
import {GetMatches} from "../../match-list/state/match-list.action";
import {GetLoserTree, GetTree, GetWinnerTree} from "../state/brackets-view.action";
import {BracketViewState} from "../state/bracket-view.state";

@Component({
  selector: 'app-single-double-bracket-view',
  templateUrl: './single-double-bracket-view.component.html',
  styleUrls: ['./single-double-bracket-view.component.scss']
})
export class SingleDoubleBracketViewComponent implements OnInit {
  @Select(ManageTournamentState.getTournamentBracket) getTournamentBracket$: Observable<any>;
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;
  tournament: any
  @Select(hasActionsExecuting([GetTournamentAllParticipants])) isGetTournamentAllParticipants$: Observable<ActionsExecuting>;
  private readonly unsubscribe$: Subject<void> = new Subject();
  @Select(ManageTournamentState.getTournamentAllParticipants) getTournamentAllParticipants$: Observable<any>;
  bracket
  selectedStage = STAGES.FIRST_STAGE
  stagesMatches: any
  stageMatchesType: any
  isStageFreeForAll: boolean
  loading = false
  BRACKET_TYPES = BRACKET_TYPES
  bracketType: string
  @Select(BracketViewState.getMatches) getMatches: Observable<any>
  @Select(BracketViewState.getWinnerMatches) getWinnerMatches: Observable<any>
  @Select(BracketViewState.getLoserMatches) getLoserMatches: Observable<any>
  rounds: any
  stages: any

  constructor(private manageTournamentService: ManageTournamentService, private store: Store, public router: Router,
              private sharedService: SharedService, private actions$: Actions) {
  }

  ngOnInit(): void {
    this.loading = true
    this.store.dispatch(new GetMatches(this.sharedService.tournamentCode, STAGES.FIRST_STAGE))
    console.log('here')
    this.actions$.pipe(ofActionSuccessful(GetMatches)).subscribe((action) => {
      this.store.select(state => state.match_list).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
        console.log(data)
        this.stagesMatches = data;
        console.log(this.stagesMatches)
        this.stages = data.stages
        console.log(this.stagesMatches)
        this.bracketType = data[this.stageMatchesType].type
        console.log(this.stages[this.selectedStage]?.groups)
        this.changeRoundFormat(this.stages[this.selectedStage]?.groups)
      })
    })
  }

  changeRoundFormat(rounds) {
    console.log(rounds)
    if (this.bracketType === BRACKET_TYPES.DOUBLE_ELIMINATION) {
      if (rounds) {
        rounds.upper = rounds.map((round) => {
          return round.winners_matches
        })
        rounds.lower = rounds.map((round) => {
          return round.losers_matches
        })
        this.rounds = {
          upper: rounds.upper.flat(1),
          lower: rounds.lower.flat(1)
        }
        console.log(this.rounds)

      }
    } else {
      rounds.matches = rounds.map((round) => {
        return round.matches
      })
      this.rounds = rounds.matches.flat(1)
      console.log(this.rounds)
    }
  }
}
