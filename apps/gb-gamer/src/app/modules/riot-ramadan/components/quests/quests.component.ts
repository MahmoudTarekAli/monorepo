import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzProgressModule} from "ng-zorro-antd/progress";
import {NzButtonModule} from "ng-zorro-antd/button";
import {RiotRamadanService} from "../../service/riot-ramadan.service";
import {ActivatedRoute} from "@angular/router";
import {ButtonComponent} from "../../../../components/button/button.component";
import {ViewRulesComponent} from "../../../challenges/modal/view-rules/view-rules.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {SectionComponent} from "../../../../components/section/section.component";
import {SetNotifications} from "../../../../shared/state/global.action";
import {TranslateModule} from "@ngx-translate/core";

import {Store} from "@ngxs/store";

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule, NzProgressModule, NzButtonModule,TranslateModule, ButtonComponent, SectionComponent],
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.scss']
})
export class QuestsComponent implements OnInit {
  @ViewChild('referralModal', {static: true}) referralModal: TemplateRef<any>;

  quests = []
  @Input() activeGame: any
  @Input() isRefer: any
  format: any

  constructor(private riotRamadanService: RiotRamadanService, public modalService: NzModalService,
              private activateRoute: ActivatedRoute, private store: Store) {

  }

  ngOnInit() {
    this.activateRoute.queryParams.subscribe((queryParam: any) => {
      if (queryParam.game) {
        this.activeGame = queryParam.game
        this.getEventQuests(this.activeGame)
      } else {
        this.getEventQuests(this.activeGame)
      }
    })
  }

  getEventQuests(game) {
    this.riotRamadanService.getEventQuests(game, this.isRefer ? 'Referrals' : 'Claims').subscribe(data => {
      console.log(data)
      this.quests = data
    })
  }

  claimPrize(id) {
    this.riotRamadanService.claimPrize(id).subscribe(data => {
      this.store.dispatch(new SetNotifications('Success', 'you have claimed your quest successfully', 'warning'))
    }, error => {
      console.log(error)
      this.store.dispatch(new SetNotifications('Warning', error.error.message, 'warning'))
    })
  }

  nzFormat = (userAttempts: number, attemptsRequired: any): any => {
    if (userAttempts && attemptsRequired) {
      return `${userAttempts} / ${attemptsRequired}`;
    } else {
      return `${0} / ${attemptsRequired}`;
    }
  };
  oneHundredPercent = (): any => {
    return `100%`
  }
  percent = (userAttempts: number, attemptsRequired: any): any => {
    const percentage = (userAttempts / attemptsRequired) * 100;
    this.format = percentage
    return percentage
  };
  referFriend(){
    this.modalService.create({
      nzContent: this.referralModal,
      nzFooter: null,
      nzCentered: true,
      nzWidth: '600px',
      nzClassName:'challenge-modal'

    },)
  }
}
