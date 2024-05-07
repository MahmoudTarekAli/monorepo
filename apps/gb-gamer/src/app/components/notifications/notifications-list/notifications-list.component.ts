import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Actions, ofActionCompleted, ofActionDispatched, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {ArenasState} from "../../../modules/arena/state/arenas.state";
import {Observable} from "rxjs";
import {Arena} from "../../../shared/models/arena";
import {NotificationsState} from "../state/notifications.state";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {
  AcceptNotificationRequest, DeclineNotificationRequest,
  GetNotifications,
  GetNotificationsRequest,
  ReadNotification
} from "../state/notifications.action";
import {GlobalService} from "../../../shared/service/global.service";
import {Router, RouterLink} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";
import {
  RadioButtonsFiltersComponent
} from "../../../shared/components/radio-buttons-filters/radio-buttons-filters.component";
import {ButtonComponent} from "../../button/button.component";

import {SliceArrayPipe} from "../../../shared/pipes/sliceArray.pipe";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {RequiredInputsComponent} from "../../../shared/modals/required-inputs/required-inputs.component";
import {HandleError, SetNotifications} from "../../../shared/state/global.action";
import {TeamsService} from "../../../modules/teams/service/teams.service";
import {AuthService} from "../../../modules/authentication/services/auth.service";
import {NzModalService} from "ng-zorro-antd/modal";
import {TranslateModule} from "@ngx-translate/core";
import {NgScrollbar} from "ngx-scrollbar";

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [CommonModule, LoadingIndicatorComponent, RouterLink, RadioButtonsFiltersComponent, ButtonComponent, SliceArrayPipe, InfiniteScrollModule, TranslateModule, NgScrollbar],
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent {
  @Select(ArenasState.getFeaturedArenas) featuredArenas$: Observable<Arena[]>;
  @Select(NotificationsState.getNotifications) notifications$: Observable<any>;
  @Select(NotificationsState.getRequests) requests$: Observable<any>;
  @Select(hasActionsExecuting([GetNotifications])) getNotificationsIsExecuting$: Observable<Boolean>;
  @Select(hasActionsExecuting([GetNotificationsRequest])) getRequestsIsExecuting$: Observable<Boolean>;
  @Input() type = ''
  @Input() isComponent = false
  page = 1
  totalPages = 1
  loadingNotifications = false
  isFetchingData = true
  loadFirstTime = true

  constructor(private store: Store, public globalService: GlobalService, private teamService: TeamsService, private authService: AuthService,
              public router: Router, private actions$: Actions, private modalService: NzModalService) {
    console.log(this.globalService.selectedLanguage)
  }

  ngOnInit() {
    this.loadingNotifications = true
    if (this.router.url.includes('notifications') && this.isComponent) {
      this.store.dispatch(new GetNotifications(1))
    }
    this.notifications$.subscribe(res => {
      console.log(res)
      if (res?.meta_data) {
        this.totalPages = res.meta_data.total_pages
      }

    })

    this.actions$.pipe(ofActionDispatched(GetNotifications)).subscribe((res: any) => {
      if (this.isFetchingData) {
        this.isFetchingData = false
      }

    })
    this.actions$.pipe(ofActionSuccessful(GetNotifications)).subscribe((res: any) => {
      this.loadingNotifications = false
      this.isFetchingData = true;

    })

  }

  navigateTo(notify: any) {
    if (notify.url) {
      if (notify.endpoint === 'gbarena') {
        this.router.navigateByUrl(notify.url);
      } else if (notify.endpoint === 'store') {
        window.open(`${environment.storeUrl}${notify.url}`, '_blank')

      } else {
        window.open(`${environment.organizerUrl}${notify.url.includes('tournaments') ? notify.url.replace('tournaments', 'tournament') : notify.url}`, '_blank')
      }
    }
    this.store.dispatch(new ReadNotification(notify.id))
  }

  acceptRequest(request: any) {
    const i = request?.relations.findIndex(x => x.class === 'Tournament')
    console.log(i)
    if (i !== -1 && request.relations[i]?.teamMembersSupportedRequiredInputsKeys.length) {
      const  tournament = request.relations[i]
      this.teamService.compareRequiredInputs(tournament.code, this.authService.userAuth.slug).subscribe(res => {
        this.modalService.create({
          nzContent: RequiredInputsComponent,
          nzData: {
            selectedRequiredInputs: res,
            connectedAccountsRequired: tournament?.connected_accounts_required,
            tournament: tournament,
            isTournament: true
          },
          nzClassName: 'challenge-modal',
          nzFooter: null,
          nzCentered: true,
          nzWidth: '600px',
        }).afterClose.subscribe((result: any) => {
          if (result?.action === 'confirm') {
            this.store.dispatch(new AcceptNotificationRequest(request.id , result?.requiredInputs , result.required_accounts))
            this.actions$.pipe(ofActionSuccessful(AcceptNotificationRequest)).subscribe((res: any) => {
              this.router.navigateByUrl(`/tournaments/${tournament.code}`)

            })
          }
        })
      })
    } else {
      this.store.dispatch(new AcceptNotificationRequest(request.id))
    }
  }

  declineRequest(id: number) {
    this.store.dispatch(new DeclineNotificationRequest(id))
  }

  onScrollDown(event) {
    // console.log(event)
    // console.log((event.target.offsetHeight + event.target.scrollTop) + 50, event.target.scrollHeight)
    // if (event.target.offsetHeight + event.target.scrollTop + 50 >= event.target.scrollHeight) {
    if (event && this.isComponent && this.page < this.totalPages) {
      if (this.isFetchingData) {
        this.page += 1
        this.store.dispatch(new GetNotifications(this.page))
      }

    }
    // }
  }
}

