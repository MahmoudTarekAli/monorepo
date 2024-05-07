import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {UpdateMatchScore} from "../../../modules/tournament/match-list/state/match-list.action";
import {GlobalService} from "../../service/global.service";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {TruncatePipe} from "../../pipes/truncate.pipe";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {NzImageModule} from "ng-zorro-antd/image";
import {ButtonComponent} from "../../../components/button/button.component";
import {HandleError, SetNotifications} from "../../state/global.action";
import {TranslateModule} from "@ngx-translate/core";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NgScrollbar} from "ngx-scrollbar";

@Component({
  selector: 'app-set-score',
  templateUrl: './set-score.component.html',
  styleUrls: ['./set-score.component.scss'],
  imports: [
    NzAvatarModule,
    NzInputNumberModule,
    ReactiveFormsModule,
    NzCollapseModule,
    TruncatePipe,
    DatePipe,
    NgClass,
    NzImageModule,
    NgIf,
    NgForOf,
    ButtonComponent,
    TranslateModule,
    NzButtonModule,
    NzIconModule,
    NgScrollbar,
  ],
  standalone: true
})
export class SetScoreComponent implements OnInit {
  @Input() match?: any;
  @Input() groupIndex?: any;
  @Input() component?: any;
  @Input() participantsType?: any;
  setScoreForm: FormGroup
  homeClaim
  awayClaim
  file: any;
  imgURL: any;
  constructor(private fb: FormBuilder, public modal: NzModalRef, private store: Store, private actions$: Actions, private globalService: GlobalService) {
    this.setScoreForm = fb.group({
      score_home: ['', [Validators.required]],
      score_away: ['', [Validators.required]],
      side: [''],
    })
  }
  @ViewChild('file1Input') file1Input;

  ngOnInit(): void {
    console.log(this.match)
    this.setMatchValue()
    if (this.participantsType === 'teams') {
      this.homeClaim = this.match?.claims?.filter(claim => claim?.claimer_id === this.match?.home?.original?.leader.id)[0]
      this.awayClaim = this.match?.claims?.filter(claim => claim?.claimer_id === this.match?.away?.original?.leader.id)[0]
    } else {
      this.homeClaim = this.match?.claims?.filter(claim => claim?.claimer_id === this.match?.home?.original?.id)[0]
      this.awayClaim = this.match?.claims?.filter(claim => claim?.claimer_id === this.match?.away?.original?.id)[0]
    }
  }

  submitScore() {
    // console.log(this.match, this.setScoreForm.value, this.stage, this.roundOrGroup, this.roundOrGroup)
    this.setScoreForm.value.side = this.setScoreForm.value.score_home > this.setScoreForm.value.score_away ? 'home' : 'away'


      this.globalService.matchScore$.next(this.setScoreForm.value)
    this.globalService.postClaimScore(this.match.code, 'SetScore', this.setScoreForm.value.score_home, this.setScoreForm.value.score_away, this.setScoreForm.value.side,
      this.file)
      .subscribe(response => {
          this.store.dispatch(new SetNotifications( 'Success', 'Your claim has been successfully submitted!' , 'success'))
          this.modal.destroy()        },
        error => {
          this.store.dispatch(new HandleError(error))
        });
  }

  setMatchValue() {
    this.setScoreForm.get('score_home')?.setValue(this.match?.home?.score)
    this.setScoreForm.get('score_away')?.setValue(this.match?.away?.score)
  }
  previewImages(event) {
    const files = event.target.file;
    console.log(files, event.target)
      // const file = files[i];
      // this.files.push(file);
      // const reader = new FileReader();
      // reader.onload = e => this.imageSrcs.push(reader.result as string);
      // reader.readAsDataURL(file);
    this.file1Input.nativeElement.value = '';

  }

  onChange(event) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      this.imgURL = reader.result as string;
    }
    reader.readAsDataURL(this.file);
  }

}
