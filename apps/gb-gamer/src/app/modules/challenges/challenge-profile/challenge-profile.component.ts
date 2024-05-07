import {Component, InputSignal, OnInit} from '@angular/core';
import {AdBannerComponent} from "../../../shared/components/ad-banner/ad-banner.component";
import {BannerCardComponent} from "../../../shared/components/banner-card/banner-card.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {
  AsyncPipe,
  DatePipe,
  DecimalPipe,
  LowerCasePipe,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
  UpperCasePipe
} from "@angular/common";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {ChallengesState} from "../state/challenges.state";
import {Challenge} from "../../../shared/models/challenge";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {
  ClaimScore,
  GetChallenge,
  GetIsJoinedChallenge,
  GetParticipants,
  JoinChallenge, UpdateSocketChallenge
} from "../state/challenges.action";
import {SectionComponent} from "../../../components/section/section.component";
import {InfoCardComponent} from "../../../shared/components/info-card/info-card.component";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {TranslateModule} from "@ngx-translate/core";
import {NzTableModule} from "ng-zorro-antd/table";
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";
import {CountryPipe} from "../../../shared/pipes/country.pipe";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {NzModalService} from "ng-zorro-antd/modal";
import {ViewRulesComponent} from "../modal/view-rules/view-rules.component";
import {ConnectLeagueAccountsComponent} from "../../../shared/components/connect-league-accounts/connect-league-accounts.component";
import {ReferFriendComponent} from "../modal/refer-friend/refer-friend.component";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {CountdownPipe} from "../../../shared/pipes/countdown.pipe";
import {ShowPasswordComponent} from "../modal/show-password/show-password.component";
import {AuthenticationState} from "../../authentication/state/authentication.state";
import {ScanQrcodeComponent} from "../modal/scan-qrcode/scan-qrcode.component";
import {SocketService} from "../../../shared/service/socket.service";
import {environment} from "../../../../environments/environment";
import * as io from 'socket.io-client';
import {GetMonthlyJoinCount} from "../../../shared/state/global.action";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {PremiumCardAlertComponent} from "../../../shared/components/premium-card-alert/premium-card-alert.component";
import {GlobalState} from "../../../shared/state/global.state";
import {AuthService} from "../../authentication/services/auth.service";
import {FormatCoinsPipe} from "../../../shared/pipes/format-coins.pipe";
import {MarqueeComponent} from "../../../shared/components/marquee/marquee.component";
import {GlobalService} from "../../../shared/service/global.service";
import {CHALLENGES_STATUS} from "../challenges.enum";
import {TournamentState} from "../../tournament/state/tournament.state";
import {FollowUnFollowArena} from "../../arena/state/arenas.action";
import {IsArenaFollowed} from "../../tournament/state/tournament.action";
import {ParticipantCardComponent} from "../../../shared/components/participant-card/participant-card.component";
import {DefaultImagePipe} from "../../../shared/pipes/default-image.pipe";
import {FilterPipe} from "../../../shared/pipes/arena-router.pipe";
import {ArenaCardComponent} from "../../../shared/components/arena-card/arena-card.component";
import {NzButtonModule} from "ng-zorro-antd/button";
import {EventRouterPipe} from "../../../shared/pipes/event-router.pipe";
import {AllowIpModalComponent} from "../modal/allow-ip-modal/allow-ip-modal.component";
import {NgScrollbar} from "ngx-scrollbar";
@UntilDestroy()
@Component({
  selector: 'app-challenge-profile',
  templateUrl: './challenge-profile.component.html',
  styleUrls: ['./challenge-profile.component.scss'],
  imports: [
    AdBannerComponent,
    BannerCardComponent,
    ButtonComponent,
    NgIf,
    AsyncPipe,
    SectionComponent,
    InfoCardComponent,
    NgForOf,
    NzAvatarModule,
    TranslateModule,
    NzTableModule,
    LoadingIndicatorComponent,
    CountryPipe,
    UpperCasePipe,
    NzPaginationModule,
    NzToolTipModule,
    DatePipe,
    CountdownPipe,
    RouterLink,
    FormatCoinsPipe,
    MarqueeComponent,
    ParticipantCardComponent,
    DefaultImagePipe,
    FilterPipe,
    ArenaCardComponent,
    NzButtonModule,
    FilterPipe,
    EventRouterPipe,
    DecimalPipe,
    NgClass,
    NgScrollbar,
    NgStyle,
    LowerCasePipe,
  ],
  providers: [NzModalService],
  standalone: true
})
export class ChallengeProfileComponent implements OnInit {
  @Select(ChallengesState.getChallenge) challenge$: Observable<any>;
  @Select(ChallengesState.getParticipants) participants$: Observable<any>;
  @Select(ChallengesState.getIsJoined) isUserJoined$: Observable<any>;
  @Select(AuthenticationState.isAuthenticated) isLoggedIn: Observable<{}>;
  @Select(GlobalState.getMonthlyJoinsCounts) monthlyJoinsCounts$: Observable<any>;
  @Select(TournamentState.isArenaFollowed) isArenaFollowed$: Observable<any>;
  CHALLENGE_STATUS = CHALLENGES_STATUS
  challengeId: string;
  displayedColumns: string[]
  loadingParticipants: boolean = false;
  loading: boolean = false;
  isClaimButton: boolean = false;
  convertScoreDate: any;
  date = new Date();
  isClaim: boolean = false;
  hasRequiredInputs = false
  shownRequiredInputsNames= []
  monthlyJoinsCount: number;
  monthlyJoinsLimit: number
  isMobileView: boolean;
  isFollowArena: boolean;
  constructor(private store: Store , private activatedRoute: ActivatedRoute, private modalService: NzModalService , private socket: SocketService,
              private actions:Actions , private authService:AuthService , private router: Router, private globalService:GlobalService) {
    this.store.select((state: { setting: any; }) => state.setting).subscribe(data => {
      const state = data.setting
      this.isMobileView = state.isMobileView;
    });

  }

