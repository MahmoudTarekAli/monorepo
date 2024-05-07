import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MessengerComponent} from "./messenger.component";
import {ChatListComponent} from "./components/chat-list/chat-list.component";

const routes: Routes = [
  {
    path: '',
    component: MessengerComponent
  },
  {
    path: ':id',
    component: MessengerComponent
  },
  {
    path: ':id/chat-list',
    component: ChatListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessengerRoutingModule {
}
