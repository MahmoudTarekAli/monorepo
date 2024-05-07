import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {NzModalService} from "ng-zorro-antd/modal";
import {LinkLeagueAccountComponent} from "../../../../shared/modals/link-league-account/link-league-account.component";
import {LeagueAccountsComponent} from "../../../../shared/components/league-accounts/league-accounts.component";
import {ButtonComponent} from "../../../../components/button/button.component";
import {DynamicRequiredInfoComponent} from "../../shared/dynamic-required-info/dynamic-required-info.component";
import {FormArray} from "@angular/forms";
import {GamerService} from "../../service/gamer.service";
import {environment} from "../../../../../environments/environment";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {Select, Store} from "@ngxs/store";
import {SetNotifications} from "../../../../shared/state/global.action";
import {NzNotificationService} from "ng-zorro-antd/notification";
import {DisconnectSocialAccount, GetSocialAccounts} from "../state/gamer-settings.action";
import {GlobalService} from "../../../../shared/service/global.service";
import {AuthenticationState} from "../../../authentication/state/authentication.state";
import {Observable} from "rxjs";
import {User} from "../../../authentication/models/user";
import {GamerSettingsState} from "../state/gamer-settings.state";
import {SocialAccountComponent} from "../../../../social-account/social-account.component";
import {NzDividerModule} from "ng-zorro-antd/divider";
@Component({
  selector: 'app-connect-accounts',
  standalone: true,
    imports: [CommonModule, TranslateModule, LeagueAccountsComponent, ButtonComponent, DynamicRequiredInfoComponent, SocialAccountComponent, NzDividerModule],
  providers: [NzModalService],
  templateUrl: './connect-accounts.component.html',
  styleUrls: ['./connect-accounts.component.scss']
})
export class ConnectAccountsComponent implements OnInit{
    [key: string]: any;
    gamerRequiredInputs: any;
    userRequiredInputs: any;
    environment = environment;
  @Select(GamerSettingsState.getSocialAccounts) socialAccounts$: Observable<any>;

  constructor(private modalService: NzModalService , private cookieService:CookieService , private router:Router , private store:Store ,
                private globalService:GlobalService) {
    }
    ngOnInit() {
      this.globalService.getSocialLoginError()

      this.store.dispatch(new GetSocialAccounts())
    }

  linkLeagueAccount() {
    this.modalService.create({
      nzContent: LinkLeagueAccountComponent,
      nzFooter: null,
      // nzCentered: true,
      nzWidth: '600px',

    },)

  }
  linkAccount(socialName) {
    sessionStorage.setItem('source', this.router.url)
    // this.cookieService.set('source', window.origin + this.router.url, {
    //   domain: '.gbarena.com',
    //   path: '/',
    //   expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1)
    // })
    window.location.href = `${environment?.auth_apiUrl}/auth/${socialName}`
  }
  disconnectAccount(accountId) {
    this.store.dispatch(new DisconnectSocialAccount(accountId))
  }
}
