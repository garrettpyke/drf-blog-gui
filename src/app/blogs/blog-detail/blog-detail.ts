import { Component, input, computed, signal, inject, DestroyRef, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
type MatCardAppearance = 'outlined' | 'raised' | 'filled';

// import { type Blog as BlogModel } from '../blog.model';
import { type BlogDetail as BlogDtl } from '../blog-detail.model';
import { type User } from '../blog-api.service';
import { BlogApiService } from '../blog-api.service';
// import { Comment } from '../../comments/comment.model';
// import { Blog } from '../blog/blog';

@Component({
  selector: 'app-blog-detail',
  imports: [MatCardModule, MatChipsModule, MatIconModule, DatePipe],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css',
})
export class BlogDetail implements OnInit {
  blogAppearance: MatCardAppearance = 'raised';
  commentAppearance: MatCardAppearance = 'filled';
  blogDetail = input<BlogDtl | undefined>();
  comments = computed(() => this.blogDetail()?.comments ?? []);
  private destroyRef = inject(DestroyRef);
  blogApiService = inject(BlogApiService);
  users = signal<User[]>([]);

  constructor() {
    // Initialize authors signal or any other setup if needed
    const subscription = this.blogApiService.fetchAuthors().subscribe({
      error: (error: Error) => {
        console.error('Error loading authors:', error);
      },
      complete: () => {
        console.log('Author loading completed');
        this.users.set(this.blogApiService.loadedAuthors());
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  ngOnInit(): void {
    // this.authorsArray?.forEach((author) => {
    //   console.log(author.email);
    // });
  }

  get authorEmail(): string {
    const author = this.users()?.find((user) => user.id === this.blogDetail()?.author);
    if (author) {
      return author.email;
    }
    return 'Unknown Author';
  }
}
