import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {GetUserAuthority} from "../edit-tournament/tournament-process/state/tournament-process.action";
import {TournamentProcessState} from "../edit-tournament/tournament-process/state/tournament-process.state";
import {MenuConfig} from "../../services/menu/config";
import {SidebarEnum} from "../../core/sidebar.enum";
import {SharedService} from "../edit-tournament/service/shared.service";

@Injectable({
  providedIn: 'root'
})

export class CheckAuthorityResolver  {
  userAuthority
  @Select(TournamentProcessState.getAuthority) getAuthority$: Observable<any>;
  tourData = []
  private Menu = new MenuConfig();

  constructor(private store: Store, private actions$: Actions , private sharedService: SharedService){

  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log(route)
    this.tourData = this.Menu.calcTourMenu(route.params['id'])

    this.store.dispatch(new GetUserAuthority(route.params['id']));
    this.userAuthority = this.getAuthority$.subscribe(res => {
      if (res === 'GBarenaAdmin' || res === 'None') {
        this.sharedService.touranmentData = this.tourData.filter(item => item.title !== SidebarEnum.edit_tournament)
        console.log(this.tourData)
      }
      return res
    })
    return this.userAuthority
  }
}
