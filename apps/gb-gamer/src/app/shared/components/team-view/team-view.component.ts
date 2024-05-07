import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzDrawerRef, NzDrawerService} from "ng-zorro-antd/drawer";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {environment} from "../../../../environments/environment";
import {CountryPipe} from "../../pipes/country.pipe";
import {NzListModule} from "ng-zorro-antd/list";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzCollapseModule} from "ng-zorro-antd/collapse";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {BannerCardComponent} from "../banner-card/banner-card.component";
import {ButtonComponent} from "../../../components/button/button.component";
import {RouterLink} from "@angular/router";
import {NgScrollbar} from "ngx-scrollbar";

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss'],
  imports: [
    CountryPipe,
    NzListModule,
    NzAvatarModule,
    NzCollapseModule,
    NzToolTipModule,
    NgForOf,
    NgIf,
    UpperCasePipe,
    BannerCardComponent,
    ButtonComponent,
    RouterLink,
    NgScrollbar
  ],
  standalone: true
})
export class TeamViewComponent implements OnInit {
  drawerRef
  @Input() data: any;
  @Input() componentName: any;
  @Input() match: any;
  @Input() leader: any;
  @Input() tournament: any;
  constructor( public modal: NzModalRef) { }

  ngOnInit(): void {
    console.log(this.data)

  }

}
