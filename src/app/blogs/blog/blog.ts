import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
type MatCardAppearance = 'outlined' | 'raised' | 'filled';

import { type Blog as BlogModel } from '../blog.model';
import { BlogApiService } from '../blog-api.service';

@Component({
  selector: 'app-blog',
  imports: [MatCardModule, MatChipsModule, MatIconModule, DatePipe],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog {
  blog = input.required<BlogModel>();
  users = computed(() => this.blogApiService.loadedAuthors());
  appearance: MatCardAppearance = 'raised';
  private blogApiService = inject(BlogApiService);

  get authorEmail(): string {
    const author = this.users().find((user) => user.id === this.blog().author);
    if (author) {
      return author.email;
    }
    return 'Unknown Author';
  }

  get totalVotes(): number {
    return this.blog().votes || 0;
  }

  title: any = computed(() => {
    return this.blog().title;
  });
}
