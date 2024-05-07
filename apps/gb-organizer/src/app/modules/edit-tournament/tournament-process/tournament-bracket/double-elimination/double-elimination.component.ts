import {Component, OnInit} from '@angular/core';
import {BRACKET_TYPES, STAGES, TOURNAMENT_UPDATE_TYPE} from "../../../../../core/tournament.enum";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {TournamentBracketService} from "../service/tournament-bracket.service";
import {Actions, Select, Store} from "@ngxs/store";
import {ActivatedRoute, Router} from "@angular/router";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {TournamentProcessState} from "../../state/tournament-process.state";
import {Observable} from "rxjs";
import {UpdateTournament} from "../../state/tournament-process.action";

@Component({
  selector: 'app-double-elimination',
  templateUrl: './double-elimination.component.html',
  styleUrls: ['./double-elimination.component.scss']
})
export class DoubleEliminationComponent implements OnInit {
  doubleEliminationForm: UntypedFormGroup
  stage: string
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;
  tournament: any

  constructor(private tournamentBracketService: TournamentBracketService, private fb: UntypedFormBuilder, private store: Store,
              private router: Router, private activatedRoute: ActivatedRoute,
              private actions$: Actions, private nzNotificationService: NzNotificationService) {
    this.stage = activatedRoute.snapshot.queryParams?.stage
  }

  ngOnInit(): void {
    this.doubleEliminationForm = this.fb.group({
      [this.stage]: [BRACKET_TYPES.DOUBLE_ELIMINATION],
    });
    this.getTournament.subscribe(tournament => {
      this.tournament = tournament
    })
  }

  updateBracket() {
    if (this.tournament.code) {
      let data = {}
      if (this.stage === STAGES.SECOND_STAGE && this.tournament.tree.data[0]) {
        data = {
          first_stage: this.tournament.tree.data[0].type,
          group_settings: this.tournament?.tree?.data[0]?.group_settings,
          second_stage: this.doubleEliminationForm.value[this.stage],
        }
      } else {
        data = this.doubleEliminationForm.value
      }
      this.tournamentBracketService.updateBracket(data, this.tournament.code).subscribe(bracket => {
        this.store.dispatch(new UpdateTournament(bracket.data, this.tournament.code, TOURNAMENT_UPDATE_TYPE.BRACKET_TOURNAMENT_UPDATE))
        this.router.navigate(['tournament/' + this.tournament?.code + '/process/tournament-bracket'])

      })
    }
  }

}
