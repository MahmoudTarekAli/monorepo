import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzSelectModule} from "ng-zorro-antd/select";
import {TranslateModule} from "@ngx-translate/core";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzAutocompleteModule} from "ng-zorro-antd/auto-complete";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {debounceTime, distinctUntilChanged, filter, fromEvent, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {GlobalService} from "../../../../shared/service/global.service";
import {NzIconModule} from "ng-zorro-antd/icon";
import {ButtonComponent} from "../../../../components/button/button.component";
import {Select, Store} from "@ngxs/store";
import {AssignUnassignRole, GetControllers} from "../../state/arenas.action";
import {ArenaService} from "../../service/arena.service";
import {GlobalState} from "../../../../shared/state/global.state";
import {ArenasState} from "../../state/arenas.state";
import {UserInfoComponent} from "../../../gamer/gamer-settings/user-info/user-info.component";
import {UserCardComponent} from "../../../../shared/components/user-card/user-card.component";

@Component({
  selector: 'app-add-moderator',
  standalone: true,
  imports: [CommonModule, NzFormModule, NzSelectModule, TranslateModule, ReactiveFormsModule, NzInputModule, FormsModule, NzAutocompleteModule, NzAvatarModule, NzIconModule, ButtonComponent, UserCardComponent],
  templateUrl: './add-moderator.component.html',
  styleUrls: ['./add-moderator.component.scss']
})
export class AddModeratorComponent implements OnInit, AfterViewInit {
  moderatorForm: FormGroup
  users: any
  @ViewChild('searchInput', {static: false}) search: ElementRef;
  @Select(ArenasState.getControllers) Controllers$: Observable<any>;
  moderators: any

  constructor(private fb: FormBuilder, private globalService: GlobalService, private store: Store, public arenaService: ArenaService) {
    this.moderatorForm = fb.group({
      user: [null, Validators.required],
      role: ['arena_moderator', Validators.required]
    })
  }

  ngOnInit(): void {
    this.store.dispatch(new GetControllers(this.arenaService.arenaSlug))

    this.Controllers$.subscribe(data => {
      console.log(data)
    })
  }

  ngAfterViewInit(): void {
    console.log(this.search)
    // userSearch
    fromEvent(this.search?.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 0)
      , debounceTime(300)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      if (text.length > 0) {
        this.getUsers(text)
      } else {
        this.users = []
      }

    });

  }

  getUsers(text: string) {
    this.globalService.getSearchUsers(text).subscribe((res: any) => {
      this.users = res.data
    })
  }

  assignRole() {
    this.store.dispatch(new AssignUnassignRole(this.arenaService.arenaSlug, this.moderatorForm.value, 'assign_role'))
  }

  unAssignRole(moderator: string) {
    this.store.dispatch(new AssignUnassignRole(this.arenaService.arenaSlug, {user: moderator}, 'unassign_role'))
  }
}
