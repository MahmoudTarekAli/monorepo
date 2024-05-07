import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventsComponent} from "./events.component";
import {EventDetailsComponent} from "./event-details/event-details.component";
import {SuperAdminGuard} from "../authentication/auth-guard/superAdmin-guard";

const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./event-list/event-list.component').then(m => m.EventListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./create-update-event/create-update-event.component').then(m => m.CreateUpdateEventComponent),
        canActivate: [SuperAdminGuard]
      },
      {
        path: ':id/manage',
        loadComponent: () => import('./create-update-event/create-update-event.component').then(m => m.CreateUpdateEventComponent),
        canActivate: [SuperAdminGuard]
      },
    ]
  },
  {
    path: ':slug', component: EventDetailsComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {
}
