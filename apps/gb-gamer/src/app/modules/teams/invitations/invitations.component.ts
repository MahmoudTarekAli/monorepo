import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TeamsService} from "../service/teams.service";
import {Store} from "@ngxs/store";
import {HandleError, SetNotifications} from "../../../shared/state/global.action";
import {SafeHtmlPipe} from "../../../shared/pipes/safe-html";
import {ButtonComponent} from "../../../components/button/button.component";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {CountryPipe} from "../../../shared/pipes/country.pipe";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {RequiredInputsComponent} from "../../../shared/modals/required-inputs/required-inputs.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {AuthService} from "../../authentication/services/auth.service";

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [CommonModule, LoadingIndicatorComponent, SafeHtmlPipe, ButtonComponent, NzDividerModule, CountryPipe,
    RouterLink, NzAvatarModule],
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})
export class InvitationsComponent implements OnInit {
  invitation: any;
  invitationLoading = false
  message: string;
  buttonLoading = false;

  constructor(private activatedRoute:ActivatedRoute , private teamService:TeamsService , private store:Store , private router:Router,
              private modalService:NzModalService , private authService:AuthService) { }

  ngOnInit(): void {
    this.invitationLoading = true;
    this.teamService.getInvitationByCode(this.activatedRoute.snapshot.params['code']).subscribe((res:any) => {
      this.invitation = res;
      this.invitationLoading = false;
      if (!res.is_used) {
        if (res.type === 'TeamInvitation') {
          this.message = '<h1 style="font-size:16px; margin:0; font-weight: normal">You have been invited to join team </h1> <h3 style="margin: 0 10px; font-size:16px; color: #b6e02c"> "' + res.team.data.name + '" </h3> '
          if (res?.tournament?.data) {
            this.message += ' <h1 style="font-size:16px; margin:0; font-weight: normal">  in tournament  </h1> <h3 style="margin: 0 10px; font-size:16px; color: #b6e02c"> "' + res.tournament.data.name + '" </h3> ';
          }
        }
      } else {
        this.store.dispatch(new SetNotifications('Success', 'Invitation had already been used!' ,'success' ))
        this.router.navigateByUrl('/')
      }
    }, error => {
      this.store.dispatch(new HandleError(error))
      this.router.navigateByUrl('/');
    })
  }

  acceptInvitation() {
    if (!this.buttonLoading) {
      this.buttonLoading = true
      if (this.invitation?.tournament?.data && (this.invitation.tournament?.data?.teamMembersSupportedRequiredInputsKeys.length || this.invitation.tournament?.data?.connected_accounts_required)) {
        this.teamService.compareRequiredInputs(this.invitation.tournament.data.code, this.authService.userAuth.slug).subscribe(res => {

          this.modalService.create({
            nzContent: RequiredInputsComponent,
            nzData: {
              selectedRequiredInputs: res,
              connectedAccountsRequired: this.invitation.tournament?.data?.connected_accounts_required,
              tournament: this.invitation?.tournament?.data,
              isTournament: true
            },
            nzClassName: 'challenge-modal',
            nzFooter: null,
            nzCentered: true,
            nzWidth: '600px',
          }).afterClose.subscribe((result: any) => {
            this.buttonLoading = false
            if (result?.action === 'confirm') {
              console.log(result.requiredInputs)
              this.acceptInvite(result.requiredInputs, result.required_accounts)
            }
          })
        })
      } else {
        this.acceptInvite()
      }
    }
  }

  acceptInvite(requiredInputs? , requiredAccounts?) {
    console.log(requiredInputs)
    if (requiredInputs) {
      requiredInputs = requiredInputs.map((input) => { return {key: input.key , value: input.value}})
    }
    this.teamService.acceptInvitation(this.activatedRoute.snapshot.params['code'] , requiredInputs , requiredAccounts).subscribe(res => {
      this.store.dispatch(new SetNotifications('Success', 'Invitation accepted successfully!' ,'success' ))
      if(this.invitation.tournament?.data) {
        this.router.navigateByUrl(`/tournaments/${this.invitation.tournament.data.code}`)
      } else {
        this.router.navigateByUrl(`/teams/${this.invitation.team.data.id}`)

      }
    },error => {
      this.store.dispatch(new HandleError(error))
    })
  }

}
