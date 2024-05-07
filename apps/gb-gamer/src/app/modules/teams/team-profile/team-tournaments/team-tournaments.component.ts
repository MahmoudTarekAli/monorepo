import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {TeamState} from "../../state/team.state";
import {Observable} from "rxjs";
import {Team} from "../../../../shared/models/team";
import {TournamentCardComponent} from "../../../../shared/components/tournament-card/tournament-card.component";
import {GetTeamJoinTournaments} from "../../state/team.action";
import {TeamsService} from "../../service/teams.service";
import {LoadingIndicatorComponent} from "../../../../shared/components/loading-indicator/loading-indicator.component";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {GetFeaturedGames} from "../../../home/state/home.action";

@Component({
  selector: 'app-team-tournaments',
  standalone: true,
  imports: [CommonModule, TournamentCardComponent, LoadingIndicatorComponent],
  templateUrl: './team-tournaments.component.html',
  styleUrls: ['./team-tournaments.component.scss']
})
export class TeamTournamentsComponent implements OnInit{
  @Select(TeamState.getJoinedTournaments) JoinedTournaments: Observable<any>;
  @Select(hasActionsExecuting([GetTeamJoinTournaments])) getJoinedTournamentsIsExecuting$: Observable<Boolean>;

  loading: boolean ;
  constructor(private teamService: TeamsService,private store:Store , private actions$:Actions) {
  }

  ngOnInit() {
    this.loading = true
    this.store.dispatch(new GetTeamJoinTournaments(this.teamService.teamId))

  }

}
