import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {map, tap} from "rxjs/operators";
import {TournamentService} from "../service/tournament.service";

@Injectable({
  providedIn: 'root'
})
export class TeamSettingsGuard  {
  constructor(private tournamentService: TournamentService) {

}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url = state.url;
    const tournamentCode = this.extractTournamentCode(url);
  //   return this.tournamentService.getTeamAuthority(tournamentCode, payload.teamId).pipe(map((result: any) => {
  //
  // }))
    return true

  }
  private extractTournamentCode(url: string): string | null {
    const regex = /\/tournaments\/([^/]+)\//;
    const match = url.match(regex);

    if (match && match.length > 1) {
      return match[1];
    }

    return null;
  }
}
