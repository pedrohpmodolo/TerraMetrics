import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobeComponent } from './components/globe/globe';
import { HeaderComponent } from './components/header/header';
import { SidePanelComponent } from './components/side-panel/side-panel';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    GlobeComponent,
    HeaderComponent,
    SidePanelComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('terrametrics');
}