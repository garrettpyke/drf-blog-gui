import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

import { Header } from './header/header';
import { Login } from './login/login';

@Component({
  selector: 'app-root',
  imports: [Header, Login],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('blog');
}
