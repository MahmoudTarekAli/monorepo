import {Component, Input} from '@angular/core';
import {
  AsyncPipe,
  CommonModule,
  DatePipe, LowerCasePipe, NgClass,
  NgIf,
  NgOptimizedImage, NgStyle,
  NgTemplateOutlet,
  UpperCasePipe
} from "@angular/common";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {Challenge} from "../../models/challenge";
import {MarqueeComponent} from "../marquee/marquee.component";
import {RouterLink} from "@angular/router";
import {CountdownPipe} from "../../pipes/countdown.pipe";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {TimeAgoExtendsPipe} from "../../pipes/timeAgo.pipe";
import {FormatCoinsPipe} from "../../pipes/format-coins.pipe";
import {CHALLENGES_STATUS} from "../../../modules/challenges/challenges.enum";
import {UserTimezoneComponent} from "../../../components/user-timezone/user-timezone.component";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-challenge-card',
  templateUrl: './challenge-card.component.html',
  standalone: true,
  imports: [
    NzCardModule,
    NgOptimizedImage,
    NgTemplateOutlet,
    NzTagModule,
    NgIf,
    NzToolTipModule,
    NzBadgeModule,
    NzAvatarModule,
    MarqueeComponent,
    UpperCasePipe,
    DatePipe,
    RouterLink,
    CountdownPipe,
    AsyncPipe,
    TimeAgoExtendsPipe,
    FormatCoinsPipe,
    LowerCasePipe,
    UserTimezoneComponent,
    TranslateModule,
    NgClass,
    NgStyle,
  ],
  styleUrls: ['./challenge-card.component.scss']
})
export class ChallengeCardComponent {
  @Input() challenge: Challenge
  @Input() isFeatured = true
  @Input() challengeQueryParam = ''
  CHALLENGE_STATUS = CHALLENGES_STATUS
  constructor() {
    console.log(this.challengeQueryParam)
  }

}
