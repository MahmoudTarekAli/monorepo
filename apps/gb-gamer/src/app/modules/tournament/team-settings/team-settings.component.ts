import {Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, NgFor, NgForOf, NgIf} from '@angular/common';
import {BannerCardComponent} from "../../../shared/components/banner-card/banner-card.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {Select, Store} from "@ngxs/store";
import {TournamentService} from "../service/tournament.service";
import {TournamentState} from "../state/tournament.state";
import {Observable, Subject, take, takeUntil} from "rxjs";
import {Tournament} from "../../../shared/models/tournament";
import {Team} from "../../../shared/models/team";
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";
import {ParticipantCardComponent} from "../../../shared/components/participant-card/participant-card.component";
import {TranslateModule} from "@ngx-translate/core";
import {JoinTournamentState} from "../state/join-tournament/join-tournament.state";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {FormsModule} from "@angular/forms";
import {GlobalState} from "../../../shared/state/global.state";
import {GetFriends, HandleError, SetNotifications} from "../../../shared/state/global.action";
import {
  AssignLeader,
  GetRequest,
  GetTeam,
  InviteMember,
  SelectRole,
  SelectTeamMemberTournament,
  UnSelectTeamMemberTournament
} from "../../teams/state/team.action";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {UserCardComponent} from "../../../shared/components/user-card/user-card.component";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {TeamState} from "../../teams/state/team.state";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {TeamsService} from "../../teams/service/teams.service";
import {SelectRoleComponent} from "../../../shared/modals/select-role/select-role.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {ReferFriendComponent} from "../../challenges/modal/refer-friend/refer-friend.component";
import {RequiredInputsComponent} from "../../../shared/modals/required-inputs/required-inputs.component";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzIconModule} from "ng-zorro-antd/icon";
import {PlaceHolderComponent} from "../../../shared/components/place-holder/place-holder.component";

@Component({
  selector: 'app-team-settings',
  standalone: true,
  imports: [CommonModule, BannerCardComponent, ButtonComponent, RouterOutlet, RouterLink, NgIf, NgFor, AsyncPipe, NgForOf, TranslateModule, ParticipantCardComponent, NzGridModule, NzSelectModule, NzAvatarModule, FormsModule, NzTypographyModule, UserCardComponent, NzToolTipModule, NzButtonModule, NzDropDownModule, NzIconModule, PlaceHolderComponent],
  templateUrl: './team-settings.component.html',
  styleUrls: ['./team-settings.component.scss']
})
@UntilDestroy()
export class TeamSettingsComponent implements OnInit, OnDestroy {
  @Select(TeamState.getTeam) team$: Observable<Team>;
  @Select(JoinTournamentState.getIsJoinedData) isJoinedData$: Observable<any>;
  @Select(GlobalState.getFriends) Friends$: Observable<any>;
  @Select(hasActionsExecuting([GetTeam])) getTeamIsExecuting$: Observable<Boolean>;
  @Select(TeamState.getRequests) Requests$: Observable<any>;
  @Select(TournamentState.getTournament) tournament$: Observable<Tournament>;
  @Select(TournamentState.geTeamAuthority) isTeamAuthority$: Observable<boolean>;

  tournament: any
  selectedUser: any
  teamId: string;
  teamMembersSupportedRequiredInputsKeys: any = []
  tournamentCode: string;
  private ngUnsubscribe = new Subject<void>();
  buttonLoading: boolean = false;
  constructor(private store: Store, private tournamentService: TournamentService, private modalService: NzModalService, public teamService: TeamsService) {
  }

