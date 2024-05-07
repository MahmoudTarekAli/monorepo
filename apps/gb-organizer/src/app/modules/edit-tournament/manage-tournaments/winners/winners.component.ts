import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {WinnersService} from "./services/winners.service";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {TournamentProcessState} from "../../tournament-process/state/tournament-process.state";
import {Observable, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {GetTournament} from "../../tournament-process/state/tournament-process.action";
import {GetCountries, HandleError, SetMissingFields} from "../../../../shared/state/global.action";
import {SidebarEnum} from "../../../../core/sidebar.enum";
import {AuthenticationState} from "../../../authentication/state/authentication.state";
import {TranslateService} from "@ngx-translate/core";
import {GlobalState} from "../../../../shared/state/global.state";
import {ParticipantsService} from "../participants/services/participants.service";
import {SharedService} from "../../service/shared.service";
import {TeamViewComponent} from "../../../../shared/components/team-view/team-view.component";
import {NzDrawerService} from "ng-zorro-antd/drawer";
import {environment} from "../../../../../environments/environment";
import {Data} from "@angular/router";
import {SendMessageComponent} from "../dialogs/send-message/send-message.component";
import {NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrls: ['./winners.component.scss']
})
export class WinnersComponent implements OnInit {
  @Select(TournamentProcessState.getTournament) getTournament$: Observable<any>
  @Select(AuthenticationState.getAuth) user$: Observable<{}>
  @Select(GlobalState.getCountriesList) Countries: Observable<any>;

  private readonly unsubscribe$: Subject<void> = new Subject();
  winners: any
  loading = true
  displayedColumns = []
  filterDisplayedColumns = []
  tournamentCode: string
  filterBadge = false;
  popoverFilterVisible = false;
  showDisplayedColumns: any
  isCountryValueChanged = false;
  selectedCountry: any
  pageIndex = 0
  pageSize = 20
  teamMember
  drawerRef
  isMobView
  gbUrl = environment.gbUrl;
  listOfData
  listOfCurrentPageData: readonly Data[] = []
  isChecked
  setOfCheckedId = []
  checked = false

  @ViewChild('drawerFooter', {static: true}) drawerFooter: TemplateRef<any>;
  @ViewChild('drawerTitle', {static: true}) drawerTitle: TemplateRef<any>;
  constructor(private winnersServices: WinnersService, private drawerService: NzDrawerService, private modalService: NzModalService,
              private participantsService: ParticipantsService, private sharedService: SharedService, private actions$: Actions, private translateService: TranslateService, private store: Store) {
  }

  ngOnInit(): void {
    this.store.select(state => state.setting).subscribe(data => {
      this.isMobView = data.setting.isMobileView
    })

    this.store.dispatch(new GetCountries())


    this.getTournament$.subscribe(tournament => {
      console.log(tournament)
      if (tournament?.code) {
        this.tournamentCode = tournament.code
        this.getWinners()
      }
      if (tournament?.participants_type === 'single') {
        this.displayedColumns = ['participant_name', 'country']
        if (tournament.supportedRequiredInputsKeys) {
          tournament.supportedRequiredInputsKeys.forEach(element => {
            this.displayedColumns?.push(element.placeholder)
          })
        }
      } else if (tournament?.participants_type === 'teams') {
        this.displayedColumns = ['participant_name', 'players', 'country']
        console.log(tournament.supportedRequiredInputsKeys)
        if (tournament.supportedRequiredInputsKeys) {
          tournament.supportedRequiredInputsKeys.forEach(element => {
            console.log(element)
            this.displayedColumns?.push(element.placeholder)
          })
          console.log(this.displayedColumns)
        }

      }
      if (tournament?.participants_type) {
        this.user$.subscribe((res: any) => {
          console.log(res)
          if (res?.roles) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < res.roles.length; i++) {
              if (res.roles[i].name === 'SuperAdmin') {
                console.log('here')
                this.displayedColumns?.push('ip_conflict_country')
              }
            }
          }
        })
        const displayedColumnFilter = this.displayedColumns.filter((item) => item !== 'participant_name')
        this.showDisplayedColumns = displayedColumnFilter.map(column => ({
          label: this.translateService.instant(column),
          value: column,
          checked: true
        }));
      }

    })

  }
  onItemChecked(checked: boolean, index, participants): void {
    this.listOfCurrentPageData = participants
    this.listOfCurrentPageData[index].checked = checked
    this.isChecked = this.listOfCurrentPageData.some(data => data.checked)
    this.setOfCheckedId = this.listOfCurrentPageData.filter(data => data.checked === true)
  }
  getWinners() {
    this.winnersServices.getWinners(this.tournamentCode, this.pageIndex).subscribe(winners => {
      console.log(winners)
      this.winners = winners
      this.loading = false
    })

  }
  selectAllParticipantPage(checked, participants): void {
    this.listOfCurrentPageData = participants || []
    for (const participant of this?.listOfCurrentPageData) {
      participant.checked = checked
      participant.visible = false
      this.checked = checked
    }
    this.isChecked = this.listOfCurrentPageData.some(data => data.checked)
    this.setOfCheckedId = this.listOfCurrentPageData.filter(data => data.checked === true)
  }
  onPageChange(e) {
    console.log(e)
    this.getWinners()
  }

  filterCountryValue(value) {
    this.isCountryValueChanged = true
  }

  filterCountry(country) {
    this.selectedCountry = country === 'Global' ? '' : country
    console.log(this.selectedCountry)
    // this.filterParticipants()
    this.isCountryValueChanged = false
  }

  clearFilters() {
    for (const column of this.showDisplayedColumns) {
      column.checked = true
    }
    if (this.selectedCountry !== '') {
      this.selectedCountry = ''
      this.isCountryValueChanged = true
    }
    this.updateDisplayedColumns()
    this.popoverFilterVisible = false

  }

  updateDisplayedColumns() {
    const displayedColumnss = this.showDisplayedColumns.filter(column => column.checked === true).map(column => column.value)
    this.displayedColumns = ['participant_name', ...displayedColumnss]
    console.log(this.displayedColumns)
    if (this.isCountryValueChanged) {
      this.filterCountry(this.selectedCountry)
    }
    this.popoverFilterVisible = false
  }

  exportAsExcelFile() {
    this.participantsService.getPDF(this.sharedService.tournamentCode, null, 1, null, this.selectedCountry, null, true).subscribe((res: any) => {
      const downloadURL = window.URL.createObjectURL(res);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.click();
    }, error => {
      this.store.dispatch(new HandleError(error))
    })
  }
  openTeamDrawer(data) {
    this.teamMember = data
    this.drawerRef = this.drawerService.create<TeamViewComponent, { value: string }, string>({
      nzTitle: this.drawerTitle,
      nzFooter: this.drawerFooter,
      nzContent: TeamViewComponent,
      nzContentParams: {
        data: data?.tournamentMembers,
        componentName: 'participants'
      },
      nzWidth: this.isMobView  ? '90%' : '550px',
    })
    // this.drawerRef.afterClose.subscribe(() => {
    //   this.teamMember = null
    // });
  }
  sendMessage() {
    // const requestData =  this.listOfCurrentPageData.filter(data => data?.checked)
    this.modalService.create({
      nzTitle: 'Send Message',
      nzContent: SendMessageComponent,
      nzData: {
        participants: this.listOfCurrentPageData.filter(data => data?.checked),
      },
      nzFooter: null,
      nzWidth: '1500px',
    });

  }
}
