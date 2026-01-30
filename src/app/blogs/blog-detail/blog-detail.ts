import { Component, input, output, signal, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
type MatCardAppearance = 'outlined' | 'raised' | 'filled';

import { Comment } from '../../comments/comment/comment';
import { type BlogDetail as BlogDetailModel } from '../blog-detail.model';
import { UpdateBlog } from '../update-blog/update-blog';
import { type Category, type User, BlogApiService } from '../blog-api.service';

@Component({
  selector: 'app-blog-detail',
  imports: [MatCardModule, MatChipsModule, MatIconModule, DatePipe, Comment, UpdateBlog],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css',
})
export class BlogDetail {
  // blogDetail = input.required<BlogDetailModel | undefined>();
  private blogApiService = inject(BlogApiService);
  blogDetail = signal(this.blogApiService.loadedBlogDetail());
  users = input.required<{ id: number; email: string }[] | undefined>();
  comments = computed(() => this.blogDetail()?.comments ?? []);
  category = input<Category | undefined>();
  blogAppearance: MatCardAppearance = 'raised';
  deleteBlog = output<boolean>();
  updateBlog = false;
  user = computed<User>(() => this.blogApiService.currentUser()!);

  get author(): User {
    const author = this.users()?.find((user) => user.id === this.blogDetail()?.author);
    if (author) {
      return author;
    }
    return { id: -1, email: 'Unknown Author' };
  }

  get categorySubject(): string {
    return this.category()?.subject || 'Uncategorized';
  }

  authorInfo(authorId: number): string {
    const user = this.users()?.find((user) => user.id === authorId);
    return user ? user.email : 'Unknown Author';
  }

  onClickDeleteBlog() {
    console.log('Delete Blog clicked');
    this.deleteBlog.emit(true);
  }

  onClickUpdateBlog() {
    console.log('Update Blog clicked');
    if (!this.blogApiService.currentUser()) {
      console.log('Ya gotta be logged in to update a blog!');
      return;
    }
    this.updateBlog = true;
  }

  onCancelUpdate() {
    console.log('Update Blog cancelled');
    this.updateBlog = false;
  }
}
