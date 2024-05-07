import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzModalRef} from "ng-zorro-antd/modal";
import {ParticipantCardComponent} from "../../../shared/components/participant-card/participant-card.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {NzListModule} from "ng-zorro-antd/list";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {CountryPipe} from "../../../shared/pipes/country.pipe";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {UserCardComponent} from "../../../shared/components/user-card/user-card.component";
import {NgScrollbar} from "ngx-scrollbar";

@Component({
  selector: 'app-view-match-details',
  standalone: true,
  imports: [CommonModule, ParticipantCardComponent, ButtonComponent, NzRadioModule, FormsModule, RouterLink, NzCollapseModule, NzListModule, NzAvatarModule, CountryPipe, NzToolTipModule, UserCardComponent, NgScrollbar],
  templateUrl: './view-match-details.component.html',
  styleUrls: ['./view-match-details.component.scss']
})
export class ViewMatchDetailsComponent {
  @Input() match: any;
  @Input() tournament: any;
  teamType = 'home';
  opponentType = 'home'
  constructor( public modal: NzModalRef) { }

  ngOnInit(): void {
    console.log(this.tournament)
    const user = JSON.parse(localStorage.getItem('userAuth'))
    if (this.match.participants_type === 'single'){
      if (user.slug === this.match.home.original.slug){
        this.opponentType = 'away'
      } else {
        this.opponentType = 'home'
      }
    }

  }

}