  ngOnInit(): void {
    this.tournament$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res?.id) {
        this.tournament = res
        this.teamMembersSupportedRequiredInputsKeys = res?.teamMembersSupportedRequiredInputsKeys
      }
    })
    this.isJoinedData$.pipe(take(1),takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res?.team) {
        this.teamId = res?.team.id
        this.store.dispatch(new GetTeam(this.teamId, this.tournamentService.tournamentCode, true))
        this.store.dispatch(new GetRequest(this.teamId, 'incoming', this.tournamentService.tournamentCode))
        this.store.dispatch(new GetRequest(this.teamId, 'outgoing', this.tournamentService.tournamentCode))
        this.store.dispatch(new GetFriends())
      }
    })


  }

  inviteMember() {
    const body = {
      recipient_id: this.selectedUser,
      sender_id: this.teamId,
      type: "TeamMemberInvitationRequest",
      message: "Please, Join Us",
      relations: [
        {
          type: "Tournament",
          id: this.tournament.id
        }]
    }
    this.store.dispatch(new InviteMember(body))

  }

  selectRole(member: any) {
    console.log(member)
    this.modalService.create({
      nzContent: SelectRoleComponent,
      nzData: {
        selectedRoles: member?.roles,
      },
      nzClassName: 'challenge-modal',
      nzFooter: null,
      nzCentered: true,
      nzWidth: '600px',
    }).afterClose.subscribe((result: any) => {
      if (result?.action === 'confirm') {
        const body = {roles: result.roles, slug: member.slug}
        this.store.dispatch(new SelectRole(this.teamService.teamId, body, true))
      }
    })

  }

  removeMember(id: string) {
    const payload = {member_id: id}
    this.store.dispatch(new UnSelectTeamMemberTournament(this.tournamentService.tournamentCode, this.teamId, id))
  }

  assignLeader(id: string) {
    const payload = {member_id: id}
    this.store.dispatch(new AssignLeader(this.tournamentService.tournamentCode, this.teamId, payload))

  }
  editRequiredInputs(member) {
    if (this.teamMembersSupportedRequiredInputsKeys.length > 0 || this.tournament?.connected_accounts_required) {
      let payload: any;
      this.compareRequiredInputs(member ,true)

    }
  }
  selectMember(member: any) {
    let payload: any;
    if (this.teamMembersSupportedRequiredInputsKeys.length > 0) {
    this.compareRequiredInputs(member)
    } else {
      payload = {member_id: member.id}
      this.store.dispatch(new SelectTeamMemberTournament(this.tournamentService.tournamentCode, this.teamId, payload))

    }


  }

  compareRequiredInputs(member , isRequiredInputs?) {
    console.log(member)
    let payload: any;
    if (!this.buttonLoading) {
      this.buttonLoading = true
      this.teamService.compareRequiredInputs(this.tournamentService.tournamentCode, member.slug).subscribe(res => {
        this.modalService.create({
          nzContent: RequiredInputsComponent,
          nzData: {
            selectedRequiredInputs: res,
            connectedAccountsRequired: this.tournament?.connected_accounts_required,
            userSlug: member?.slug,
            tournament: this.tournament,
            selectedAccount: member?.required_accounts?.[0]?.publisher_account,
            isEdit: true,

          },
          nzClassName: 'challenge-modal',
          nzFooter: null,
          nzCentered: true,
          nzWidth: '600px',
        }).afterClose.subscribe((result: any) => {
          this.buttonLoading = false
          if (result?.action === 'confirm') {
            payload = {member_id: member.id, teamMemberRequiredInputs: result.requiredInputs }
            console.log(result)
            if(result.required_accounts) {
              payload.required_accounts = [result.required_accounts]
            }
            if (isRequiredInputs) {
              this.teamService.updateTeamRequiredInputs(this.tournamentService.tournamentCode, this.teamId, payload).subscribe(res => {
                this.store.dispatch(new SetNotifications('success', 'Required Inputs Updated', 'success'))
              },error => {
                this.store.dispatch(new HandleError( error))
              })
            } else {
              this.store.dispatch(new SelectTeamMemberTournament(this.tournamentService.tournamentCode, this.teamId, payload))

            }
          }
        })

      })
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }
}
