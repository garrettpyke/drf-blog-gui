import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

import { Header } from './header/header';
import { Login } from './login/login';
import { Blogs } from './blogs/blogs';

@Component({
  selector: 'app-root',
  imports: [Header, Login, Blogs],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('BlogApi front end');
  signedOn = signal(false);

  onIsAuthenticated(isAuthenticated: boolean) {
    this.signedOn.set(isAuthenticated);
  }
}
