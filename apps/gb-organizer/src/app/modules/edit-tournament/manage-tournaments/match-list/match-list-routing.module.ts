import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MatchListComponent} from "./match-list.component";
import {PendingChangesGuard} from "../../../../shared/guards/pendingChanges";

const routes: Routes = [
  {
    path: '',
    component: MatchListComponent,
    canDeactivate: [PendingChangesGuard]

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchListRoutingModule {
}
