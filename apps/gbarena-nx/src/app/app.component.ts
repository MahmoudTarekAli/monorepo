import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NxWelcomeComponent} from './nx-welcome.component';
import {GbNavbarComponent} from "@gbarena-nx/gb-navbar";

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, GbNavbarComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'gbarena-nx';
}
