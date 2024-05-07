import { Component, OnInit } from '@angular/core';
import {ButtonComponent} from "../../../../../shared/components/button/button.component";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {SectionComponent} from "../../../../../shared/components/section/section.component";
import {InfoCardComponent} from "../../../../../shared/components/info-card/info-card.component";
import {RouterLink} from "@angular/router";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {environment} from "../../../../../../environments/environment";

@Component({
  selector: 'app-echo-system',
  templateUrl: './echo-system.component.html',
  styleUrls: ['./echo-system.component.scss'],
  imports: [
    ButtonComponent,
    NzDropDownModule,
    SectionComponent,
    InfoCardComponent,
    RouterLink,
    NzDividerModule
  ],
  standalone: true
})
export class EchoSystemComponent implements OnInit {
  popoverEchoVisible = false;
  socialMedia = [
    {icon: 'brand-facebook' , link: 'https://facebook.com/gbarena'},
    {icon: 'brand-instagram' , link: 'https://instagram.com/gbarenaofficial'},
    {icon: 'brand-linkedin' , link: 'https://linkedin.com/company/gbarena'},
    {icon: 'brand-tiktok' , link: 'https://discord.com/invite/PHTn94cgyP'},
    {icon: 'brand-discord' , link: 'https://discord.com/invite/PHTn94cgyP'},
    {icon: 'brand-twitter' , link: 'https://twitter.com/gbarena'},
  ]
  environment = environment;

  constructor() { }

  ngOnInit(): void {
  }

}
