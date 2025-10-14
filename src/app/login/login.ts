import { Component, DestroyRef, inject, output } from '@angular/core';
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
  isAuthenticated = output<boolean>();

  onSubmit() {
    // todo: add error handling
    const subscription = this.blogApiService.login(this.enteredUserEmail, this.password).subscribe({
      complete: () => {
        console.log(`login.onSubmit: ${this.blogApiService.currentUser()?.email}`);
        this.isAuthenticated.emit(true);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });

    // console.log(`login.onSubmit: ${this.blogApiService.user}`); // undefined, this runs before server responds!
  }
}
