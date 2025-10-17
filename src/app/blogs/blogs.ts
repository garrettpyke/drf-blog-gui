import { Component, DestroyRef, inject, OnInit, signal, computed } from '@angular/core';

import { BlogApiService } from './blog-api.service';
import { Blog } from './blog/blog';
import { BlogDetail } from './blog-detail/blog-detail';

@Component({
  selector: 'app-blogs',
  imports: [Blog, BlogDetail],
  templateUrl: './blogs.html',
  styleUrl: './blogs.css',
})
export class Blogs implements OnInit {
  isFetching = signal(false);
  blogClicked = signal<number | null>(null);
  private blogApiService = inject(BlogApiService);
  private destroyRef = inject(DestroyRef);
  blogs = this.blogApiService.loadedBlogs;
  blogDetail = signal(this.blogApiService.loadedBlogDetail());
  users = computed(() => this.blogApiService.loadedAuthors());

  constructor() {
    // Initialize authors signal or any other setup if needed
    const subscription = this.blogApiService.fetchAuthors().subscribe({
      error: (error: Error) => {
        console.error('Error loading authors:', error);
      },
      complete: () => {
        console.log('Author loading completed');
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  ngOnInit(): void {
    this.isFetching.set(true);

    const subscription = this.blogApiService.loadBlogs().subscribe({
      error: (error: Error) => {
        console.log(error);
      },
      complete: () => {
        console.log('blogs.onInit fetching complete!');
        this.isFetching.set(false);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onClickBlog(id: number) {
    const subscription = this.blogApiService.fetchBlogDetail(id).subscribe({
      // next: (blog) => {
      //   console.log('Fetched blog detail:', blog);
      // },
      error: (error: Error) => {
        console.log('Error fetching blog detail:', error);
      },
      complete: () => {
        console.log('Completed fetching blog detail...');
        console.log(
          `...and blogApiService.loadedBlogDetail is`,
          this.blogApiService.loadedBlogDetail()
        );

        this.blogDetail.set(this.blogApiService.loadedBlogDetail());
        this.blogClicked.set(id);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
