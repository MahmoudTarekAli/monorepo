
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';



@Injectable()
export class PendingChangesGuard  {
  constructor() {
  }

  canDeactivate(component): boolean | Observable<boolean> {
    // if there are no pending changes, just allow deactivation; else confirm first
    console.log(component);
    return component?.canDeactivate() ? true : confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
  }

}

