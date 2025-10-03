import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { BlogApiService } from './blog-api.service';
import { Blog } from './blog/blog';

@Component({
  selector: 'app-blogs',
  imports: [Blog],
  templateUrl: './blogs.html',
  styleUrl: './blogs.css',
})
export class Blogs implements OnInit {
  // blogs = signal<Blog[] | undefined>(undefined);
  isFetching = signal(false);
  private blogApiService = inject(BlogApiService);
  private destroyRef = inject(DestroyRef);
  blogs = this.blogApiService.loadedBlogs;

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
}
