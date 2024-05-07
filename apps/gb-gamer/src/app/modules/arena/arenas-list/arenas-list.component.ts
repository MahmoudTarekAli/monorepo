import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {SectionComponent} from "../../../components/section/section.component";
import {LoadingIndicatorComponent} from "../../../shared/components/loading-indicator/loading-indicator.component";
import {ArenaCardComponent} from "../../../shared/components/arena-card/arena-card.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {Select, Store} from "@ngxs/store";
import {HomeState} from "../../home/state/home.state";
import {debounceTime, distinctUntilChanged, fromEvent, Observable} from "rxjs";
import {Arena, ArenaList} from "../../../shared/models/arena";
import {hasActionsExecuting} from "@ngxs-labs/actions-executing";
import {ArenaService} from "../service/arena.service";
import {NzTransitionPatchModule} from "ng-zorro-antd/core/transition-patch/transition-patch.module";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzInputModule} from "ng-zorro-antd/input";
import {TranslateModule} from "@ngx-translate/core";
import {FollowUnFollowArena, GetArenasList, GetFeaturedArenas, SearchArenas} from "../state/arenas.action";
import {NzButtonModule} from "ng-zorro-antd/button";
import {ArenasState} from "../state/arenas.state";
import {map} from "rxjs/operators";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../authentication/services/auth.service";
import {NzPaginationModule} from "ng-zorro-antd/pagination";

@Component({
  selector: 'app-arenas-list',
  standalone: true,
  imports: [CommonModule, SectionComponent, LoadingIndicatorComponent, ArenaCardComponent, ButtonComponent, NzIconModule, NzInputModule, TranslateModule, NzButtonModule, RouterLink, NzPaginationModule],
  templateUrl: './arenas-list.component.html',
  styleUrls: ['./arenas-list.component.scss']
})
export class ArenasListComponent implements OnInit {
  @Select(ArenasState.getFeaturedArenas) featuredArenas$: Observable<Arena[]>;
  @Select(ArenasState.getAllArenas) ActiveArenas$: Observable<ArenaList>;
  @Select(hasActionsExecuting([GetFeaturedArenas])) getFeaturedArenasIsExecuting$: Observable<Boolean>;
  @Select(hasActionsExecuting([GetArenasList])) getActiveArenasIsExecuting$: Observable<Boolean>;
  page:number = 1
  @ViewChild('searchActiveArena', {static: false}) search: ElementRef;

  constructor(private arenaService: ArenaService, private store: Store , private authService:AuthService , private router:Router) {
  }
  ngOnInit() {
    this.store.dispatch(new GetFeaturedArenas())
    this.store.dispatch(new GetArenasList(1))
  }
  ngAfterViewInit() {
    fromEvent(this.search?.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , debounceTime(500)

      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.store.dispatch(new GetArenasList(this.page , text))
    })

  }
  searchFeaturedArenas(value:any , type:string){
    console.log(value , type , this.page)
      this.store.dispatch(new SearchArenas(value , type))
  }
  followUnfollowArena(code:string , type:string) {
    console.log('here')
    this.store.dispatch(new FollowUnFollowArena(code , type))
  }
  routeCreateArena(){
    this.authService.checkAuthority()
    this.router.navigate(['/arenas/create'])
  }
  changeArenaPage(page:number){
    this.page = page
    this.store.dispatch(new GetArenasList(page ,  this.search.nativeElement.value))
  }
}
