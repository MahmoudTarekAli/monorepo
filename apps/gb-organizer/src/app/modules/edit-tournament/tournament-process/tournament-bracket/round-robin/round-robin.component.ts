import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {TournamentBracketService} from "../service/tournament-bracket.service";
import {Actions, Select, Store} from "@ngxs/store";
import {ActivatedRoute, Router} from "@angular/router";
import {BRACKET_TYPES, STAGES, TOURNAMENT_UPDATE_TYPE} from "../../../../../core/tournament.enum";
import {TournamentProcessState} from "../../state/tournament-process.state";
import {Observable} from "rxjs";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {UpdateTournament} from "../../state/tournament-process.action";
import {HandleError, SetNotifications} from "../../../../../shared/state/global.action";

@Component({
  selector: 'app-round-robin',
  templateUrl: './round-robin.component.html',
  styleUrls: ['./round-robin.component.scss']
})
export class RoundRobinComponent implements OnInit {
  stage: string
  stageType: string
  tournamentCode: string
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;
  tournament: any;
  roundRobinForm: UntypedFormGroup
  templateName = ''
  isSave = false
  constructor(public tournamentBracketService: TournamentBracketService, private fb: UntypedFormBuilder, private store: Store,
              private router: Router, private activatedRoute: ActivatedRoute,
              private actions$: Actions, private nzNotificationService: NzNotificationService) {
    this.stage = activatedRoute.snapshot.queryParams?.stage
    this.stageType = activatedRoute.snapshot.queryParams?.stageType
  }

  ngOnInit(): void {
    this.roundRobinForm = this.createRoundRobinFormGroup()
    // set value for "stage" form control of first or second stage
    const stage = Object.keys(this.roundRobinForm.controls)[0]
    this.roundRobinForm.get(stage).setValue(this.stageType)

    this.getTournament.subscribe(tournament => {
        this.tournamentCode = tournament?.code;
        if (this.stage === STAGES.FIRST_STAGE && tournament?.tree?.data[0]?.type === BRACKET_TYPES.GROUP_STAGE) {
          this.roundRobinForm.controls.group_settings?.patchValue(tournament?.tree?.data[0]?.group_settings);
        } else if (this.stage === STAGES.SECOND_STAGE && tournament?.tree?.data[1]?.type === BRACKET_TYPES.GROUP_STAGE) {
          this.roundRobinForm.controls.second_group_settings?.patchValue(tournament.tree?.data[1]?.group_settings);
        }
        console.log(this.roundRobinForm.value)
      }
    )

  }


  createRoundRobinFormGroup(): any {
    if (this.stage === STAGES.FIRST_STAGE) {
      return this.fb.group({
        first_stage: ['', [Validators.required]],
        group_settings: this.fb.group({
          // has_away_match: [false, [Validators.required]],
          no_of_participants_in_group: ['', [Validators.required]],
          no_of_qualified_participants: [''],
          points_per_draw: [''],
          points_per_win: [''],
        })
      });
    } else {
      return this.fb.group({
        second_stage: ['', [Validators.required]],
        second_group_settings: this.fb.group({
          // has_away_match: [false, [Validators.required]],
          no_of_participants_in_group: ['', [Validators.required]],
          no_of_qualified_participants: [''],
          points_per_draw: [''],
          points_per_win: [''],
        })
      });
    }
  }

  getFormGroupName(): any {
    // return key of index 1 that hold group_settings type as first or second stage
    return Object.keys(this.roundRobinForm.controls)[1]
  }
  saveBracketSettings() {
    this.tournamentBracketService.saveBracketSetting(this.templateName, 'round_robin' , this.roundRobinForm.controls[this.stage === STAGES.FIRST_STAGE  ? 'group_settings' : 'second_group_settings'].value )

  }
  openDialogBracket(){
    this.tournamentBracketService.isVisible  = true;
  }
  handleCancel() {
    this.tournamentBracketService.isVisible = false;
  }
  updateBracket() {

    this.tournamentBracketService.updateBracket(this.roundRobinForm.value, this.tournamentCode).subscribe(bracket => {
      this.isSave = true

      this.store.dispatch(new UpdateTournament(bracket.data, this.tournamentCode, TOURNAMENT_UPDATE_TYPE.BRACKET_TOURNAMENT_UPDATE))
      this.router.navigate(['tournament/' + this.tournamentCode + '/process/tournament-bracket'])

    }, error => {
      this.store.dispatch(new HandleError(error))

    })
  }
}
