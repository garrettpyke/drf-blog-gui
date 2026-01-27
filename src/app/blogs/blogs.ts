import { Component, DestroyRef, inject, OnInit, signal, computed, output } from '@angular/core';

import { Toolbar } from '../shared/toolbar/toolbar';
import { Blog } from './blog/blog';
import { BlogDetail } from './blog-detail/blog-detail';
import { NewBlog } from './new-blog/new-blog';
import { BlogApiService } from './blog-api.service';
import { type Category } from './blog-api.service';

@Component({
  selector: 'app-blogs',
  imports: [Toolbar, Blog, BlogDetail, NewBlog],
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
  categories = computed(() => this.blogApiService.loadedCategories());
  isAuthenticated = output<boolean>(); // todo next: label this consistently throughout components
  newBlogSubmission = false;

  constructor() {
    // Initialize authors signal or any other setup if needed
    this.isFetching.set(true);
    const authorSubscription = this.blogApiService.fetchAuthors().subscribe({
      error: (error: Error) => {
        console.error('Error loading authors:', error);
      },
      complete: () => {
        console.log('Author loading completed');
      },
    });
    this.destroyRef.onDestroy(() => authorSubscription.unsubscribe());

    const categorySubscription = this.blogApiService.fetchCategories().subscribe({
      error: (error: Error) => {
        console.error('Error loading categories', error);
      },
      complete: () => {
        console.log('Category loading completed');
        this.isFetching.set(false);
      },
    });
  }

  ngOnInit(): void {
    this.isFetching.set(true); // todo: add elements to template to reflect this

    const subscription = this.blogApiService.loadBlogs().subscribe({
      error: (error: Error) => {
        console.log(error);
      },
      complete: () => {
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
          this.blogApiService.loadedBlogDetail(),
        );

        this.blogDetail.set(this.blogApiService.loadedBlogDetail());
        this.blogClicked.set(id);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  authorInfo(authorId: number): string {
    const user = this.users().find((user) => user.id === authorId);
    return user?.email || 'Author not found!';
  }

  getFullCategory(categoryId: number): Category | undefined {
    const category = this.categories().find((cat) => cat.id === categoryId);
    // return category ? category.subject : 'Unknown Category';
    return category || undefined;
  }

  onLogout(isAuthenticated: boolean) {
    // console.log(`Authentication status event: ${isAuthenticated}`);
    this.isAuthenticated.emit(false);
  }

  onNewBlog() {
    if (this.blogApiService.currentUser()) {
      this.newBlogSubmission = true;
      return;
    }
    console.log('Ya gotta be logged in to post a new blog!'); // todo
  }

  // todo: enable this function or service to proactively notify user of response status code or message from backend
  // perhaps via snackbar or dialog
  onDeleteBlog(deleteBlog: boolean) {
    if (deleteBlog) {
      const blogId = this.blogClicked();
      if (blogId !== null) {
        const subscription = this.blogApiService.deleteBlog(blogId).subscribe({
          error: (error: Error) => {
            console.error('Error deleting blog:', error.message);
          },
          complete: () => {
            console.log(`Blog with ID ${blogId} deleted successfully.`);
            // Refresh the blogs list
            this.blogApiService.loadBlogs().subscribe();
          },
        });

        this.destroyRef.onDestroy(() => {
          subscription.unsubscribe();
        });
      }

      this.blogClicked.set(null);
      this.blogDetail.set(undefined);
    }
  }

  onClose() {
    this.newBlogSubmission = false;
  }
}
