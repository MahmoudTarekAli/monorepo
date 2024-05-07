import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NzTableModule} from "ng-zorro-antd/table";
import {SectionComponent} from "../../../../components/section/section.component";
import {ButtonComponent} from "../../../../components/button/button.component";
import {CountryPipe} from "../../../../shared/pipes/country.pipe";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {Select, Store} from "@ngxs/store";
import {GetEvent, GetEventArenas} from "../../../events/state/event.action";
import {Observable} from "rxjs";
import {Arena} from "../../../../shared/models/arena";
import {EventState} from "../../../events/state/event.state";
import {SliceArrayPipe} from "../../../../shared/pipes/sliceArray.pipe";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {LoadingIndicatorComponent} from "../../../../shared/components/loading-indicator/loading-indicator.component";

@Component({
  selector: 'app-shared-riot-table',
  standalone: true,
  imports: [CommonModule, NzTableModule, SectionComponent, ButtonComponent, CountryPipe, TranslateModule, RouterLink, SliceArrayPipe, NzPaginationModule, LoadingIndicatorComponent],
  templateUrl: './shared-riot-table.component.html',
  styleUrls: ['./shared-riot-table.component.scss']
})
export class SharedRiotTableComponent implements OnInit{
  // displayedColumns: string[] = ['Rank' , 'Café Name' , 'Country' , 'Tier' , 'Prizes' ,   ''];
  displayedColumns: string[] = [ 'Café Name' , 'Country' ,  ''];
  @Input() showButton = false;
  @Input() sliceNumber = 0;
  @Select(EventState.getEventArenas) eventArenas$: Observable<any>;
  @Select(hasActionsExecuting([GetEventArenas])) getEventArenasIsExecuting$: Observable<Boolean>;

  constructor(private store:Store) {

  }
  ngOnInit() {
    this.store.dispatch(new GetEventArenas('riot-main-event'))

  }
  changePage(event: any) {
    this.store.dispatch(new GetEventArenas('riot-main-event', event))
  }

}
