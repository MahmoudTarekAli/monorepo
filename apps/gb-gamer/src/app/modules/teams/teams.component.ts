import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="container" style="color: #fff" >

    <router-outlet></router-outlet>
    </div>

`
})
export class TeamsComponent {

}
