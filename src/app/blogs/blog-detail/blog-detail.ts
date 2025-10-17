import { Component, input, computed, inject, DestroyRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
type MatCardAppearance = 'outlined' | 'raised' | 'filled';

import { Comment } from '../../comments/comment/comment';
import { type BlogDetail as BlogDetailModel } from '../blog-detail.model';
import { type User } from '../blog-api.service';
import { BlogApiService } from '../blog-api.service';

@Component({
  selector: 'app-blog-detail',
  imports: [MatCardModule, MatChipsModule, MatIconModule, DatePipe, Comment],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css',
})
export class BlogDetail {
  blogAppearance: MatCardAppearance = 'raised';
  blogDetail = input<BlogDetailModel | undefined>();
  comments = computed(() => this.blogDetail()?.comments ?? []);
  private destroyRef = inject(DestroyRef);
  blogApiService = inject(BlogApiService);
  // users = signal<User[]>([]);
  users = computed(() => this.blogApiService.loadedAuthors());

  get authorEmail(): string {
    const author = this.users()?.find((user) => user.id === this.blogDetail()?.author);
    if (author) {
      return author.email;
    }
    return 'Unknown Author';
  }
}
