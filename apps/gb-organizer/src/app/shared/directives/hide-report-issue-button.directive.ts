import {Directive, ElementRef, Input, HostListener, OnInit, OnChanges} from '@angular/core';
import {Select} from "@ngxs/store";
import {AuthenticationState} from "../../modules/authentication/state/authentication.state";
import {Observable} from "rxjs";

@Directive({
  selector: '[appIsHideReportIssue]'
})
export class HideReportIssueButtonDirective implements OnChanges {
  @Select(AuthenticationState.getAuth) getUser: Observable<any>;
  user: any
  @Input('match') match: boolean;

  constructor(private el: ElementRef) {
    if (this.match) {
      this.el.nativeElement.style.display = 'none';
    }
    this.getUser.subscribe(user => {
      if (user) {
        this.user = user
      }
    })
  }


  ngOnChanges(changes) {
    console.log(this.match)
    if (this.match) {
      // @ts-ignore
      const participants = [this.match.home, this.match.away].reduce((acc, curr) => {
        return acc.concat(curr);
      }, []);
      console.log(participants)
      if (participants.find(participant => participant.original.id !== this.user.id)) {
        this.el.nativeElement.style.display = 'none';
      }
    }


  }

}
