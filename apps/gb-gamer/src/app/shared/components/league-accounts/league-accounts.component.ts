import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GlobalService} from "../../service/global.service";
import {ButtonComponent} from "../../../components/button/button.component";
import {GamerService} from "../../../modules/gamer/service/gamer.service";
import {Select, Store} from "@ngxs/store";
import {
  DeleteLeagueAccount,
  GetLeagueAccounts,
  UpdatePublisherAccount
} from "../../../modules/gamer/state/gamer.action";
import {Observable} from "rxjs";
import {GamerState} from "../../../modules/gamer/state/gamer.state";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {LinkLeagueAccountComponent} from "../../modals/link-league-account/link-league-account.component";
import {NzModalService} from "ng-zorro-antd/modal";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../../modules/authentication/services/auth.service";
import {environment} from "../../../../environments/environment";
import {TranslateModule} from "@ngx-translate/core";
import {CookieService} from "ngx-cookie-service";
import {NzIconModule} from "ng-zorro-antd/icon";
import {SetNotifications} from "../../state/global.action";
import {CountdownPipe} from "../../pipes/countdown.pipe";

@Component({
  selector: 'app-league-accounts',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NzToolTipModule, RouterLink, TranslateModule, NzIconModule, CountdownPipe],
  templateUrl: './league-accounts.component.html',
  styleUrls: ['./league-accounts.component.scss']
})
export class LeagueAccountsComponent implements OnInit {
  @Select(GamerState.getConnectedLeagueAccounts) accounts$: Observable<any>;

  @Output() accountsArray = new EventEmitter<any[]>();
  accounts: any = [];
  @Input() selectedAccount: any;
  @Input() accountId: number;
  @Input() tournamentCode: string;
  @Input() isSelectedShown: boolean = true;
  @Output() setSelectedAccount: EventEmitter<any> = new EventEmitter();
  @Output() accountLength: EventEmitter<any> = new EventEmitter();
  @Input() isChallenge: boolean = false;
  protected readonly environment = environment;
  @Input() isUserProfile: boolean = true;
  @Input() isTournament = false;
  @Input() userSlug: string;
  isUpdated: boolean = false;
  constructor(private globalService: GlobalService, private gamerService: GamerService, private store: Store, private modalService: NzModalService,
              private cookieService: CookieService, private router: Router, public authService: AuthService) {
  }

  ngOnInit() {
    let userSlug = JSON.parse(localStorage.getItem('userAuth') || '').slug;
    if (!this.isChallenge) {
      this.store.dispatch(new GetLeagueAccounts(this.userSlug ? this.userSlug : userSlug, this.accountId, this.tournamentCode))
      this.accounts$.subscribe(data => {
        this.accountLength.emit(data?.length)
      })
      console.log(this.selectedAccount)
    }
    // this.accounts$.subscribe(data => {
    //   console.log(data)
    // })
  }

  selectAccount(account: any, index: number) {
    this.selectedAccount = account
    this.setSelectedAccount.emit(account)
  }

  deleteAccount(account: any, index: number) {
    this.store.dispatch(new DeleteLeagueAccount(account.id))
  }

  VerifyAccount(account: any) {
    this.modalService.create({
      nzContent: LinkLeagueAccountComponent,
      nzFooter: null,
      nzData: {
        currentStep: 1,
        account: account
      },
      nzWidth: '600px',

    })
  }
  updateRank(account: any) {
    this.store.dispatch(new UpdatePublisherAccount(account.id))

  }
  closeModal() {
    this.modalService.closeAll()
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
