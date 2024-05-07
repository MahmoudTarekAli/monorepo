import {Component, Input, OnInit} from '@angular/core';
import {SectionComponent} from "../../../components/section/section.component";
import {Router, RouterLink} from "@angular/router";
import {
  AsyncPipe,
  NgForOf,
  NgIf,
  NgStyle,
  NgSwitch,
  NgSwitchCase,
  NgTemplateOutlet,
  UpperCasePipe
} from "@angular/common";
import {ButtonComponent} from "../../../components/button/button.component";
import {GlobalService} from "../../service/global.service";
import {Actions, Select, Store} from "@ngxs/store";
import {NzModalRef} from "ng-zorro-antd/modal";
import {LeagueAccountsComponent} from "../league-accounts/league-accounts.component";
import {FormsModule} from "@angular/forms";
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {environment} from "../../../../environments/environment";
import {TranslateModule} from "@ngx-translate/core";
import {LoadingIndicatorComponent} from "../loading-indicator/loading-indicator.component";
import {GamerState} from "../../../modules/gamer/state/gamer.state";
import {Observable} from "rxjs";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzInputModule} from "ng-zorro-antd/input";
import {GetLeagueAccounts} from "../../../modules/gamer/state/gamer.action";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {GetMyTeams} from "../../../modules/teams/state/team.action";
import {AuthService} from "../../../modules/authentication/services/auth.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-connect-league-accounts',
  templateUrl: './connect-league-accounts.component.html',
  styleUrls: ['./connect-league-accounts.component.scss'],
  imports: [
    SectionComponent,
    RouterLink,
    UpperCasePipe,
    ButtonComponent,
    NgIf,
    NgForOf,
    LeagueAccountsComponent,
    FormsModule,
    NzPageHeaderModule,
    TranslateModule,
    LoadingIndicatorComponent,
    AsyncPipe,
    NgSwitchCase,
    NzSelectModule,
    NgSwitch,
    NzStepsModule,
    NzInputModule,
    NgTemplateOutlet,
    NgStyle
  ],
  standalone: true
})
export class ConnectLeagueAccountsComponent implements OnInit {
  @Select(GamerState.getConnectedLeagueAccounts) accounts$: Observable<any>;
  @Input() isChallengeRequiredInputs: boolean = false;
  @Input() isBackground: boolean = false;
  @Input() accountId: number;
  @Input() buttonName: string = 'Join Challenge';
  @Input() type = 'challenge'
  currentStep: number = 0;
  @Input() challenge: any;
  requiredInputs: any = null;
  accounts: any;
  selectedAccount: any;
  referralCode: string;
  environment: any = environment;
  loading: boolean = false;
  invitationCode: any;
  @Select(hasActionsExecuting([GetLeagueAccounts])) getAccountsIsExecuting$: Observable<Boolean>;

  constructor(private router: Router, private globalService: GlobalService, private store: Store, public modal: NzModalRef, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.loading = true;
    console.log(this.accountId)
    let userSlug = JSON.parse(localStorage.getItem('userAuth') || '').slug;
    this.store.dispatch(new GetLeagueAccounts(userSlug, this.accountId , null , null , this.challenge.id ))
    this.invitationCode = JSON.parse(sessionStorage.getItem('invitation_code'))
    if (this.invitationCode?.id === this.challenge.id) {
      this.referralCode = this.invitationCode?.invitaion_code
    }
  }

  selectAccount(account: any) {
    this.selectedAccount = account
  }

  join() {
    const data = {
      selectedAccount: this.selectedAccount,
      referralCode: this.referralCode,
      isJoined: true,
      required_inputs: this.requiredInputs
    }
    this.modal.close(data)
  }

  closeModal() {
    this.modal.close()
  }

  linkRiotAccount() {
    sessionStorage.setItem('source', this.router.url)

    // this.cookieService.set('source', window.origin + this.router.url, {
    //   domain: '.gbarena.com',
    //   path: '/',
    //   expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1)
    // })
    window.location.href = `${environment?.auth_apiUrl}/auth/riot`
  }

}
