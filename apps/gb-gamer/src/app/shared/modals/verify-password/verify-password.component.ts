import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzInputModule} from "ng-zorro-antd/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonComponent} from "../../../components/button/button.component";
import {NzModalRef} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-verify-password',
  standalone: true,
  imports: [CommonModule, NzGridModule, NzInputModule, ReactiveFormsModule, ButtonComponent, FormsModule],
  templateUrl: './verify-password.component.html',
  styleUrls: ['./verify-password.component.scss']
})
export class VerifyPasswordComponent implements OnInit{
 password: string = ''
  constructor(private modal:NzModalRef) { }

  ngOnInit(): void {
  }

  submitPassword() {
   const data = {current_password:this.password , action: 'confirm'}
    this.modal.close(data)
  }
}
