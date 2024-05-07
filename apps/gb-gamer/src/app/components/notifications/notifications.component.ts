import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {SectionComponent} from "../section/section.component";
import {Select, Store} from "@ngxs/store";
import {ArenasState} from "../../modules/arena/state/arenas.state";
import {Observable} from "rxjs";
import {Arena} from "../../shared/models/arena";
import {GlobalService} from "../../shared/service/global.service";
import {environment} from "../../../environments/environment";
import {Router, RouterLink} from "@angular/router";
import {RadioButtonsFiltersComponent} from "../../shared/components/radio-buttons-filters/radio-buttons-filters.component";
import {LoadingIndicatorComponent} from "../../shared/components/loading-indicator/loading-indicator.component";
import {NotificationsState} from "./state/notifications.state";
import {GetNotifications, GetNotificationsRequest, ReadAllNotification} from "./state/notifications.action";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {FormsModule} from "@angular/forms";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {TranslateModule} from "@ngx-translate/core";
import {NotificationsListComponent} from "./notifications-list/notifications-list.component";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NzDropDownModule, SectionComponent, RadioButtonsFiltersComponent, LoadingIndicatorComponent, RouterLink, NzPaginationModule, NzTabsModule, FormsModule, NzRadioModule, NzBadgeModule, TranslateModule, NotificationsListComponent],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit{
  type:string = ''
  notificationsFilters = [{name: 'notifications', value: ''} , {name: 'requests', value: 'requests'}]
  @Select(NotificationsState.getUnreadRequestsCount) RequestsCount$: Observable<number>;
  @Select(NotificationsState.getUnreadNotificationsCount) NotificationsCount$: Observable<number>;
  constructor(private store:Store) {
 }
 ngOnInit(): void {
    this.filterByNotification('')

 }
    filterByNotification(filter:any){
        console.log(this.type)
      if(this.type === 'requests') {
        this.store.dispatch(new GetNotificationsRequest(1))
      } else {
        this.store.dispatch(new GetNotifications(1))
      }
  }
  readAllNotification(){
    this.store.dispatch(new ReadAllNotification())
  }

}
