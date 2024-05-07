import { Component } from '@angular/core';
import {Select} from "@ngxs/store";
import {TournamentState} from "../state/tournament.state";
import {Observable} from "rxjs";
import {Tournament} from "../../../shared/models/tournament";

@Component({
  selector: 'app-tournament-rules',
  templateUrl: './tournament-rules.component.html',
  styleUrls: ['./tournament-rules.component.scss']
})
export class TournamentRulesComponent {
  @Select(TournamentState.getTournament) tournament$: Observable<Tournament>;

}
