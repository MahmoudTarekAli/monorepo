import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzGridModule} from "ng-zorro-antd/grid";
import {FormsModule} from "@angular/forms";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {Select, Store} from "@ngxs/store";
import {TeamState} from "../../state/team.state";
import {Observable} from "rxjs";
import {Team} from "../../../../shared/models/team";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {GetFriends} from "../../../../shared/state/global.action";
import {GlobalState} from "../../../../shared/state/global.state";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {ButtonComponent} from "../../../../components/button/button.component";
import {AcceptTeamMember, CancelMemberRequest, GetRequest, GetTeam, InviteMember} from "../../state/team.action";
import {TeamsService} from "../../service/teams.service";
import {UserCardComponent} from "../../../../shared/components/user-card/user-card.component";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {GetUpcomingMatches} from "../../../gamer/state/gamer.action";
import {LoadingIndicatorComponent} from "../../../../shared/components/loading-indicator/loading-indicator.component";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";

@Component({
  selector: 'app-team-add-member',
  standalone: true,
  imports: [CommonModule, NzGridModule, FormsModule, NzTypographyModule, NzInputModule, NzSelectModule, NzAvatarModule, ButtonComponent, UserCardComponent, LoadingIndicatorComponent, NzToolTipModule],
  templateUrl: './team-add-member.component.html',
  styleUrls: ['./team-add-member.component.scss']
})
export class TeamAddMemberComponent implements OnInit {
  @Select(TeamState.getTeam) Team$: Observable<Team>;
  @Select(hasActionsExecuting([GetTeam])) getTeamIsExecuting$: Observable<Boolean>;

  @Select(TeamState.getRequests) Requests$: Observable<any>;
  @Select(GlobalState.getFriends) Friends$: Observable<any>;
  invitationLink:string
  selectedUser:any
  constructor(private store:Store , public teamService:TeamsService) { }
  ngOnInit(): void {
    this.store.dispatch(new GetFriends())
    this.store.dispatch(new GetRequest(this.teamService.teamId , 'incoming'))
    this.store.dispatch(new GetRequest(this.teamService.teamId  , 'outgoing'))
  }
  inviteMember(){
    const body = {
      recipient_id: this.selectedUser ,
      sender_id: this.teamService.teamId,
      type: "TeamMemberInvitationRequest",
      message: "Please, Join Us",
    }
    this.store.dispatch(new InviteMember(body))

  }

}
