import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzFormModule} from "ng-zorro-antd/form";
import {ButtonComponent} from "../../../components/button/button.component";
import {FormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzModalRef} from "ng-zorro-antd/modal";
import {Store} from "@ngxs/store";
import {TranslateModule} from "@ngx-translate/core";
import {GamerService} from "../../../modules/gamer/service/gamer.service";
import {HandleError, SetNotifications} from "../../state/global.action";

@Component({
  selector: 'app-edit-reference-number',
  standalone: true,
  imports: [CommonModule, NzFormModule, ButtonComponent, FormsModule, NzInputModule, TranslateModule],
  templateUrl: './edit-reference-number.component.html',
  styleUrls: ['./edit-reference-number.component.scss']
})
export class EditReferenceNumberComponent {
  @Input() referenceNumber: string;
  isAlertVisible = false;
  constructor(private store: Store, private modal:NzModalRef , private gamerService: GamerService) {
  }

  ngOnInit() {
  }

  editReferenceNumber() {
    if (this.referenceNumber.length < 5 || this.referenceNumber.length > 10) {
      this.isAlertVisible = true;
      return
    }
      const payload = {reference_number: this.referenceNumber}
      this.gamerService.changeReferenceNumber(payload).subscribe(res => {
        this.store.dispatch(new SetNotifications('success', 'reference number has changed successfully', 'success'))
        this.modal.close()
      },error => {
        this.store.dispatch(new HandleError(error))
      })

  }
}
