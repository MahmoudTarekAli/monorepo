import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ParticipantCardComponent} from "../../../../shared/components/participant-card/participant-card.component";
import {ButtonComponent} from "../../../../components/button/button.component";
import {Select, Store} from "@ngxs/store";
import {TeamState} from "../../state/team.state";
import {Observable} from "rxjs";
import {Team} from "../../../../shared/models/team";
import {RouterLink} from "@angular/router";
import {SelectRoleComponent} from "../../../../shared/modals/select-role/select-role.component";
import {RemoveTeamMember, SelectRole} from "../../state/team.action";
import {NzModalService} from "ng-zorro-antd/modal";
import {TeamsService} from "../../service/teams.service";
import {GamerService} from "../../../gamer/service/gamer.service";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-team-members',
  standalone: true,
    imports: [CommonModule, ParticipantCardComponent, ButtonComponent, RouterLink, TranslateModule],
  providers: [NzModalService],
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent implements OnInit{
  @Select(TeamState.getTeam) Team$: Observable<Team>;
constructor( private modalService: NzModalService, public teamService: TeamsService , private store: Store, public gamerService:GamerService) {
}
ngOnInit() {
}
  selectRole(member:any) {
  console.log(member)
    this.modalService.create({
      nzContent: SelectRoleComponent,
      nzData: {
        selectedRoles: member?.roles,
      },
      nzClassName:'challenge-modal',
      nzFooter: null,
      nzCentered: true,
      nzWidth: '600px',
    }).afterClose.subscribe((result: any) => {
      if(result?.action === 'confirm') {
        const body = {roles: result.roles, slug: member.slug}
      this.store.dispatch(new SelectRole(this.teamService.teamId , body))
      }
    })

  }
  removeMember(member:any) {
    this.store.dispatch(new RemoveTeamMember(this.teamService.teamId , member.id))
  }
}
