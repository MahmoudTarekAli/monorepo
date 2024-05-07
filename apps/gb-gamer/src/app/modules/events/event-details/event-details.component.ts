import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Route, Router} from "@angular/router";
import {Select, Store} from "@ngxs/store";
import {GetEvent, GetEventTournaments} from "../state/event.action";
import {Observable} from "rxjs";
import {Game} from "../../../shared/models/game";
import {EventState} from "../state/event.state";
import {Tournament} from "../../../shared/models/tournament";
import {Challenge} from "../../../shared/models/challenge";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {AuthenticationState} from "../../authentication/state/authentication.state";
import {User} from "../../authentication/models/user";
import {CHALLENGES_STATUS} from "../../challenges/challenges.enum";

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  eventSlug: string
  @Select(EventState.getEvent) event$: Observable<any>;
  @Select(EventState.getEventTournamentsOrChallenges) tournamentOrChallenges: Observable<Tournament[]>;
  @Select(EventState.getEventChallenges) challenges$: Observable<Challenge[]>;
  @Select(hasActionsExecuting([GetEvent])) getEventExecuting$: Observable<Boolean>;
  @Select(hasActionsExecuting([GetEventTournaments])) getEventTournamentsExecuting$: Observable<Boolean>;
  @Select(AuthenticationState.getUser) user$: Observable<User>;

  type = 'all'
  selectedGame: any
  tournaments: any
  page = 1
  total: any
  isSuperAdmin: boolean

  constructor(private activatedRoute: ActivatedRoute, private store: Store, private router: Router) {
    this.eventSlug = this.activatedRoute.snapshot.params['slug'];
    this.selectedGame = this.activatedRoute.snapshot.queryParamMap.get('code');
    this.user$.pipe().subscribe(data => {
      this.isSuperAdmin = data.roles.some((role: any) => role.name === 'SuperAdmin');
    })
  }

  ngOnInit() {
    this.tournamentOrChallenges.subscribe(tournament => {
      console.log(tournament)
      this.tournaments = tournament['data']
      console.log(this.tournaments)
      this.total = tournament['total_count']
    })
    this.store.dispatch(new GetEvent(this.eventSlug))
    this.store.dispatch(new GetEventTournaments(this.eventSlug, this.type, this.page, this.selectedGame))
  }

  filterEvent(type: any) {
    console.log(type)
    this.page = 1
    this.type = type
    this.store.dispatch(new GetEventTournaments(this.eventSlug, this.type, this.page, this.selectedGame))
  }

  filterByGame(event: any, game: Game) {
    this.selectedGame = game.code
    this.store.dispatch(new GetEventTournaments(this.eventSlug, this.type, this.page, this.selectedGame))
  }

  changePage(event: number) {
    this.page = event
    // @ts-ignore
    this.store.dispatch(new GetEventTournaments(this.eventSlug, this.type, this.page, this.selectedGame))
  }

  clearFilters() {
    this.selectedGame = ''
    this.store.dispatch(new GetEventTournaments(this.eventSlug, this.type, this.page, this.selectedGame))
    this.router.navigateByUrl(`/events/${this.eventSlug}`)
  }

  protected readonly CHALLENGES_STATUS = CHALLENGES_STATUS;
}
