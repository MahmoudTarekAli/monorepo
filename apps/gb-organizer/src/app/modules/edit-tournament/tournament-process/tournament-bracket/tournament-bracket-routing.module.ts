import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DoubleEliminationComponent} from './double-elimination/double-elimination.component';
import {SingleEliminationComponent} from './single-elimination/single-elimination.component';
import {TournamentBracketComponent} from './tournament-bracket.component';
import {RoundRobinComponent} from "./round-robin/round-robin.component";
import {FreeForAllComponent} from "./free-for-all/free-for-all.component";
import {CanActivateViaBracketGuard} from "../services/bracket.guard";
import {PendingChangesGuard} from "../../../../shared/guards/pendingChanges";
import {ViewBracketTemplateComponent} from "./view-bracket-template/view-bracket-template.component";

const routes: Routes = [
  {
    path: '',
    component: TournamentBracketComponent
  },
  {
    path: 'bracketType/single-elimination',
    component: SingleEliminationComponent,
    canActivate: [CanActivateViaBracketGuard]
  },
  {
    path: 'bracketType/double-elimination',
    component: DoubleEliminationComponent,
    canActivate: [CanActivateViaBracketGuard]
  },
  {
    path: 'bracketType/round-robin',
    component: RoundRobinComponent,
    canActivate: [CanActivateViaBracketGuard]
  },
  {
    path: 'bracketType/free-for-all',
    component: FreeForAllComponent,
    canActivate: [CanActivateViaBracketGuard],
    canDeactivate: [PendingChangesGuard]
  },
  {
    path: 'view-bracket/:type',
    component: ViewBracketTemplateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentBracketRoutingModule {
}
