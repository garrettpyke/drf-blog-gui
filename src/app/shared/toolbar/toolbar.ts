import { Component, DestroyRef, inject, output } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { BlogApiService } from '../../blogs/blog-api.service';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class Toolbar {
  private blogApiService = inject(BlogApiService);
  private destroyRef = inject(DestroyRef);
  isAuthenticated = output<boolean>();

  onClickLogout() {
    console.log('Logout clicked'); //

    const subscription = this.blogApiService.logout().subscribe({
      complete: () => {
        console.log('Logout successful');
        this.isAuthenticated.emit(false);
        console.log(`currentUser: ${this.blogApiService.currentUser()?.email}`);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
