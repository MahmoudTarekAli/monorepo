import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzSelectModule} from "ng-zorro-antd/select";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {GetLeagueServers} from "../../../modules/gamer/gamer-settings/state/gamer-settings.action";
import {GamerState} from "../../../modules/gamer/state/gamer.state";
import {Observable} from "rxjs";
import {GamerProfile} from "../../models/gamer";
import {GamerSettingsState} from "../../../modules/gamer/gamer-settings/state/gamer-settings.state";
import {NzInputModule} from "ng-zorro-antd/input";
import {ButtonComponent} from "../../../components/button/button.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {GamerService} from "../../../modules/gamer/service/gamer.service";
import {HandleError, SetNotifications} from "../../state/global.action";
import {AddLeagueAccount} from "../../../modules/gamer/state/gamer.action";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-link-league-account',
  standalone: true,
  imports: [CommonModule, NzStepsModule, NzSelectModule, NzInputModule, ButtonComponent, ReactiveFormsModule],
  templateUrl: './link-league-account.component.html',
  styleUrls: ['./link-league-account.component.scss']
})
export class LinkLeagueAccountComponent implements OnInit{
  @Select(GamerSettingsState.getLeagueServers) leagueServers$: Observable<any>;
  @Select(GamerState.getNewLeagueAccount) account$: Observable<any>;
  linkAccount: FormGroup;
  connectAccount: FormGroup;
  [key: string]: any;
  @Input() currentStep = 0;
  @Input() account: any;
  // index = 'First-content';
    constructor(private store:Store , private fb: FormBuilder, private gamerService:GamerService, private modalService: NzModalService , private actions$:Actions) {
      this.linkAccount = fb.group({
        game_code:  ['league-of-legends', Validators.required],
        name:  ['', Validators.required],
        game_server:  ['', Validators.required],
      })

      this.connectAccount = fb.group({
        vc:  ['', Validators.required]

      })
    }
    ngOnInit() {
      this.store.dispatch(new GetLeagueServers())

    }

  linkLeagueAccount() {
   this.store.dispatch(new AddLeagueAccount(this.linkAccount.value))
    this.actions$.pipe(ofActionSuccessful(AddLeagueAccount)).subscribe((res: any) => {
      this.account$.subscribe((res: any) => {
        this.account = res
      })
      this.currentStep = 1
    })
  }


  verifyAccount() {
    this.gamerService.verifyLeagueAccount(this.account.id).subscribe((res: any) => {
      this.store.dispatch(new SetNotifications('Success', 'Score is Claimed Successfully', 'success'))
      this.currentStep = 2
    },error => {
      this.store.dispatch(new HandleError(error))
    })
  }
  closeModal() {
      this.modalService.closeAll()
  }
}
