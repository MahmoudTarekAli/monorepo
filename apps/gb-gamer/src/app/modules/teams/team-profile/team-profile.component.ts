import {Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, NgFor, NgForOf, NgIf} from '@angular/common';
import {BannerCardComponent} from "../../../shared/components/banner-card/banner-card.component";
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {ButtonComponent} from "../../../components/button/button.component";
import {Observable} from "rxjs";
import {TeamState} from "../state/team.state";
import {GetTeam, LeaveTeam} from "../state/team.action";
import {Team} from "../../../shared/models/team";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {TranslateModule} from "@ngx-translate/core";
import {AuthenticationState} from "../../authentication/state/authentication.state";
import {TeamsService} from "../service/teams.service";
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {GamerService} from "../../gamer/service/gamer.service";

@Component({
  selector: 'app-team-profile',
  standalone: true,
  imports: [BannerCardComponent, ButtonComponent, NzTabsModule, TranslateModule, RouterOutlet, RouterLink, NgIf, NgFor, AsyncPipe, NgForOf, LoadingIndicatorComponent],
  templateUrl: './team-profile.component.html',
  styleUrls: ['./team-profile.component.scss']
})
export class TeamProfileComponent implements OnInit{
  @Select(TeamState.getTeam) Team$: Observable<Team>;
  @Select(hasActionsExecuting([GetTeam])) getTeamIsExecuting$: Observable<Boolean>;
  @Select(AuthenticationState.isAuthenticated) isLoggedIn$: Observable<any>;
  isLoggedIn: boolean;
  tabs :any[];

  constructor(public teamService: TeamsService, private router: Router, private activatedRoute: ActivatedRoute, private gamerService:GamerService ,
              private store: Store , private actions:Actions) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params?.['id']) {
        this.teamService.teamId = params['id'];
        this.store.dispatch(new GetTeam(this.teamService.teamId))
        this.isLoggedIn$.subscribe(res => {
          this.isLoggedIn = res
        })
        this.actions.pipe(ofActionSuccessful(GetTeam)).subscribe(() => {
          this.tabs = [
            {
              title: 'team.teamMembers',
              path: ``,
              isOwner: true
            },
            {
              title: 'common.stats',
              path: `stats`,
              isOwner: true
            },
            {
              title: 'common.matches',
              path: `matches`,
              isOwner: true
            },
            {
              title: 'team.joinedTournaments',
              path: `joined-tournaments`,
              isOwner: true
            },
            {
              title: 'team.addMembers',
              path: `add-members`,
              isOwner: this.teamService.isTeamOwner
            },
          ];
        })
      }
    })
    this.Team$.subscribe(res => {
      console.log(res)
      if (res && res.owner) {
        this.teamService.isTeamOwner = this.gamerService.isOwner(res.owner.slug)
        // console.log(this.teamService.isTeamOwner)
      }
    })

  }

  leaveTeam(id: number){
    this.store.dispatch(new LeaveTeam(id))

  }
}
