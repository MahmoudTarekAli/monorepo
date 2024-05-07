import {Component} from '@angular/core';
import {SectionComponent} from "../../../../components/section/section.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {Select} from "@ngxs/store";
import {TournamentState} from "../../../tournament/state/tournament.state";
import {Observable} from "rxjs";
import {Tournament} from "../../../../shared/models/tournament";

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  imports: [
    SectionComponent,
    AsyncPipe,
    NgIf
  ],
  standalone: true
})
export class RulesComponent {

}
