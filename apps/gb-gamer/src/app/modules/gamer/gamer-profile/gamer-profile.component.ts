import {Component, OnInit} from '@angular/core';
import {BannerCardComponent} from "../../../shared/components/banner-card/banner-card.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {GamerService} from "../service/gamer.service";
import {GamesState} from "../../games/state/games.state";
import {Observable} from "rxjs";
import {Game} from "../../../shared/models/game";
import {GamerProfile} from "../../../shared/models/gamer";
import {GamerState} from "../state/gamer.state";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {TranslateModule} from "@ngx-translate/core";
import {InviteMember} from "../../teams/state/team.action";
import {AuthService} from "../../authentication/services/auth.service";
import {
  AcceptFriendRequest,
  AddFriend,
  CancelFriendRequest, GetGamerProfile, GetGamerRelationships,
  RemoveFriendRequest,
  ResetGamerState
} from "../state/gamer.action";
import {AuthenticationState} from "../../authentication/state/authentication.state";
import {User} from "../../authentication/models/user";
import {CountryPipe} from "../../../shared/pipes/country.pipe";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzModalService} from "ng-zorro-antd/modal";
import {
  EditReferenceNumberComponent
} from "../../../shared/modals/edit-reference-number/edit-reference-number.component";
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";

@Component({
  selector: 'app-gamer-profile',
  templateUrl: './gamer-profile.component.html',
  styleUrls: ['./gamer-profile.component.scss'],
  imports: [
    BannerCardComponent,
    ButtonComponent,
    RouterOutlet,
    NgIf,
    AsyncPipe,
    NzTabsModule,
    NgForOf,
    RouterLink,
    TranslateModule,
    RouterLinkActive,
    NgClass,
    CountryPipe,
    NzAvatarModule,
    LoadingIndicatorComponent
  ],
  standalone: true
})
export class GamerProfileComponent implements OnInit {
  @Select(GamerState.getGamerProfile) Gamer$: Observable<GamerProfile>;
  @Select(GamerState.getRelations) Relations$: Observable<any>;
  @Select(AuthenticationState.getUser) userData$: Observable<User>;

  slug: string;
  tabs = []
  loading = false
  constructor(private store: Store, public gamerService: GamerService, private router: Router, private authService: AuthService , private activatedRoute:ActivatedRoute,
              private modalService: NzModalService , private actions:Actions ) {
    const gamer = JSON.parse(localStorage.getItem('userAuth') || '{}')
    this.activatedRoute.params.subscribe(params => {
      // this.loading = true
      this.gamerService.isAccountOwner = this.gamerService.isOwner(params['slug'])
      this.tabs =  [
        {
          title: 'common.myActivity',
          path: `my-activity`,
          isOwner: true
        },
        {
          title: 'common.esports',
          path: `esports`,
          isOwner: true

        },
        // {
        //   title: 'friends',
        //   path: `friends`,
        //   isOwner: true
        // },
        {
          title: 'common.teams',
          path: `teams`,
          isOwner: this.gamerService.isAccountOwner

        },
        {
          title: 'common.prizes',
          path: `prizes`,
          isOwner: this.gamerService.isAccountOwner
        }
      ];
      this.gamerService.slug = params['slug'];
      this.store.dispatch(new ResetGamerState())
      this.store.dispatch(new GetGamerProfile(this.gamerService.slug))
      this.actions.pipe(ofActionSuccessful(GetGamerProfile)).subscribe((res:any) => {
        // this.loading = false;
      })
    })
    this.Gamer$.subscribe((res:any) => {
      if (res?._id && res?._id !== gamer?.id) {
        this.store.dispatch(new GetGamerRelationships(res?._id))
      }
    })
  }

  ngOnInit() {

  }

  addFriend(recipientId: any) {
    const body = {
      recipient_id: recipientId,
      sender_id: this.authService.userAuth.id,
      type: "FriendshipRequest",
    }
    this.store.dispatch(new AddFriend(body))
  }

  cancelRequest(requestId: any) {
    this.store.dispatch(new CancelFriendRequest(requestId))
  }

  acceptRequest(requestId: any) {
    this.store.dispatch(new AcceptFriendRequest(requestId))

  }

  removeFriend(requestId: any) {
    this.store.dispatch(new RemoveFriendRequest(requestId))
  }
  editRefNumberModal(referenceNumber: any) {
    this.modalService.create({
      nzContent: EditReferenceNumberComponent,
      nzFooter: null,
      // nzCentered: true,
      nzData: {referenceNumber},

      nzWidth: '600px',
      nzClassName:'challenge-modal'

    },)
  }
  onTabSelected(index: number): void {
    this.router.navigateByUrl(this.tabs[index].path);
  }
}