  ngOnInit(): void {
    this.globalService.getSocialLoginError()
    this.isArenaFollowed$.subscribe(data => {
      console.log('isFollow' , data)
      this.isFollowArena = data
    })
    this.activatedRoute.params.subscribe(params => {
      this.challengeId = this.activatedRoute.snapshot.params['code'];

      this.activatedRoute.queryParams.subscribe(queryParams => {
        // console.log(queryParams)
        if (queryParams?.['invitation_code']) {
          const invitation_code = {id: this.challengeId, invitaion_code: queryParams?.['invitation_code']}
          sessionStorage.setItem('invitation_code', JSON.stringify(invitation_code))
        }
      })
      this.store.dispatch(new GetIsJoinedChallenge(this.challengeId));
      this.store.dispatch(new GetChallenge(this.challengeId));
      this.store.dispatch(new GetParticipants(this.challengeId, 1))
      this.loading = true;
      this.loadingParticipants = true;
      this.challenge$.subscribe((challenge: Challenge) => {
        if (challenge?.required_inputs?.data.length > 0){
          this.hasRequiredInputs = challenge?.required_inputs?.data.length > 0
          this.shownRequiredInputsNames = challenge?.required_inputs?.data.filter((x:any) => x.is_shown === true).map((x:any) => x.name)
        }
        if (challenge?.arena && this.authService.isLoggedIn){
          this.store.dispatch(new IsArenaFollowed(challenge?.arena?.id))

        }
      })
      this.participants$.subscribe((participants: any) => {
        if (participants?.meta){
          this.loadingParticipants = false;
          this.displayedColumns = ['#' , 'gamer_name' , 'rank'  , 'prizes_referrals' , participants.meta.score_type,   'champion'];
          this.displayedColumns = this.displayedColumns.concat(this.shownRequiredInputsNames)

        }
      })
      this.actions.pipe(ofActionSuccessful(GetChallenge)).subscribe(() => {
        this.loading = false;
      })
      this.actions.pipe(ofActionSuccessful (GetParticipants)).subscribe(() => {
        this.loadingParticipants = false;
      })
      this.isUserJoined$.pipe(untilDestroyed(this)).subscribe((data: any) => {

        if (data.isJoined === false){
          console.log(data)
          const user = JSON.parse(localStorage.getItem('userAuth'))
          if (this.authService.isLoggedIn){
            this.store.dispatch(new GetMonthlyJoinCount(user?.slug))
          }
        }
      })
      this.monthlyJoinsCounts$.pipe(untilDestroyed(this)).subscribe((data: any) => {
        if (data?.count || data?.limit){
          this.monthlyJoinsCount = data.count
          this.monthlyJoinsLimit = data.limit
        }
      })
      this.actions.pipe( untilDestroyed(this) , ofActionSuccessful(GetIsJoinedChallenge)).subscribe(() => {
        this.convertClaimButton()

      })
    })
    // const challengeNameSpace = io.io(environment.Socket + '/', {});
    // this.socket.listen(challengeNameSpace, 'challengeLeaderboard').subscribe((res: any) => {
    //   if (res.challenge_id === this.challengeId) {
    //     console.log(res)
    //     this.store.dispatch(new UpdateSocketChallenge(res))
    //
    //   }
    // })

  }
  changePage(event:number){
    this.store.dispatch(new GetParticipants(this.challengeId , event))
  }
  viewRules(challenge: Challenge){
   this.modalService.create({
     nzContent: ViewRulesComponent,
     nzFooter: null,
     nzCentered: true,
     nzData: {gameBanner: challenge?.game?.code,
       challengeRules:challenge?.rules},

     nzWidth: '600px',
     nzClassName:'challenge-modal'

   },)
  }
  followUnfollowArena(arena, type: string) {
    console.log(arena.slug)
    this.authService.checkAuthority()
    this.store.dispatch(new FollowUnFollowArena(arena.slug, type))
  }
  joinChallenge(challenge:Challenge){
      if (this.monthlyJoinsCount >= this.monthlyJoinsLimit && !this.authService.userAuth?.is_premium) {
         this.modalService.create({
          nzTitle: null,
          nzContent: PremiumCardAlertComponent,
          nzFooter: null,
          nzData: {type: 'challenges'},
          nzCentered: true,
          nzWidth: '600px',
          nzClassName:'challenge-modal',

        })
      } else {
        this.modalService.create({
          nzContent: ConnectLeagueAccountsComponent,
          nzData: {
            isBackground: true,
            accountId: challenge?.['game_id'],
            isChallengeRequiredInputs: challenge.required_inputs?.data.length > 0,
            challenge: challenge
          },
          nzClassName:'challenge-modal',
          nzFooter: null,
          nzCentered: true,
          nzWidth: '600px',
        }).afterClose.subscribe((result: any) => {
          if (result?.isJoined){
            const body:any = {publisher_account_id: result.selectedAccount.id , invitation_code: result?.referralCode}
            if (result?.required_inputs) {
              body['required_inputs'] = {'Cafe Name': result?.required_inputs}
            }

            this.store.dispatch(new JoinChallenge(this.challengeId , body))
          }
        })
      }

  }
  claimScore(challenge:Challenge){
    if(challenge.has_password) {
      this.modalService.create({
        nzContent: ShowPasswordComponent,
        nzData: {
        },
        nzClassName:'challenge-modal',
        nzFooter: null,
        nzCentered: true,
        nzWidth: '600px',
      }).afterClose.subscribe((result: any) => {
        if (result?.confirm === 'Confirmed'){
          console.log(result?.challengePassword)
          this.store.dispatch(new ClaimScore(this.challengeId , result?.challengePassword))
          this.actions.pipe(ofActionSuccessful(ClaimScore)).subscribe(() => {
            this.convertClaimButton()
          })
        }
      })
      return
    }
    if (challenge.password_type === 'qrcode') {
      this.modalService.create({
        nzContent: ScanQrcodeComponent,
        nzData: {
          isUserSide: true,
        },
        nzClassName:'challenge-modal',
        nzFooter: null,
        nzCentered: true,
        nzWidth: '600px',
      })
      return;
    }    this.store.dispatch(new ClaimScore(this.challengeId))
    this.actions.pipe(ofActionSuccessful(ClaimScore)).subscribe(() => {
      this.convertClaimButton()

    })

  }
  referFriend(joinedAccount: any , challenge){
    this.modalService.create({
      nzContent: ReferFriendComponent,
      nzData: {
        joinedAccount: joinedAccount,
        challenge

      },
      nzClassName:'challenge-modal',
      nzFooter: null,
      nzCentered: true,
      nzWidth: '600px',
    })
  }
  convertClaimButton() {
    this.isUserJoined$.pipe(untilDestroyed(this)).subscribe(res => {
      if (res?.next_score_claim_date) {
        // this.convertScoreDate = new Date((res?.next_score_claim_date.replace(/-/g, '/')) + ' UTC').toString()
        const now = new Date().getTime();
        const nextScoreClaimDate = new Date(res?.next_score_claim_date).getTime();
        if (nextScoreClaimDate >= now) {
          this.isClaim = true
          const diff = nextScoreClaimDate - new Date().getTime();
          console.log(Math.abs(diff))
          setTimeout(() => {
            this.isClaim = false
          }, Math.abs(diff));
        }
      }
    })
  }
  openScanQrCodeDialog(){
    this.modalService.create({
      nzContent: ScanQrcodeComponent,
      nzData: {
        isUserSide: false,
        challengeId: this.challengeId
      },
      nzFooter: null,
      nzCentered: true,
      nzWidth: '600px',
      nzClassName:'challenge-modal'
    })
  }
  openLocationModal(challenge){
    this.modalService.create({
      nzContent: AllowIpModalComponent,
      nzData: {
        challenge
      },
      nzClassName:'challenge-modal',
      nzFooter: null,
      nzCentered: true,
      nzWidth: '600px',
    })
  }
routeLogin(){
  window.location.href = environment.sso_url + '?source=' + window.origin + this.router.url
}
  manageChallenge(challenge:any) {
    window.location.href = environment.organizerUrl + '/challenges/' + challenge.id
  }
}
