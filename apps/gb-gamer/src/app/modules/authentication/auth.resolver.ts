import {Injectable} from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from "./services/auth.service";
import {Actions, ofActionDispatched, Store} from "@ngxs/store";
import {catchError} from "rxjs/operators";
import {SetUser, UserCompleted} from "./state/authentication.action";

@Injectable({
  providedIn: 'root'
})
export class AuthResolver  {
  constructor(private authService: AuthService, private store: Store, private actions$: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    this.store.dispatch(new SetUser())
    return this.actions$.pipe(ofActionDispatched(UserCompleted))
  }
}
