import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzProgressModule} from "ng-zorro-antd/progress";
import {Select, Store} from "@ngxs/store";
import {TeamState} from "../../state/team.state";
import {Observable} from "rxjs";
import {Team} from "../../../../shared/models/team";
import {GetTeamStats} from "../../state/team.action";
import {TeamsService} from "../../service/teams.service";

@Component({
  selector: 'app-team-stats',
  standalone: true,
    imports: [CommonModule, NzProgressModule],
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.scss']
})
export class TeamStatsComponent implements OnInit{
  @Select(TeamState.getTeamStats) TeamStats$: Observable<any>;
  constructor(private store:Store , private teamService:TeamsService) {
  }
  ngOnInit() {
    this.store.dispatch(new GetTeamStats(this.teamService.teamId))
  }

}
