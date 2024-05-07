import {Component, Input, OnInit} from '@angular/core';
import {ButtonComponent} from "../../../components/button/button.component";
import {DatePipe, LowerCasePipe, NgClass, NgIf} from "@angular/common";
import {MarqueeComponent} from "../marquee/marquee.component";
import {DefaultImagePipe} from "../../pipes/default-image.pipe";
import {RouterLink} from "@angular/router";
import {RemoveSpacesPipe} from "../../pipes/remove-spaces.pipe";
import {UserTimezoneComponent} from "../../../components/user-timezone/user-timezone.component";
import {TranslateModule} from "@ngx-translate/core";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";


@Component({
  selector: 'app-match-bar',
  templateUrl: './match-bar.component.html',
  styleUrls: ['./match-bar.component.scss'],
  imports: [
    ButtonComponent,
    DatePipe,
    MarqueeComponent,
    DefaultImagePipe,
    RouterLink,
    LowerCasePipe,
    RemoveSpacesPipe,
    NgClass,
    NgIf,
    UserTimezoneComponent,
    TranslateModule,
    NzToolTipModule
  ],
  standalone: true
})
export class MatchBarComponent implements OnInit{
  @Input() match:any;
  @Input() status: any;
  constructor() {}
  ngOnInit() {
  }
}
