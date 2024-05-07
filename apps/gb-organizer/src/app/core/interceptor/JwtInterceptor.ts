import {Injectable, NgZone} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {Observable, Observer, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../../modules/authentication/services/auth.service';
import {catchError} from "rxjs/operators";
import {Store} from '@ngxs/store'
import {LogOut} from '../../modules/authentication/state/authentication.action'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router, private store: Store
  ) {
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401 || err.status === 403) {
      // this.store.dispatch(new LogOut(false))
    }
    return throwError(err);
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (request.url.includes('getAuthUser')) {
    //   return next.handle(request);
    // }
    const ignore =
      typeof request.body === 'undefined'
      || request.body === null
      || request.body.toString() === '[object FormData]' // <-- This solves your problem
      || request.headers.has('Content-Type');
    if (ignore && this.authService.getToken()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      });
      return next.handle(request).pipe(catchError(x => this.handleAuthError(x)));
    }

    if (this.authService.getToken()) {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      });
      return next.handle(request).pipe(catchError(x => this.handleAuthError(x)));
    }
    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
      }
    });
    return next.handle(request).pipe(catchError(x => this.handleAuthError(x)));

  }

}


// I made a Http Interceptor that force the http from ngxs calls back into the angular zone (just to trigger the change detection)
@Injectable()
export class NgZoneHttpInterceptor implements HttpInterceptor {

  constructor(private ngZone: NgZone) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.ngZone.run(() => {
      return next.handle(req).pipe(this.enterZone(this.ngZone));
    });
  }

  enterZone<T>(zone: NgZone) {
    return (source: Observable<T>) => {
      return new Observable((sink: Observer<T>) => {
        return source.subscribe({
          next(x) {
            zone.run(() => sink.next(x));
          },
          error(e) {
            zone.run(() => sink.error(e));
          },
          complete() {
            zone.run(() => sink.complete());
          }
        });
      });
    };
  }
}
