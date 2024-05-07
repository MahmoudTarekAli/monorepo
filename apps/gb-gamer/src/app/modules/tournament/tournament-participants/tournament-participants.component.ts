import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ParticipantCardComponent} from "../../../shared/components/participant-card/participant-card.component";
import {TournamentService} from "../service/tournament.service";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {TournamentState, TournamentStateModel} from "../state/tournament.state";
import {debounceTime, distinctUntilChanged, fromEvent, Observable, skip, Subject, switchMap, takeUntil} from "rxjs";
import {Tournament} from "../../../shared/models/tournament";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";
import {SectionComponent} from "../../../components/section/section.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {RouterLink} from "@angular/router";
import {map, tap} from "rxjs/operators";
import {NzModalService} from "ng-zorro-antd/modal";
import {ViewTeamComponent} from "../../../shared/components/view-team/view-team.component";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzIconModule} from "ng-zorro-antd/icon";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-tournament-participants',
  templateUrl: './tournament-participants.component.html',
  styleUrls: ['./tournament-participants.component.scss'],
  imports: [
    ParticipantCardComponent,
    NgForOf,
    NzPaginationModule,
    LoadingIndicatorComponent,
    NgIf,
    SectionComponent,
    ButtonComponent,
    RouterLink,
    NzInputModule,
    NzIconModule,
    ReactiveFormsModule,
    NzDividerModule,
    AsyncPipe,
    TranslateModule
  ],
  standalone: true
})
export class TournamentParticipantsComponent implements OnInit, OnDestroy, AfterViewInit {
  @Select(TournamentState.getTournament) tournament$: Observable<Tournament>;
  participant: any
  private readonly destroy$ = new Subject();
  tournament: Tournament
  loading: boolean
  private ngUnsubscribe = new Subject<void>();
  searchControl = new FormControl();
  searchResult: string

  constructor(private tournamentService: TournamentService,
              private elementRef: ElementRef,
              private actions: Actions, private store: Store, private nzModalService: NzModalService) {

  }

  ngOnInit() {
    this.getParticipants(1, this.searchResult)

  }

  ngAfterViewInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchResult = value
        this.getParticipants(1, this.searchResult)
      });

  }

  getParticipants(page: number, search) {
    this.loading = true
    this.tournament$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tournament => {
      this.tournament = tournament
    })
    this.tournamentService.getTournamentParticipants(this.tournamentService.tournamentCode, page, search).pipe(
      takeUntil(this.ngUnsubscribe),
      tap((x) => {
        console.log(x)
      })
    ).subscribe(participant => {
      this.participant = participant
      console.log(this.participant)
      this.loading = false
    });

  }


  viewTeam(team) {
    console.log(team)
    this.nzModalService.create({
      nzContent: ViewTeamComponent,
      nzData: {
        teamId: team.participant_id,
      },
      nzFooter: null,
      nzCentered: true,
      nzWidth: '600px',
      nzClassName: 'challenge-modal'

    })

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
  }
}
