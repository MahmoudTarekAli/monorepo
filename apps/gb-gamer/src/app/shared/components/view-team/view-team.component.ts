import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ParticipantCardComponent} from "../participant-card/participant-card.component";
import {GetTeam} from "../../../modules/teams/state/team.action";
import {Select, Store} from "@ngxs/store";
import {TournamentService} from "../../../modules/tournament/service/tournament.service";
import {TeamState} from "../../../modules/teams/state/team.state";
import {Observable} from "rxjs";
import {Team} from "../../models/team";
import {ButtonComponent} from "../../../components/button/button.component";
import {UserCardComponent} from "../user-card/user-card.component";
import {RouterLink} from "@angular/router";
import {NzModalService} from "ng-zorro-antd/modal";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-view-team',
  standalone: true,
  imports: [CommonModule, ParticipantCardComponent, ButtonComponent, UserCardComponent, RouterLink, TranslateModule],
  templateUrl: './view-team.component.html',
  styleUrls: ['./view-team.component.scss']
})
export class ViewTeamComponent implements OnInit {
  @Input() teamId: string
  @Select(TeamState.getTeam) team$: Observable<any>;
  members = []
  constructor(private store: Store, private tournamentService: TournamentService, public modal: NzModalService) {
  }

  ngOnInit() {
    this.store.dispatch(new GetTeam(this.teamId, this.tournamentService.tournamentCode, true))
    this.team$.subscribe(data => {
      if (data){
        this.members = data.members.data.slice().sort((a, b) => {
          const aHasOwnerOrLeaderRole = (a?.roles?.includes("Owner") || a?.roles?.includes("Leader")) ?? false;
          const bHasOwnerOrLeaderRole = (b?.roles?.includes("Owner") || b?.roles?.includes("Leader")) ?? false;
          if (aHasOwnerOrLeaderRole && !bHasOwnerOrLeaderRole) {
            return -1;
          } else if (!aHasOwnerOrLeaderRole && bHasOwnerOrLeaderRole) {
            return 1;
          } else {
            return 0;
          }
        });

      }
    })
  }

}
