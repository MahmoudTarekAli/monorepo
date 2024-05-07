import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from "../../../components/button/button.component";
import {DefaultImagePipe} from "../../pipes/default-image.pipe";
import {CountryPipe} from "../../pipes/country.pipe";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {User} from "../../../modules/authentication/models/user";
import {MarqueeComponent} from "../marquee/marquee.component";
import {Arena} from "../../models/arena";
import {RouterLink} from "@angular/router";
import {FilterPipe} from "../../pipes/arena-router.pipe";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-participant-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DefaultImagePipe, CountryPipe, NzAvatarModule, MarqueeComponent, RouterLink, FilterPipe, TranslateModule],
  templateUrl: './participant-card.component.html',
  styleUrls: ['./participant-card.component.scss']
})
export class ParticipantCardComponent implements OnInit{

  @Input() cover: string
  @Input() isCover = true
  @Input() profile: string
  @Input() name: string
  @Input() isTeam: boolean
  @Input() isArena: boolean
  @Input() reference_number: string
  @Input() country: string
  @Input() roles: string[]
  @Input() autoHeight: boolean
  @Input() user: User
  @Input() arena: Arena
  @Input() routeTo: string
  @Input() bgColor: string
  constructor() {
  }
  ngOnInit() {
  }
}
