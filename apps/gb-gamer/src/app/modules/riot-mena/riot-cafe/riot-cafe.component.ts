import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedRiotTableComponent} from "../shared/shared-riot-table/shared-riot-table.component";

@Component({
  selector: 'app-riot-cafe',
  standalone: true,
    imports: [CommonModule, SharedRiotTableComponent],
  templateUrl: './riot-cafe.component.html',
  styleUrls: ['./riot-cafe.component.scss']
})
export class RiotCafeComponent {

}
