import { Component, signal, inject, OnChanges } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

import { Header } from './header/header';
import { Login } from './login/login';
import { Blogs } from './blogs/blogs';
import { BlogApiService, type User } from './blogs/blog-api.service';

@Component({
  selector: 'app-root',
  imports: [Header, Login, Blogs],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnChanges {
  protected readonly title = signal("Some guy's minimalist blog");
  private blogApiService = inject(BlogApiService);
  signedOn = signal<boolean>(false);
  user = signal<User | undefined>(undefined);

  constructor() {
    console.log(`constructor, current user: ${this.user()?.email}`);
    this.user.set(this.blogApiService.currentUser());
    if (this.user()) {
      this.signedOn.set(true);
    }
  }

  ngOnChanges() {
    console.log(`app.ts OnChanges, current user: ${this.user()?.email}`);
  }

  onIsAuthenticated(isAuthenticated: boolean) {
    console.log(`Authentication status event: ${isAuthenticated}`);
    this.signedOn.update(() => isAuthenticated);
  }
}
