import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MatchChatComponent} from "./match-chat/match-chat.component";

const routes: Routes = [{
  path: ':id',
  component: MatchChatComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchProfileRoutingModule { }

