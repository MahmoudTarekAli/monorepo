import {Component, OnInit, Input} from '@angular/core';
import {Router, NavigationStart, ActivatedRoute, NavigationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';
import * as _ from 'lodash';
import {Select, Store} from '@ngxs/store'
import {MenuService} from 'src/app/services/menu';
import {SetStateActionNgxs} from 'src/app/store/setting_ngxs/actions';
import {MenuConfig} from '../../../../../services/menu/config'
import {
  TournamentProcessState
} from '../../../../../modules/edit-tournament/tournament-process/state/tournament-process.state'
import {Observable} from 'rxjs'
import {fadeInDownOnEnterAnimation, fadeOutUpOnLeaveAnimation} from "angular-animations";
import {GlobalState} from "../../../../../shared/state/global.state";
import {SidebarEnum} from "../../../../../core/sidebar.enum";
import {BRACKET_TYPES, TOURNAMENT_UPDATE_TYPE} from "../../../../../core/tournament.enum";
import {AnimationOptions} from "ngx-lottie";
import {
  TournamentCheckIn, TournamentRegistration,
  UpdateTournament
} from "../../../../../modules/edit-tournament/tournament-process/state/tournament-process.action";
import {HandleError} from "../../../../../shared/state/global.action";
import {
  TournamentProgressService
} from "../../../../../modules/edit-tournament/tournament-process/tournament-progress/services/tournament-progress.service";
import {SharedService} from "../../../../../modules/edit-tournament/service/shared.service";
import {environment} from "../../../../../../environments/environment";
import {StatusColor} from "../../../../../core/match-status.enum";
import {NzDrawerService} from "ng-zorro-antd/drawer";
import {TeamViewComponent} from "../../../../../shared/components/team-view/team-view.component";
import {ShareModalComponent} from "../../../../../shared/dialogs/share-modal/share-modal.component";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'cui-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss'],
  animations: [
    fadeInDownOnEnterAnimation({anchor: 'enter', duration: 800, translate: '30px'}),
    fadeOutUpOnLeaveAnimation({anchor: 'leave', duration: 400, translate: '30px'}),
  ],
})
export class MenuLeftComponent implements OnInit {
  menuColor: string;
  isMenuShadow: boolean;
  isMenuUnfixed: boolean;
  isSidebarOpen: boolean;
  isMobileView: boolean;
  leftMenuWidth: number;
  isMenuCollapsed: boolean;
  logo: string;
  menuData: any[];
  tourData: any[];
  menuDataActivated: any[];
  role: string;
  isMobileMenuOpen: boolean;
  collapseArray = []
  tournamentCode: string
  private Menu = new MenuConfig(this.activatedRoute);
  isValid: boolean
  tournamentData: any
  options: AnimationOptions = {
    path: 'assets/121709-warning.json',
  };
  statusColor: any = StatusColor
  private gbUrl =   environment.gbUrl
  isVisible = false;
  @Select(TournamentProcessState.getTournament) getTournament$: Observable<any>;
  @Select(TournamentProcessState.getAuthority) getAuthority$: Observable<any>;
  tournamentTitleStyle = {padding: '0 10px 10px 10px'}
  constructor(private activatedRoute: ActivatedRoute, private menuService: MenuService,
              private tournamentProgressService: TournamentProgressService,
              private sharedService: SharedService, private modalService: NzModalService,
              private store: Store, public router: Router) {
    this.store.select(state => state.setting).subscribe(data => {
      const state = data.setting
      this.menuColor = state.menuColor;
      this.isMenuShadow = state.isMenuShadow;
      this.isMenuUnfixed = state.isMenuUnfixed;
      this.isSidebarOpen = state.isSidebarOpen;
      this.isMobileView = state.isMobileView;
      this.leftMenuWidth = state.leftMenuWidth;
      this.isMenuCollapsed = state.isMenuCollapsed;
      this.collapseArray = state.isOpenSideMenuCollapseArray
      this.logo = state.logo;
    });
    this.menuData = this.Menu.calcMenu()
    this.tourData = this.Menu.calcTourMenu(this.activatedRoute.firstChild.snapshot.params.id)
    router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((event: NavigationStart) => {
      this.tourData = this.Menu.calcTourMenu(event.url.split('tournament/').pop().split('/')[0])
    })
    this.getTournament$.subscribe(data => {
      this.tournamentCode = data?.code
    })
    // this.menuService.getMenuData().subscribe(menuData => (this.menuData = menuData))
    // this.menuService.getCreateTournamentData().subscribe(tourData => (this.tourData = tourData))
  }
 objStatus = {in_progress: '#00000'}
  @Select(TournamentProcessState.getTournament) tournament: Observable<any>;
  @Select(GlobalState.getMissingFields) getMissingFields$: Observable<any>;

