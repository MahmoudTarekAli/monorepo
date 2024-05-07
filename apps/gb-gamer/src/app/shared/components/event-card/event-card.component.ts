import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MarqueeComponent} from "../marquee/marquee.component";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {Router, RouterLink} from "@angular/router";
import {NzTagModule} from "ng-zorro-antd/tag";
import {DefaultImagePipe} from "../../pipes/default-image.pipe";
import {RemoveSpacesPipe} from "../../pipes/remove-spaces.pipe";
import {ButtonComponent} from "../../../components/button/button.component";
import {SliceArrayPipe} from "../../pipes/sliceArray.pipe";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-event-card',
  standalone: true,
    imports: [CommonModule, MarqueeComponent, NzAvatarModule, NzBadgeModule, RouterLink, NzTagModule, DefaultImagePipe, RemoveSpacesPipe, ButtonComponent, SliceArrayPipe, TranslateModule],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent {
  @Input() event: any

  constructor(private router:Router) {

  }

  routerToEvent(slug:string){
    if (slug === 'riot-ramadan-quests'){
      this.router.navigate(['/riot-ramadan-quests'])
    } else{
      this.router.navigate(['/events',slug])
    }

  }

}
