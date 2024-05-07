import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {TournamentBracketService} from "../service/tournament-bracket.service";
import {Actions, Select, Store} from "@ngxs/store";
import {ActivatedRoute, Router} from "@angular/router";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UpdateTournament} from "../../state/tournament-process.action";
import {TournamentProcessState} from "../../state/tournament-process.state";
import {Observable} from "rxjs";
import {BRACKET_TYPES, STAGES, TOURNAMENT_UPDATE_TYPE} from '../../../../../core/tournament.enum'
import {HandleError, SetNotifications} from "../../../../../shared/state/global.action";

@Component({
  selector: 'app-single-elimination',
  templateUrl: './single-elimination.component.html',
  styleUrls: ['./single-elimination.component.scss']
})
export class SingleEliminationComponent implements OnInit {
  singleEliminationForm: UntypedFormGroup
  tournament: any
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;
  stage: string
  stageType: string

  constructor(private tournamentBracketService: TournamentBracketService, private fb: UntypedFormBuilder, private store: Store,
              private router: Router, private activatedRoute: ActivatedRoute,
              private actions$: Actions, private nzNotificationService: NzNotificationService) {
    this.stage = activatedRoute.snapshot.queryParams?.stage
    this.stageType = activatedRoute.snapshot.queryParams?.stageType

  }

  ngOnInit(): void {
    this.singleEliminationForm = this.fb.group({
      [this.stage]: [BRACKET_TYPES.SINGLE_ELIMINATION],
      has_third_place: [false, [Validators.required]],
    });
    this.getTournament.subscribe(tournament => {
      this.tournament = tournament
      if (this.tournament?.stage_type === BRACKET_TYPES.SINGLE_ELIMINATION) {
        this.singleEliminationForm.get('has_third_place').setValue(tournament?.has_third_place)
      }
    })
  }

  updateBracket() {
    if (this.tournament.code) {
      let data = {}
      if (this.stage === STAGES.SECOND_STAGE && this.tournament.tree.data[0]) {
        data = {
          first_stage: this.tournament.tree.data[0].type,
          group_settings: this.tournament?.tree?.data[0]?.group_settings,
          second_stage: this.singleEliminationForm.value[this.stage],
          has_third_place: this.singleEliminationForm.value.has_third_place,
        }
        console.log(data)
      } else {
        data = this.singleEliminationForm.value
      }
      this.tournamentBracketService.updateBracket(data, this.tournament.code).subscribe(bracket => {
        this.store.dispatch(new UpdateTournament(bracket.data, this.tournament.code, TOURNAMENT_UPDATE_TYPE.BRACKET_TOURNAMENT_UPDATE))
        this.router.navigate(['tournament/' + this.tournament?.code + '/process/tournament-bracket'])
      }, error => {
        this.store.dispatch(new HandleError(error))

      })
    }
  }

}
