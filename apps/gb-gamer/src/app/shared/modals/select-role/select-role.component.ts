import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzModalRef} from "ng-zorro-antd/modal";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {FormsModule} from "@angular/forms";
import {ButtonComponent} from "../../../components/button/button.component";

@Component({
  selector: 'app-select-role',
  standalone: true,
  imports: [CommonModule, NzCheckboxModule, FormsModule, ButtonComponent],
  templateUrl: './select-role.component.html',
  styleUrls: ['./select-role.component.scss']
})
export class SelectRoleComponent implements OnInit {
  roles:any = [
    { label: 'Player', value: 'Player', checked: true },
    { label: 'Coach', value: 'Coach' },
    { label: 'Leader', value: 'Leader' },
    { label: 'Owner', value: 'Owner' }
  ];
  @Input() selectedRoles: any;
  constructor( private modal: NzModalRef) { }

  ngOnInit(): void {
    this.roles.forEach((role:any) => {
      if(this.selectedRoles?.includes(role.value)) {
        role.checked = true
      }
    })
  }
  submitRole() {
    this.roles = this.roles.filter((role:any) => { return role.checked})
   const roles = this.roles.map((role:any) => { return role.value})
    const data = {roles:roles , action: 'confirm'}
    this.modal.close(data)
  }

}
