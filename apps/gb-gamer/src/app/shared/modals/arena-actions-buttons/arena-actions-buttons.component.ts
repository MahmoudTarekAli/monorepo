import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from "@angular/forms";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {ButtonComponent} from "../../../components/button/button.component";
import {NzModalRef} from "ng-zorro-antd/modal";
import {ArenaService} from "../../../modules/arena/service/arena.service";
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {HandleError, SetNotifications} from "../../state/global.action";
import {ManageArenaActions} from "../../../modules/arena/state/arenas.action";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";

@Component({
  selector: 'app-arena-actions-buttons',
  standalone: true,
  imports: [CommonModule, NzSwitchModule, FormsModule, ReactiveFormsModule, ButtonComponent, NzCheckboxModule],
  templateUrl: './arena-actions-buttons.component.html',
  styleUrls: ['./arena-actions-buttons.component.scss']
})
export class ArenaActionsButtonsComponent {
  @Input() arena: any;
  arenaButtonForm: FormGroup

  constructor(private fb: FormBuilder, private modal: NzModalRef, private arenaService: ArenaService , private store:Store,
              private actions$:Actions) {
    this.arenaButtonForm = fb.group({
      is_verified: [''],
      homepage_highlighted: [''],
      is_trusted: [''],
      is_listed: [''],

    })
    this.actions$.pipe(ofActionSuccessful(ManageArenaActions)).subscribe((res: any) => {
      this.modal.close()
    })
  }

  ngOnInit() {
    this.arenaButtonForm.patchValue(this.arena)
  }

  submitForm() {
    this.store.dispatch(new ManageArenaActions(this.arena.slug ,  this.arenaButtonForm.value ))
  }
}
