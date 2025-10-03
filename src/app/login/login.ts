import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BlogApiService } from '../blogs/blog-api.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  enteredUserEmail = 'garrettpyke@gmail.com';
  password = 'password';
  private blogApiService = inject(BlogApiService);
  private destroyRef = inject(DestroyRef);

  onSubmit() {
    const subscription = this.blogApiService
      .login(this.enteredUserEmail, this.password)
      .subscribe({});

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });

    console.log(`login.onSubmit: ${this.blogApiService.user}`); // undefined, this runs before server responds!
  }

  onClick() {
    // const token = this.blogApiService.getCurrentToken();
    // console.log(`current token: ${token}`);
    const subscription = this.blogApiService.loadBlogs().subscribe({});

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
