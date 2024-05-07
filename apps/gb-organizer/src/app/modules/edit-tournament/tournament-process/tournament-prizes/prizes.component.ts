import {Component, HostListener, OnInit} from '@angular/core';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms'
import {UpdateTournament} from '../state/tournament-process.action'
import {Actions, ofActionSuccessful, Select, Store} from '@ngxs/store'
import {TournamentProcessState} from '../state/tournament-process.state'
import {Observable} from 'rxjs'
import {fadeInDownOnEnterAnimation, fadeOutUpOnLeaveAnimation} from "angular-animations";

@Component({
  selector: 'app-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.scss'],
  animations: [
    fadeInDownOnEnterAnimation({anchor: 'enter', duration: 400, translate: '30px'}),
    fadeOutUpOnLeaveAnimation({anchor: 'leave', duration: 400, translate: '30px'}),
  ],
})
export class PrizesComponent implements OnInit  {
  PrizesForm: UntypedFormGroup;
  prizesOrder = [];
  @Select(TournamentProcessState.getTournament) getTournament: Observable<any>
  tournamentCode
  isSave = false
  maxRank
  rangeArray = []
  isLeaving = true
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // returns false if user added changes to score and navigated to a different route without saving changes
    console.log(this.isLeaving)
    return this.isLeaving
  }
  constructor(private fb: UntypedFormBuilder, private store: Store , private actions$: Actions) {
    this.PrizesForm = fb.group({
      prizes: fb.array([] , Validators.required)
      // leaderboard_auto_calculate: [false , Validators.compose([Validators.required])],
    });
  }

  getPrizesValue(): UntypedFormArray {
    // console.log(this.PrizesForm.get('prizes') as FormArray)
    return this.PrizesForm.get('prizes') as UntypedFormArray
  }

  ngOnInit(): void {

    // console.log(range(1 , 10 , 1))
    this.getTournament.subscribe(res => {
      if ( res?.code){
        this.tournamentCode = res?.code;
        // console.log(res)
        if (this.isSave === false) {
          if (res?.prizes) {
            res?.prizes?.forEach((group, i) => {
              // if (res?.prizes?.length - 1 !== i) {
              this.addPrizeValue(true);
              // }
              const y = this.getPrizesValue().at(i) as UntypedFormGroup;
              // console.log(y, i);
              y.patchValue(group);
              res?.prizes[i]?.prizes.forEach((options, j) => {
                // console.log(options, j)
                this.appendOptionsToGroupsControl(i);
                const z = this.getOptionsGroupsControl(i).at(j) as UntypedFormGroup;
                z.patchValue(options)
              });
            });
            this.isLeaving = true
          }
          else {
            this.addPrizeValue();
            this.isLeaving = true
          }
        }
      }

    })
    for (let option = 1; option <= 50; option++) {
      this.prizesOrder.push(option);
    }
    this.PrizesForm.valueChanges.subscribe((res) => {
      this.isLeaving = false
    })
  }
  // getRange(start, stop, step) {
  //   return Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
  // }
  addPrizeValue(edit?) {
    const control = (this.PrizesForm.controls.prizes as UntypedFormArray)
    control.push(
      this.fb.group({
        from: ['' , Validators.required],
        to: '',
        prizes: this.fb.array([])
      })
    );
    if (!edit) {
      this.appendOptionsToGroupsControl(control.controls.length - 1)
    }
    // console.log(this.PrizesForm.controls.prizes?.['controls']?.[control.controls.length - 1]?.controls.from)
    this.PrizesForm.controls.prizes?.['controls']?.[control.controls.length - 1]?.controls.from.setValue(this.getRankError(control.controls.length - 1 ))
    this.rangeArray = Array(control.length)
  }
  getRankError(index){
    this.maxRank = null
    if (this.PrizesForm.controls.prizes.value[index].from <= this.PrizesForm.controls.prizes.value[index - 1]?.to) {
      this.maxRank = this.PrizesForm.controls.prizes.value[index - 1]?.to + 1
      this.rangeArray[index] = 'disable'

    } else{
      this.rangeArray[index] = 'enable'
    }
    return this.maxRank;

  }
  appendOptionsToGroupsControl(i) {

    // @ts-ignore
    const control = (this.PrizesForm.controls.prizes.controls[i].controls.prizes as UntypedFormArray)
    control.push(this.fb.group({
        type: ['', Validators.required],
        value: ['', Validators.required],
        currency: [''],
        note: [''],
      }),
    )
  }
  cancelToRank(index, item) {
    const points = this.getPrizesValue()
    console.log(item)
    points.at(index).patchValue({
      to:
        item.value.to !== item.value.from
          ? item.value.from
          : item.value.from + 1
    });
  }
  getOptionsGroupsControl(i) {
    // @ts-ignore
    return this.PrizesForm.controls.prizes.controls[i].controls.prizes as UntypedFormArray
  }

  create() {
    Object.keys(this.PrizesForm.value).forEach(key => {
      if (this.PrizesForm.value[key] === '' || this.PrizesForm.value[key] === null) {
        delete this.PrizesForm.value[key];
      }
    })
    this.isSave = true
    this.store.dispatch(new UpdateTournament(this.PrizesForm.value, this.tournamentCode))
    this.actions$.pipe(ofActionSuccessful(UpdateTournament)).subscribe(() => {
      this.isLeaving = true
    })
  }

  removePrizeOption(i, j) {
    this.getOptionsGroupsControl(j).removeAt(i)

  }
  removePrize(i) {
    this.getPrizesValue().removeAt(i)
    const control = (this.PrizesForm.controls.prizes as UntypedFormArray)
    this.rangeArray = Array(control.length)
  }
}

