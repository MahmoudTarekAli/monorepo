import {Component, OnInit} from '@angular/core';
import {GetTournament} from "./state/tournament-process.action";
import {Store} from "@ngxs/store";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-tournament-process',
  template: `
    <router-outlet></router-outlet>`,
})
export class TournamentProcessComponent implements OnInit {
  tournamentId: string

  constructor(private store: Store, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

  }

}
