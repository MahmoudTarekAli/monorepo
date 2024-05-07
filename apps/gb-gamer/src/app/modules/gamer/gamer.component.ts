import {Component, OnDestroy, OnInit} from '@angular/core';
import {GetGamerProfile, GetGamerRelationships, ResetGamerState} from "./state/gamer.action";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {GamerService} from "./service/gamer.service";
import {ActivatedRoute} from "@angular/router";
import {GamerState} from "./state/gamer.state";
import {Observable} from "rxjs";
import {GamerProfile} from "../../shared/models/gamer";

@Component({
  selector: 'app-gamer',
  template: `
    <div class="container" style="color: #fff">

    <router-outlet></router-outlet>
    </div>

`
})
export class GamerComponent implements OnInit, OnDestroy{
  slug:string;
  loading:boolean;
  @Select(GamerState.getGamerProfile) Gamer$: Observable<GamerProfile>;

  constructor(private store:Store, private gamerService:GamerService , private activatedRoute:ActivatedRoute , private actions:Actions) {}
  ngOnInit() {


  }
  ngOnDestroy() {
  }
}
