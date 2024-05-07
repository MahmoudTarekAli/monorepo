import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonComponent} from "../../../components/button/button.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-no-result',
  standalone: true,
    imports: [CommonModule, ButtonComponent, RouterLink],
  templateUrl: './no-result.component.html',
  styleUrls: ['./no-result.component.scss']
})
export class NoResultComponent {

  @Input() message: string
}
