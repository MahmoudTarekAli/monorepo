import {Component, Input} from '@angular/core';
import {CommonModule, DatePipe, LowerCasePipe, NgIf, NgOptimizedImage, NgTemplateOutlet} from "@angular/common";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {Tournament} from "../../models/tournament";
import {MarqueeComponent} from "../marquee/marquee.component";
import {RouterLink} from "@angular/router";
import {DefaultImagePipe} from "../../pipes/default-image.pipe";
import {ResponsiveImagePipe} from "../../pipes/responsive-image.pipe";
import {FormatCoinsPipe} from "../../pipes/format-coins.pipe";
import {UserTimezoneComponent} from "../../../components/user-timezone/user-timezone.component";
import {FilterPipe} from "../../pipes/arena-router.pipe";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-tournament-card',
  templateUrl: './tournament-card.component.html',
  standalone: true,
    imports: [
        NzCardModule,
        NgOptimizedImage,
        NgTemplateOutlet,
        NzTagModule,
        NgIf,
        NzBadgeModule,
        NzAvatarModule,
        MarqueeComponent,
        DatePipe,
        NzToolTipModule,
        RouterLink,
        ResponsiveImagePipe,
        DefaultImagePipe,
        FormatCoinsPipe,
        LowerCasePipe,
        UserTimezoneComponent,
        FilterPipe,
        TranslateModule
    ],
  styleUrls: ['./tournament-card.component.scss']
})
export class TournamentCardComponent {
  @Input() tournament: Tournament
}
