import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store'
import { TournamentProcessState } from '../tournament-process/state/tournament-process.state'
import { Observable } from 'rxjs'
import { ManageTournamentState } from './state/manage-tournament.state'
import { ActivatedRoute } from '@angular/router'
import { GetTournament } from '../tournament-process/state/tournament-process.action'

@Component({
  selector: 'app-manage-tournaments',
  template: `
    <router-outlet></router-outlet>`,
})
export class ManageTournamentsComponent implements OnInit {
  tournamentId: string

  constructor(private store: Store, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

  }

}
