import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TournamentService} from "../service/tournament.service";
import {User} from "../../authentication/models/user";
import {OrderPipe} from "../../../shared/pipes/order.pipe";
import {CountryPipe} from "../../../shared/pipes/country.pipe";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {RouterLink} from "@angular/router";
import {RankPipe, SortByRankPipe} from "../../../shared/pipes/rank.pipe";
import {SectionComponent} from "../../../components/section/section.component";
import {Select} from "@ngxs/store";
import {TournamentState} from "../state/tournament.state";
import {Observable} from "rxjs";
import {Tournament} from "../../../shared/models/tournament";
import {TranslateModule} from "@ngx-translate/core";
import {ViewTeamComponent} from "../../../shared/components/view-team/view-team.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {NgScrollbar} from "ngx-scrollbar";

@Component({
  selector: 'app-winners',
  standalone: true,
  imports: [CommonModule, OrderPipe, CountryPipe, NzAvatarModule, RouterLink, RankPipe, SectionComponent, SortByRankPipe, TranslateModule, NgScrollbar],
  templateUrl: './winners.component.html',
  styleUrls: ['./winners.component.scss']
})
export class WinnersComponent {
  winners = []
  @Select(TournamentState.getTournament) tournament$: Observable<Tournament>;

  constructor(private tournamentService: TournamentService, private nzModalService: NzModalService) {
    this.tournamentService.getWinners(this.tournamentService.tournamentCode).subscribe(winners => {
      this.winners = winners.data
      console.log(this.winners)
    })
  }

  viewTeam(team) {
    console.log(team)
    if (team.type === "teams") {
      this.nzModalService.create({
        nzContent: ViewTeamComponent,
        nzData: {
          teamId: team.participant_id,
        },
        nzFooter: null,
        nzCentered: true,
        nzWidth: '600px',
        nzClassName: 'challenge-modal'

      })
    }

  }

}
