import {Component, OnInit} from '@angular/core';
import {Select, Store} from "@ngxs/store";
import {TournamentProcessState} from "../state/tournament-process.state";
import {Observable} from "rxjs";
import {TournamentBracketService} from "./service/tournament-bracket.service";
import {BRACKET_TYPES, STAGES, TOURNAMENT_UPDATE_TYPE} from '../../../../core/tournament.enum';
import {fadeInDownOnEnterAnimation, fadeOutUpOnLeaveAnimation} from "angular-animations";
import {UpdateTournament} from "../state/tournament-process.action";
import {HandleError} from "../../../../shared/state/global.action";

@Component({
  selector: 'app-tournament-bracket',
  templateUrl: './tournament-bracket.component.html',
  styleUrls: ['./tournament-bracket.component.scss'],
  animations: [
    fadeInDownOnEnterAnimation({anchor: 'enter', duration: 1000, translate: '30px'}),
  ],
})
export class TournamentBracketComponent implements OnInit {
  bracketTypes = [
    {title: 'single_elimination', url: 'single-elimination', key: BRACKET_TYPES.SINGLE_ELIMINATION, text: 'single_elimination_text', icon:'single-elim-icon'},
    {title: 'double_elimination', url: 'double-elimination', key: BRACKET_TYPES.DOUBLE_ELIMINATION,  text: 'double_elimination_text', icon:'double-elimination-icon'},
    {title: 'free_for_all', url: 'free-for-all', key: BRACKET_TYPES.FREE_FOR_ALL,  text: 'free_for_all_text', icon:'free-for-all-icon'},
    {title: 'round_robin', url: 'round-robin', key: BRACKET_TYPES.GROUP_STAGE,  text: 'round_robin_text', icon:'round-robin-icon'},
  ];
  hasSecondStage = false
  addSecondStage: boolean
  tournament: any;
  STAGES = STAGES;
  BRACKET_TYPES = BRACKET_TYPES;
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;

  constructor(private tournamentBracketService: TournamentBracketService , private store: Store) {
    this.getTournament.subscribe(tournament => {
      if (tournament?.code) {
        this.tournament = tournament
        this.hasSecondStage = tournament?.tree?.data?.length > 0 && (tournament?.tree?.data[0]?.type === BRACKET_TYPES.GROUP_STAGE || tournament?.tree?.data[0]?.type === BRACKET_TYPES.FREE_FOR_ALL || tournament?.tree?.data[0]?.type === BRACKET_TYPES.ROUND_ROBIN)
        console.log(this.hasSecondStage)
      }
    })

  }

  ngOnInit(): void {
  }
removeSecondStage() {
    const payload = {first_stage: this.tournament.tree.data[0].type , group_settings: this.tournament.tree.data[0].group_settings, second_stage: null}
    this.tournamentBracketService.updateBracket(payload, this.tournament.code).subscribe(bracket => {
    this.store.dispatch(new UpdateTournament(bracket.data, this.tournament.code, TOURNAMENT_UPDATE_TYPE.REMOVE_SECOND_STAGE))

  }, error => {
    this.store.dispatch(new HandleError(error))

  })

}

}
