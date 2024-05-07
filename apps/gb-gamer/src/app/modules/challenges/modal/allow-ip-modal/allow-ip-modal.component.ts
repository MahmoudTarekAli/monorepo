import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {TranslateModule} from "@ngx-translate/core";
import {ChallengesService} from "../../service/challenges.service";
import {ButtonComponent} from "../../../../components/button/button.component";
import {Store} from "@ngxs/store";
import {HandleError, SetNotifications} from "../../../../shared/state/global.action";
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-allow-ip-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NzGridModule, NzTypographyModule, TranslateModule, ButtonComponent],
  templateUrl: './allow-ip-modal.component.html',
  styleUrls: ['./allow-ip-modal.component.scss']
})
export class AllowIpModalComponent {
  @Input() challenge: any;
  myIp: string;
  mainIp: string;
  errorMessage: string;

  constructor(private challengeService: ChallengesService, private store: Store, private modal:NzModalRef) {
  }

  allowIp() {
    this.challengeService.getMyIp().subscribe((res: any) => {
      console.log(res)
      this.mainIp = res.ip;
      this.myIp = res.ip;
    })
  }

  submitIp() {
    if (this.challenge.authority == 'Moderator' && this.mainIp !== this.myIp) {
      this.errorMessage = 'You are not allowed to edit IP'
    }
    this.challengeService.updateRestriction(this.challenge.id, {ip: this.myIp}).subscribe(() => {
      this.store.dispatch(new SetNotifications('Success', 'IP has added Successfully', 'success'))
      this.modal.close()
    },error => {
      this.store.dispatch(new HandleError(error))
    })
  }
}
