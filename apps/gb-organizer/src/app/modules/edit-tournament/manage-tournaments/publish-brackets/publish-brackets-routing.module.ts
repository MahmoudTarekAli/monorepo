import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublishBracketsComponent} from "./publish-brackets.component";
import {PublishBracketGuard} from "../services/publish-bracket.guard";

const routes: Routes = [
  {
    path: '',
    component: PublishBracketsComponent,
    children: [
      {
        path: 'GroupStage',
        redirectTo: 'RoundRobin',
        pathMatch: 'full'
      },
      {
        path: 'SingleElimination',
        loadChildren: () => import('src/app/modules/edit-tournament/manage-tournaments/publish-brackets/single-double-elimination/single-double-elimination.module').then(m => m.SingleDoubleEliminationModule),
        canActivate: [PublishBracketGuard]
      },
      {
        path: 'DoubleElimination',
        loadChildren: () => import('src/app/modules/edit-tournament/manage-tournaments/publish-brackets/single-double-elimination/single-double-elimination.module').then(m => m.SingleDoubleEliminationModule),
        canActivate: [PublishBracketGuard]
      },

      {
        path: 'RoundRobin',
        loadChildren: () => import('src/app/modules/edit-tournament/manage-tournaments/publish-brackets/free-for-all-round-robin-elimination/free-for-all-round-robin-elimination.module').then(m => m.FreeForAllRoundRobinEliminationModule),
        canActivate: [PublishBracketGuard]

      },

      {
        path: 'FreeForAll',
        loadChildren: () => import('src/app/modules/edit-tournament/manage-tournaments/publish-brackets/free-for-all-round-robin-elimination/free-for-all-round-robin-elimination.module').then(m => m.FreeForAllRoundRobinEliminationModule),
        canActivate: [PublishBracketGuard]

      },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishBracketsRoutingModule {
}
