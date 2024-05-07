import { Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core'
import { Select, Store } from '@ngxs/store'
import { AuthenticationState } from '../../modules/authentication/state/authentication.state'
import { Observable } from 'rxjs'

@Directive({
  selector: '[appIsSuperAdmin]',
})
export class IsSuperAdminDirective {
  @Select(AuthenticationState.getAuth) user: Observable<{}>
  isSuperAdmin = false

  constructor(private store: Store, private viewContainer: ViewContainerRef , private templateRef: TemplateRef<any>, private elementRef: ElementRef) {
    this.user.subscribe((res: any) => {
        console.log(res)
        if (res?.roles) {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < res.roles.length; i++) {
            if (res.roles[i].name === 'SuperAdmin') {
              console.log(this.elementRef)
              this.viewContainer.createEmbeddedView(this.templateRef);
            }else{
              this.viewContainer.clear();
            }
          }
        }
      }
    )
  }


}
