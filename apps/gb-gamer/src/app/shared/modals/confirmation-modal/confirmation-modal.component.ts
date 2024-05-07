import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzGridModule} from "ng-zorro-antd/grid";
import {ButtonComponent} from "../../../components/button/button.component";
import {NzInputModule} from "ng-zorro-antd/input";
import {FormsModule} from "@angular/forms";
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, NzGridModule, ButtonComponent, NzInputModule, FormsModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
@Input() title: string;
@Input() message: string;
@Input() confirmText: string;
constructor(private modalRef:NzModalRef) {
}


closeModal() {
  this.modalRef.close()
}
confirmModal() {
  this.modalRef.close('confirm')
}
}
