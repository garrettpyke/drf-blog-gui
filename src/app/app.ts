import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { MatSlideToggle } from '@angular/material/slide-toggle';

import { Header } from './header/header';
import { Login } from './login/login';
import { Blogs } from './blogs/blogs';
import { Toolbar } from './shared/toolbar/toolbar';

@Component({
  selector: 'app-root',
  imports: [Header, Login, Blogs, Toolbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal("Some guy's minimalist blog");
  signedOn = signal(false);

  onIsAuthenticated(isAuthenticated: boolean) {
    this.signedOn.set(isAuthenticated);
  }
}
