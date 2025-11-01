import { Component, input, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
type MatCardAppearance = 'outlined' | 'raised' | 'filled';

import { Comment } from '../../comments/comment/comment';
import { type BlogDetail as BlogDetailModel } from '../blog-detail.model';
import { type Category } from '../blog-api.service';

@Component({
  selector: 'app-blog-detail',
  imports: [MatCardModule, MatChipsModule, MatIconModule, DatePipe, Comment],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css',
})
export class BlogDetail {
  blogDetail = input.required<BlogDetailModel | undefined>();
  users = input.required<{ id: number; email: string }[] | undefined>();
  comments = computed(() => this.blogDetail()?.comments ?? []);
  category = input<Category | undefined>();
  blogAppearance: MatCardAppearance = 'raised';

  get authorEmail(): string {
    const author = this.users()?.find((user) => user.id === this.blogDetail()?.author);
    if (author) {
      return author.email;
    }
    return 'Unknown Author';
  }

  get categorySubject(): string {
    return this.category()?.subject || 'Uncategorized';
  }

  authorInfo(authorId: number): string {
    const user = this.users()?.find((user) => user.id === authorId);
    return user ? user.email : 'Unknown Author';
  }
}
