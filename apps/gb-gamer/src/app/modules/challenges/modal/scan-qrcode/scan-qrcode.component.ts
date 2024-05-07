import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ZXingScannerModule} from "@zxing/ngx-scanner";
import {ChallengesService} from "../../service/challenges.service";
import {Store} from "@ngxs/store";
// import { BarcodeFormat } from '@zxing/library';
import {NzModalRef} from "ng-zorro-antd/modal";
import {HandleError, SetNotifications} from "../../../../shared/state/global.action";
import {AuthService} from "../../../authentication/services/auth.service";
import {TranslateModule} from "@ngx-translate/core";
import {QRCodeModule} from "angularx-qrcode";
import {ButtonComponent} from "../../../../components/button/button.component";
import {NzQRCodeModule} from "ng-zorro-antd/qr-code";

@Component({
  selector: 'app-scan-qrcode',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule, TranslateModule, QRCodeModule, ButtonComponent, NzQRCodeModule],
  templateUrl: './scan-qrcode.component.html',
  styleUrls: ['./scan-qrcode.component.scss']
})
export class ScanQrcodeComponent implements OnInit{
  @Input() challengeId: any;
  @Input() isUserSide: boolean = false;
  // allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX];

  constructor(private challengeService:ChallengesService , private store:Store, public modal:NzModalRef , public authService:AuthService) {
  }
  ngOnInit(): void {

  }
  claimAdminScore(event: any) {
    console.log(event)
    const payload = { participant_id: parseInt(event)}
    this.challengeService.claimAdminScore(this.challengeId, payload).subscribe(res => {
    this.store.dispatch(new SetNotifications('Success' , 'Successfully claimed admin score' , 'success'))
      this.modal.close()

    }, error => {
      this.store.dispatch(new HandleError(error))
      this.modal.close()
    })
  }
}
