import {Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzIconModule} from "ng-zorro-antd/icon";
import {ButtonComponent} from "../button/button.component";
import {Select, Store} from "@ngxs/store";
import {AuthenticationState} from "../../modules/authentication/state/authentication.state";
import {BehaviorSubject, Observable} from "rxjs";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {User} from "../../modules/authentication/models/user";
import {ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {SectionComponent} from "../section/section.component";
import {InfoCardComponent} from "../../shared/components/info-card/info-card.component";
import {GlobalState} from "../../shared/state/global.state";
import {GetMonthlyJoinCount, SetSearchKey} from "../../shared/state/global.action";
import {
  ConversationListComponent
} from "../../modules/messenger/components/conversation-list/conversation-list.component";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {MessengerState} from "../../modules/messenger/state/messenger.state";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {
  AddSocketNotification,
  GetNotifications,
  GetNotificationsRequest,
  GetUnReadNotificationsCount, GetUnReadRequestsCount
} from "../notifications/state/notifications.action";
import {
  RadioButtonsFiltersComponent
} from "../../shared/components/radio-buttons-filters/radio-buttons-filters.component";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {FormsModule} from "@angular/forms";
import {NotificationsState} from "../notifications/state/notifications.state";
import * as io from "socket.io-client";
import {environment} from "../../../environments/environment";
import {SocketService} from "../../shared/service/socket.service";
import {AuthService} from "../../modules/authentication/services/auth.service";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {UserMenuComponent} from "../user-menu/user-menu.component";
import {FormatCoinsPipe} from "../../shared/pipes/format-coins.pipe";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NgProgressComponent} from "ngx-progressbar";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {
  ProductionServerAlertComponent
} from "../../shared/components/production-server-alert/production-server-alert.component";
import {TranslateModule} from "@ngx-translate/core";
import {GlobalService} from "../../shared/service/global.service";
// import {GbarenaNavbarComponent} from "@gbarena/gbarena-navbar";
import {SetStateActionNgxs} from "../../store/setting_ngxs/actions";
import {NotificationsListComponent} from "../notifications/notifications-list/notifications-list.component";
import {GamerService} from "../../modules/gamer/service/gamer.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NzMenuModule, NzButtonModule, NzInputModule, NgOptimizedImage, ButtonComponent, NzAvatarModule,
    NzDropDownModule, NzDividerModule, RouterLink, SectionComponent, InfoCardComponent,
    RadioButtonsFiltersComponent, NzRadioModule, FormsModule, NzBadgeModule, ConversationListComponent, NzPopoverModule, FormsModule, NzDrawerModule,
    RouterLinkActive, UserMenuComponent, FormatCoinsPipe, NzToolTipModule, NgProgressComponent, NzAlertModule,
    ProductionServerAlertComponent, TranslateModule, NotificationsListComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Select(AuthenticationState.isAuthenticated) isLoggedIn: Observable<{}>;
  @Select(AuthenticationState.getUser) userData: Observable<User>;
  @Select(GlobalState.getCoins) coins$: Observable<number>;
  @Select(MessengerState.getMessengerCount) messengerCount$: Observable<number>;
  @Select(NotificationsState.getUnreadRequestsCount) RequestsCount$: Observable<number>;
  @Select(NotificationsState.getUnreadNotificationsCount) NotificationsCount$: Observable<number>;
  isMobileView: boolean;

  visible: boolean
  messengerVisible: boolean
  messengerCount: number
  link = false;
  notificationsFilters = [{name: 'notifications', value: ''}, {name: 'requests', value: 'requests'}]
  filterValue = ''
  searchKey = ''
  selectedFilter = 'all'
  userMenuVisible = false;
  menuViewName = '';
  selectedLanguage = new  BehaviorSubject('en-US');
  isMenuViewSwap = true;
  page = 1
  environment = environment;
  user: any;
  constructor(private store: Store, private activatedRoute: ActivatedRoute,
              public router: Router, public authService: AuthService, public globalService: GlobalService,
              private gamerService:GamerService) {

    this.userData.subscribe(data => {
      if (data) {
        this.user = data
        this.store.dispatch(new GetUnReadNotificationsCount())
        this.store.dispatch(new GetUnReadRequestsCount())

      }
    })
    this.messengerCount$.subscribe(count => {
      this.messengerCount = count
    })
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchKey = params['search_query']
      this.page = params['page']
      if (params['filter']) {
        this.selectedFilter = params['filter']
      } else {
        this.selectedFilter = 'all'
      }
    });
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting
      this.isMobileView = state.isMobileView;
    });
  }


  ngOnInit() {

    // document.body.addEventListener('click', (event) => {
    //   console.log(event)
    //   // @ts-ignore
    //   if (this.menuViewName &&  event?.target.classList.contains('.users')) {
    //     console.log(event)
    //
    //     console.log('here')
    //     this.menuViewName = '';
    //   }
    // });
  }
  search() {
    if (this.searchKey) {
      this.router.navigateByUrl(`/search?search_query=${encodeURIComponent(this.searchKey)}&filter=${this.selectedFilter}&page=1`)
    }
    // this.store.dispatch(new SetSearchKey(this.searchKey, this.selectedFilter))

  }

  searchMobile() {
    this.router.navigateByUrl(`/search?filter=all&page=1`)
  }

  showHideMessengerMenu(event: any) {
    console.log(event)
    this.messengerVisible = !this.messengerVisible
  }

  openNotification() {
    this.store.dispatch(new GetNotifications(1))

  }
  openDrawer() {
    this.userMenuVisible = !this.userMenuVisible
    this.getMonthlyJoinCount()
  }

  filterByNotification(filter: any) {
    this.filterValue = filter
    console.log(filter)
    if (filter === 'requests') {
      this.store.dispatch(new GetNotificationsRequest(1))
    } else {
      this.store.dispatch(new GetNotifications(1))
    }
  }

  login() {
    // this.cookies.set('source', window.origin + this.router.url, {domain: '.gbarena.com', path: '/',expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1)})
    window.location.href = environment.sso_url + '?source=' + window.origin + this.router.url
  }

  routeSignUp() {
    window.location.href = environment.sso_url + '/signup?source=' + window.origin + this.router.url
  }

  changeMenuViewName(name: string) {
    this.menuViewName = name
  }

  changeLanguage(lang:string) {
    this.globalService.selectedLanguage = lang;
    this.store.dispatch(
      new SetStateActionNgxs({
        locale: lang,
      }),
    )
    if (this.authService.isLoggedIn) {
      const data = {language: lang}
      const formData = new FormData();
      formData.append('data', JSON.stringify(data));
      this.gamerService.updateProfile(formData).subscribe(res => {
      })
    }
  }

  getMonthlyJoinCount() {
    this.userData.subscribe(data => {
      if (!data.is_premium) {
        this.store.dispatch(new GetMonthlyJoinCount(data.slug))
      }
    })
  }

  clickMe(event: any) {
    if (event === false) {
      setTimeout(() => {
        this.changeMenuViewName('')
      }, 800)
    }
  }
}
