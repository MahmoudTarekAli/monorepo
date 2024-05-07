import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonComponent} from "../../../components/button/button.component";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent, NzLayoutModule, RouterLink],
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit{
  @Input() username: string;
  @Input() reference_number: string;
  @Input() avatar: string;
  @Input() slug: any;
  constructor() {
  }
  ngOnInit(): void {
  }
}
