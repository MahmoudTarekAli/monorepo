import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonComponent} from "../../../../../components/button/button.component";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {GetMyTeams, GetTeamJoinTournaments} from "../../../../teams/state/team.action";
import {GamerState} from "../../../state/gamer.state";
import {Observable} from "rxjs";
import {GamerProfile} from "../../../../../shared/models/gamer";
import {TeamState} from "../../../../teams/state/team.state";
import {RouterLink} from "@angular/router";
import {ParticipantCardComponent} from "../../../../../shared/components/participant-card/participant-card.component";
import {
  LoadingIndicatorComponent
} from "../../../../../shared/components/loading-indicator/loading-indicator.component";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-my-teams',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterLink, ParticipantCardComponent, LoadingIndicatorComponent, NzPaginationModule, TranslateModule],
  templateUrl: './my-teams.component.html',
  styleUrls: ['./my-teams.component.scss'],

})
export class MyTeamsComponent implements OnInit {
  @Select(TeamState.getMyTeams) myTeams$: Observable<any>;
  @Select(hasActionsExecuting([GetMyTeams])) getMyTeamsIsExecuting$: Observable<Boolean>;

  constructor(private store:Store , private actions:Actions) {
  }

  ngOnInit() {
    this.store.dispatch(new GetMyTeams())
  }
}
