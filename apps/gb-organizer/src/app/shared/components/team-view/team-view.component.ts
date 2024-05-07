import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzDrawerRef, NzDrawerService} from "ng-zorro-antd/drawer";
import {NzModalService} from "ng-zorro-antd/modal";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss']
})
export class TeamViewComponent implements OnInit {
  drawerRef
  @Input() data: any;
  @Input() tournament: any;
  @Input() componentName: any;
  @Input() leader: any;

  constructor(private drawerService: NzDrawerService) {
  }

  ngOnInit(): void {
    console.log(this.data)

    setTimeout(() => {
      console.log(this.data)
    }, 3000)
  }

}
