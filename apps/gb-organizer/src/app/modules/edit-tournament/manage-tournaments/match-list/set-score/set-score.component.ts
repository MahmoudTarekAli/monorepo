import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {UpdateMatchScore} from "../state/match-list.action";
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {UpdateMatchScoreClaims} from "../../issues-claims/state/issues-claims.action";
import {GlobalService} from "../../../../../shared/services/global.service";

@Component({
  selector: 'app-set-score',
  templateUrl: './set-score.component.html',
  styleUrls: ['./set-score.component.scss']
})
export class SetScoreComponent implements OnInit {
  @Input() match?: any;
  @Input() roundOrGroup?: any;
  @Input() stage?: any;
  @Input() roundIndex?: any;
  @Input() selectedBracketMatchType: any;
  @Input() groupIndex?: any;
  @Input() component?: any;
  @Input() participantsType?: any;
  setScoreForm: UntypedFormGroup
  homeClaim
  awayClaim

  constructor(private fb: UntypedFormBuilder, public modal: NzModalRef, private store: Store, private actions$: Actions, private globalService: GlobalService) {
    this.setScoreForm = fb.group({
      score_home: ['', [Validators.required]],
      score_away: ['', [Validators.required]],
      side: [''],
    })
  }

  ngOnInit(): void {
    console.log(this.match)
    this.setMatchValue()
    // console.log(this.match)
    if (this.participantsType === 'teams') {
      this.homeClaim = this.match?.claims?.filter(claim => claim?.claimer_id === this.match?.home?.original?.leader.id)[0]
      this.awayClaim = this.match?.claims?.filter(claim => claim?.claimer_id === this.match?.away?.original?.leader.id)[0]
    } else {
      this.homeClaim = this.match?.claims?.filter(claim => claim?.claimer_id === this.match?.home?.original?.id)[0]
      this.awayClaim = this.match?.claims?.filter(claim => claim?.claimer_id === this.match?.away?.original?.id)[0]
    }
    // console.log(this.homeClaim)
  }

  submitScore() {
    // console.log(this.match, this.setScoreForm.value, this.stage, this.roundOrGroup, this.roundOrGroup)
    this.setScoreForm.value.side = this.setScoreForm.value.score_home > this.setScoreForm.value.score_away ? 'home' : 'away'

    if (this.component === 'issues_claims') {
      this.store.dispatch(new UpdateMatchScoreClaims(this.match, this.setScoreForm.value))
      this.actions$.pipe(ofActionSuccessful(UpdateMatchScoreClaims)).subscribe((data) => this.modal.destroy())
    } else {
      this.globalService.matchScore$.next(this.setScoreForm.value)
      // console.log(this.selectedBracketMatchType, this.match, this.setScoreForm.value, this.stage, this.roundOrGroup, this.roundOrGroup === 'rounds' ? this.roundIndex : this.groupIndex)
      this.store.dispatch(new UpdateMatchScore(this.selectedBracketMatchType, this.match, this.setScoreForm.value, this.stage, this.roundOrGroup, this.roundOrGroup === 'rounds' ? this.roundIndex : this.groupIndex))
      this.actions$.pipe(ofActionSuccessful(UpdateMatchScore)).subscribe((data) => this.modal.destroy())
    }
  }

  setMatchValue() {
    this.setScoreForm.get('score_home')?.setValue(this.match?.home?.score)
    this.setScoreForm.get('score_away')?.setValue(this.match?.away?.score)
  }
}
