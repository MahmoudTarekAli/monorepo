import {Component, HostListener, OnDestroy, OnInit} from '@angular/core'
import {UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms'
import {Actions, Select, Store} from '@ngxs/store'
import {ActivatedRoute, Router} from '@angular/router'
import {TournamentBracketService} from '../service/tournament-bracket.service'
import {TournamentProcessState} from '../../state/tournament-process.state'
import {Observable} from 'rxjs'
import {NzNotificationService} from 'ng-zorro-antd/notification'
import {UpdateTournament} from '../../state/tournament-process.action'
import {BRACKET_TYPES, STAGES, TOURNAMENT_UPDATE_TYPE} from '../../../../../core/tournament.enum'
import {fadeInDownOnEnterAnimation, fadeOutUpOnLeaveAnimation} from "angular-animations";
import {HandleError, SetNotifications} from "../../../../../shared/state/global.action";

@Component({
  selector: 'app-free-for-all',
  templateUrl: './free-for-all.component.html',
  styleUrls: ['./free-for-all.component.scss'],
  animations: [
    fadeInDownOnEnterAnimation({anchor: 'enter', duration: 200, translate: '30px'}),
    fadeOutUpOnLeaveAnimation({anchor: 'leave', duration: 200, translate: '30px'}),
  ],
})
export class FreeForAllComponent implements OnInit , OnDestroy {
  freeForAllForm: UntypedFormGroup
  aggregatedChecked = false
  stage: string
  stageType: string
  ranks = []
  rankPoints = []
  isSave = false
  stages = STAGES
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>;
  tournament: any;
  maxRank
  rangeArray = []
  isLeaving = true
  isVisible = false;
  isConfirmLoading = true
  templateName = '';
  constructor(public tournamentBracketService: TournamentBracketService, private fb: UntypedFormBuilder, private store: Store,
              private router: Router, private activatedRoute: ActivatedRoute,
              private actions$: Actions, private nzNotificationService: NzNotificationService) {
    this.stage = activatedRoute.snapshot.queryParams?.stage
    this.stageType = activatedRoute.snapshot.queryParams?.stageType
  }

  ngOnInit(): void {
    for (let option = 1; option <= 100; option++) {
      this.ranks.push(option);
    }
    this.freeForAllForm = this.createBracketFormGroup()
    // set value for "stage" form control of first or second stage
    const stage = Object.keys(this.freeForAllForm.controls)[0]
    this.freeForAllForm.get(stage).setValue(this.stageType)
    console.log(this.freeForAllForm.value)
    console.log(this.stage, this.stageType)
    console.log(this.getFormGroupName()?.no_of_participants_in_group?.value)

    this.getTournament.subscribe(tournament => {
      if (tournament.code) {
        this.tournament = tournament;
        if (this.stage === STAGES.FIRST_STAGE && tournament?.tree?.data[0]?.type === BRACKET_TYPES.FREE_FOR_ALL) {
          if (this.isSave === false) {
            this.patchValueRankingPoints(tournament?.tree?.data[0]?.group_settings)
          }
          this.freeForAllForm.controls.group_settings?.patchValue(tournament?.tree?.data[0]?.group_settings);
          tournament?.tree?.data[0].group_settings.number_of_matches > 2 ? this.aggregatedChecked = true : this.aggregatedChecked = false;
          this.isLeaving = true
          // console.log(this.isLeaving)
        } else if (this.stage === STAGES.SECOND_STAGE && tournament?.tree?.data[1]?.type === BRACKET_TYPES.FREE_FOR_ALL) {
          this.freeForAllForm.controls.second_group_settings?.patchValue(tournament.tree?.data[1]?.group_settings);
          this.aggregatedChecked = tournament?.tree?.data[1].group_settings.number_of_matches > 1;
          this.patchValueRankingPoints(tournament?.tree?.data[1]?.group_settings)

          console.log(this.freeForAllForm.value)
          console.log(tournament.tree?.data[1]?.group_settings)

        }
      }

    })
    this.freeForAllForm.controls[this.getGroupSetting()]['controls'].rank_points.valueChanges.subscribe((value) => {
      // console.log('here')
      this.isLeaving = false;
      // console.log(this.isLeaving)
    })
  }

  patchValueRankingPoints(data , stage?) {
    // console.log(data)
    let control: any;
    if (stage){
      this.freeForAllForm.controls?.second_group_settings.get('rank_points').patchValue(data.rank_points);
      console.log('heree')
    }
    control = (this.freeForAllForm.controls[this.getGroupSetting()]?.get('rank_points') as UntypedFormArray);
    const rankObject = {};
    data.rank_points.forEach(
      (rank_point, i) => {
        rankObject['key_' + rank_point] =
          (rankObject['key_' + rank_point] || 0) + 1;
      }
    );
    const rankArray: any = Object.entries(rankObject);
    let sumRank = 0;
    rankArray.forEach((key, i) => {
      // console.log(key, i)
      control.push(
        this.fb.group({
          fromRank: this.getFromRankValue(rankArray, i, sumRank),
          toRank: this.getToRankValue(rankArray, i),
          points: parseInt(key[0].replace('key_', '')),
        })
      );
      sumRank += rankArray[i][1];

    })

  }

  createBracketFormGroup(): any {
    if (this.stage === STAGES.FIRST_STAGE) {
      return this.fb.group({
        first_stage: ['', [Validators.required]],
        group_settings: this.fb.group({
          no_of_participants_in_group: ['', [Validators.required]],
          no_of_qualified_participants: ['', [Validators.required]],
          points_per_kill: [''],
          // if aggregated selected
          number_of_matches: [''],
          // this should be formarray
          rank_points: this.fb.array([]),
        })
      });
    } else {
      return this.fb.group({
        second_stage: ['', [Validators.required]],
        second_group_settings: this.fb.group({
          no_of_participants_in_group: ['', [Validators.required]],
          no_of_qualified_participants: ['', [Validators.required]],
          points_per_kill: [''],
          // if aggregated selected
          number_of_matches: [''],
          // this should be formarray
          rank_points: this.fb.array([]),
        })
      });
    }
  }

  getFormGroupName(): any {
    // return key of index 1 that hold group_settings type as first or second stage
    if (this.freeForAllForm?.controls) {
      return Object.keys(this.freeForAllForm?.controls)[1]
    }
  }

  getGroupSetting() {
    if (this.stage === STAGES.FIRST_STAGE) {
      return 'group_settings'
    } else {
      return 'second_group_settings'
    }
  }

  getPointValue() {
    return (this.freeForAllForm.controls[this.getGroupSetting()]?.get('rank_points') as UntypedFormArray);
  }

  addPointValue() {
    // console.log(this.freeForAllForm.controls)
    const control = (this.freeForAllForm.controls[this.getGroupSetting()].get('rank_points') as UntypedFormArray)
    control.push(this.fb.group({
        points: [0],
        fromRank: [''],
        toRank: [''],
      })
    );
    this.freeForAllForm.controls?.[this.getGroupSetting()].get('rank_points')?.['controls']?.[control.controls.length - 1]?.controls.fromRank.setValue(this.getRankError(control.controls.length - 1))
    this.rangeArray = Array(control.length)
  }
  removePointValue(index) {
    const control = (this.freeForAllForm.controls[this.getGroupSetting()].get('rank_points') as UntypedFormArray)
    control.removeAt(index);
    this.rangeArray = Array(control.length)
  }
  getStageRankPoints() {
    this.freeForAllForm.controls[this.getGroupSetting()]['controls'].rank_points.value.forEach((rank, index) => {
      for (let Rank = parseInt(rank.fromRank); Rank <= parseInt(rank.toRank); Rank++) {
        const tempRank = {};
        tempRank[Rank - 1] = parseInt(rank.points);
        this.rankPoints = Object.assign(this.rankPoints, tempRank);
      }
      if (this.rankPoints.length > rank.toRank) {
        this.rankPoints.splice(rank.toRank, this.rankPoints.length - rank.toRank)
      }
      // console.log(this.rankPoints)
    });
  }

  getRankError(index) {
    this.maxRank = null
    if (this.getPointValue().value[index].fromRank <= this.getPointValue().value[index - 1]?.toRank) {
      this.maxRank = this.getPointValue().value[index - 1]?.toRank + 1
      // this.getPointValue().value[index - 1].error = true
      // this.getPointValue()?.['controls']?.[index]?.controls.hasError.setValue(true)
      this.rangeArray[index] = 'disable'
    } else {
      // this.getPointValue().value[index - 1].error = false
      // this.getPointValue()?.['controls']?.[index]?.controls.hasError.setValue(false)

      this.rangeArray[index] = 'enable'
    }
    return this.maxRank;

  }

  getToRankValue(ranks, index) {
    let returnedValue = 0;
    // console.log(ranks)

    for (let i = 0; i <= index; i++) {
      returnedValue += ranks[i][1];
      // console.log(ranks[i][1])

    }
    // console.log(returnedValue)
    return returnedValue;
  }

  getFromRankValue(ranks, index, sum) {
    let returnedValue;
    if (index === 0) {
      returnedValue = 1;
    } else {
      returnedValue = 1 + sum;
    }
    return returnedValue;
  }

  cancelToRank(index, item) {
    const points = this.getPointValue()
    console.log(item)
    points.at(index).patchValue({
      toRank:
        item.value.toRank !== item.value.fromRank
          ? item.value.fromRank
          : item.value.fromRank + 1
    });
  }

  updateBracket() {
    this.getStageRankPoints()
    if (this.freeForAllForm.controls[this.getGroupSetting()].value?.rank_points) {
      this.freeForAllForm.controls[this.getGroupSetting()].value.rank_points = Array.from(this.rankPoints, item => item || 0)
    }
    if (this.aggregatedChecked === false) {
      delete this.freeForAllForm.controls[this.getGroupSetting()].value.number_of_matches
    }
    Object.keys(this.freeForAllForm.value).forEach(key => {
      if (this.freeForAllForm.value[key] === '' || this.freeForAllForm.value[key] === null) {
        delete this.freeForAllForm.value[key];
      }
    });

    this.tournamentBracketService.updateBracket(this.getFreeForAllFormValues(), this.tournament.code).subscribe(bracket => {
      this.isSave = true
      console.log(bracket)
      this.store.dispatch(new UpdateTournament(bracket.data, this.tournament.code, TOURNAMENT_UPDATE_TYPE.BRACKET_TOURNAMENT_UPDATE))
      this.router.navigate(['tournament/' + this.tournament?.code + '/process/tournament-bracket'])

      this.isLeaving = true
    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }

  getFreeForAllFormValues() {
    if (this.stage === STAGES.SECOND_STAGE && this.tournament?.tree?.data[0]) {
      return {
        first_stage: this.tournament.tree.data[0].type,
        group_settings: this.tournament?.tree?.data[0]?.group_settings,
        second_stage: this.freeForAllForm.value.second_stage,
        second_group_settings: this.freeForAllForm.value.second_group_settings
      }
    } else if (this.stage === STAGES.FIRST_STAGE && this.tournament?.tree?.data[1]) {
      return {
        first_stage: this.freeForAllForm.value.first_stage,
        group_settings: this.freeForAllForm?.value?.group_settings,
        second_stage: this.tournament.tree.data[1].type,
        second_group_settings: this.tournament?.tree?.data[1]?.group_settings
      }
    } else {
      return this.freeForAllForm.value
    }
  }
  saveBracketSettings() {
    this.tournamentBracketService.saveBracketSetting(this.templateName, 'free_for_all' , this.freeForAllForm.controls[this.getGroupSetting()].value )

  }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // returns false if user added changes to score and navigated to a different route without saving changes
    console.log(this.isLeaving)
    return this.isLeaving
  }
  ngOnDestroy() {
  }
  openDialogBracket(){
    this.tournamentBracketService.isVisible  = true;
  }
  handleCancel() {
    this.tournamentBracketService.isVisible = false;
  }
}
