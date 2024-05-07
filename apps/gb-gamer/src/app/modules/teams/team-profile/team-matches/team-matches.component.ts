import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Select, Store} from "@ngxs/store";
import {GetTeamJoinTournaments, GetTeamUpcomingMatches} from "../../state/team.action";
import {TeamsService} from "../../service/teams.service";
import {GlobalState} from "../../../../shared/state/global.state";
import {Observable} from "rxjs";
import {TeamState} from "../../state/team.state";
import {LoadingIndicatorComponent} from "../../../../shared/components/loading-indicator/loading-indicator.component";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {GetUpcomingMatches} from "../../../gamer/state/gamer.action";
import {ButtonComponent} from "../../../../components/button/button.component";
import {MatchBarComponent} from "../../../../shared/components/match-bar/match-bar.component";

@Component({
  selector: 'app-team-matches',
  standalone: true,
  imports: [CommonModule, LoadingIndicatorComponent, ButtonComponent, MatchBarComponent],
  templateUrl: './team-matches.component.html',
  styleUrls: ['./team-matches.component.scss']
})
export class TeamMatchesComponent implements OnInit{
  @Select(TeamState.getUpcomingMatches) UpComingMatches$: Observable<any>;
  @Select(hasActionsExecuting([GetUpcomingMatches])) getUpcomingMatchesIsExecuting$: Observable<Boolean>;

  constructor(private store:Store , private teamService:TeamsService) { }
  ngOnInit(): void {
    this.store.dispatch(new GetTeamUpcomingMatches(this.teamService.teamId))
  }
}