  ngOnInit() {

    const routeUrl = this.router.url.includes('bracketType') ? this.router.url.split("/bracketType")[0] : this.router.url.split("?")[0]
    this.menuWithRoute(routeUrl)
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects.includes('bracketType')) {
        this.menuWithRoute(event.urlAfterRedirects ? event.urlAfterRedirects.split("/bracketType")[0] : null)

      } else {
        this.menuWithRoute(event.urlAfterRedirects ? event.urlAfterRedirects.split("?")[0] : null)
      }
    });

    if (this.collapseArray?.length === 0) {
      this.collapseArray = Array(this.menuDataActivated.length)
      for (let i = 0; i < this.collapseArray.length; i++) {
        this.collapseArray[i] = true
      }
      this.store.dispatch(
        new SetStateActionNgxs({
          isOpenSideMenuCollapseArray: this.collapseArray,
        }),
      );
    }

    this.tournament.subscribe(data => {
      this.tournamentData = data
      // console.log(this.tournamentData)
    })
  }

  menuWithRoute(url) {

    if (url.includes('process') || url.includes('manage')) {
      // this.getAuthority$.subscribe(data => {
        if (this.sharedService.authorityType) {
          if (this.sharedService.authorityType === 'Moderator' || this.sharedService.authorityType === 'None') {
            this.tourData = this.tourData.filter(item => item.title !== SidebarEnum.edit_tournament)
            this.activateMenu(url, this.tourData);
          } else {
            this.activateMenu(url, this.tourData);
          }
          this.missingFields()

        }
      // })
    } else {
      this.activateMenu(url, this.menuData);
      this.missingFields()
    }

  }

  activateMenu(url: any, menuData) {
    menuData = JSON.parse(JSON.stringify(menuData))
    // this.tournament.subscribe(tournament => {
    //   const isAllFfa = tournament?.tree?.data?.every(tour => {
    //     return tour.type !== BRACKET_TYPES.FREE_FOR_ALL
    //   })
    //   // console.log(isAllFfa)
    //   if (isAllFfa) {
    //     this.tourData[1].children = this.tourData[1].children.filter(item => item.title !== SidebarEnum.issues_claims)
    //   }
    // })
    // console.log({ url })
    const pathWithSelection = this.getPath({url}, menuData, (entry: any) => entry, 'url')
    if (pathWithSelection) {
      pathWithSelection.pop().selected = true
      _.each(pathWithSelection, (parent: any) => (parent.open = true))
    }
    this.menuDataActivated = menuData.slice()
    // console.log(this.menuDataActivated)
  }

  getPath(
    element: any,
    source: any,
    property: any,
    keyProperty = 'key',
    childrenProperty = 'children',
    path = [],
  ) {
    let found = false;
    const getElementChildren = (value: any) => _.get(value, childrenProperty);
    const getElementKey = (value: any) => _.get(value, keyProperty);
    const key = getElementKey(element);
    return (
      _.some(source, (e: any) => {
        // console.log(key , getElementKey(e) , e)
        // console.log(key === getElementKey(e))
        if (getElementKey(e) === key) {
          path.push(e);
          // console.log('kirooo')

          return true;
        } else {
          // console.log(this.getPath(
          //   element,
          //   getElementChildren(e),
          //   property,
          //   keyProperty,
          //   childrenProperty,
          //   path.concat(e),
          // ))

          return (found = this.getPath(
            element,
            getElementChildren(e),
            property,
            keyProperty,
            childrenProperty,
            path.concat(e),
          ));
        }
      }) &&
      (found || _.map(path, property))
    );
  }

  toggleSettings() {
    this.store.dispatch(
      new SetStateActionNgxs({
        isSidebarOpen: !this.isSidebarOpen,
      }),
    );
  }

  toggleMobileMenu() {
    this.store.dispatch(
      new SetStateActionNgxs({
        isMobileMenuOpen: false,
      }),
    );
  }

  onCollapse(value: any) {
    this.store.dispatch(
      new SetStateActionNgxs({
        isMenuCollapsed: this.isMenuCollapsed,
      }),
    );
  }

  changeCollapse(value, index) {
    this.collapseArray[index] = value
    this.store.dispatch(
      new SetStateActionNgxs({
        isOpenSideMenuCollapseArray: this.collapseArray,
      }),
    );
    // console.log(value, index)
  }

  public trackBy(index, item) {
    return item.title;
  }

  toggleSideMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed
    this.onCollapse(this.isSidebarOpen)
  }

  publishTournament() {
    this.tournamentProgressService.publishTournament(this.tournamentCode).subscribe(tournament => {
      this.store.dispatch(new UpdateTournament(tournament.data, this.tournamentCode, TOURNAMENT_UPDATE_TYPE.PUBLISH_TOURNAMENT_UPDATE))
    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }

  cancelTournament() {
    // console.log(this.tournamentData)
    this.tournamentData.status = 'Cancelled'
    // console.log(this.tournamentData)
    this.store.dispatch(new UpdateTournament(this.tournamentData, this.tournamentCode, TOURNAMENT_UPDATE_TYPE.PUBLISH_TOURNAMENT_UPDATE))
  }
  TournamentRegistration(e) {
    this.store.dispatch(new TournamentRegistration(this.tournamentCode, e === true ? 'on' : 'off'))
  }

  gamerView() {
    window.open(`${this.gbUrl}tournaments/${this.tournamentCode}/summary`, '_blank')
  }

  getColorForStatus(status: string) {
    document.documentElement.style.setProperty('--status-color', status);
  }
  openShareDialog() {
    console.log(this.tournamentCode)
    this.modalService.create({
      nzTitle: null,
      nzContent: ShareModalComponent,
      nzFooter: null,
      nzWidth: this.isMobileView  ? '90%' : '650px',
      nzClassName: 'share-modal',
      nzData: { tournamentCode: this.tournamentCode },
    });

  }
  closeDialog() {
    this.isVisible = false;
  }
  missingFields(){
    this.getMissingFields$.subscribe(data => {
      for (const tour of this.menuDataActivated) {
        for (const missing of data) {
          if (tour.children) {
            for (const child of tour.children) {
              if (child.title === missing.title) {
                child.missingFields = true
              }
            }
          }
        }
      }
      this.tourData = this.menuDataActivated
    })
  }
}

