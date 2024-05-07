import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {GamerState} from "../../state/gamer.state";
import {Observable} from "rxjs";
import {GamerSettingsState} from "../state/gamer-settings.state";
import {ParticipantCardComponent} from "../../../../shared/components/participant-card/participant-card.component";
import {GetBlockedUsers} from "../state/gamer-settings.action";
import {User} from "../../../authentication/models/user";
import {ButtonComponent} from "../../../../components/button/button.component";
import {LoadingIndicatorComponent} from "../../../../shared/components/loading-indicator/loading-indicator.component";

@Component({
  selector: 'app-blocked-users',
  standalone: true,
  imports: [CommonModule, ParticipantCardComponent, ButtonComponent, LoadingIndicatorComponent],
  templateUrl: './blocked-users.component.html',
  styleUrls: ['./blocked-users.component.scss']
})
export class BlockedUsersComponent implements OnInit{
  @Select(GamerSettingsState.getBlockedUsers) blockedUsers$: Observable<User[]>;
  loading: boolean = false;
  constructor(private store:Store, private actions:Actions) {}
  ngOnInit() {
    this.loading = true
    this.store.dispatch(new GetBlockedUsers())
    this.actions.pipe(ofActionSuccessful(GetBlockedUsers)).subscribe(() => {
      this.loading = false
    })

  }
  unblockUser(user: number) {

  }
}
