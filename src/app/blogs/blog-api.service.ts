import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, map, throwError } from 'rxjs';

import { type Blog } from './blog.model';
import { type BlogDetail } from './blog-detail.model';
import { type Comment } from '../comments/comment.model';
import { type NewBlogModel } from './new-blog/new-blog';

export interface User {
  id: number;
  email: string;
  token?: string;
}

export interface Category {
  id: number;
  subject: string;
  genre: string | null;
  created_at: string;
}

// PATCH http://localhost:8000/api/blog/6/ HTTP/1.1 "title", "content", "category"
// DELETE http://localhost:8000/api/blog/6/ HTTP/1.1

@Injectable({ providedIn: 'root' })
export class BlogApiService {
  private httpClient = inject(HttpClient);
  private user = signal<User | undefined>(undefined);
  private blogs = signal<Blog[]>([]);
  private blogDetail = signal<BlogDetail | undefined>(undefined);
  private users = signal<User[]>([]);
  private categories = signal<Category[]>([]);

  currentUser = this.user.asReadonly();
  loadedBlogs = this.blogs.asReadonly();
  loadedBlogDetail = this.blogDetail.asReadonly();
  loadedAuthors = this.users.asReadonly();
  loadedCategories = this.categories.asReadonly();

  constructor() {
    // todo: See [this link](https://medium.com/bb-tutorials-and-thoughts/retaining-state-of-the-angular-app-when-page-refresh-with-ngrx-6c486d3012a9)
    //* ...for ideas on how to persist state across page refreshes
    const savedUser = localStorage.getItem('blog_user');
    if (savedUser) {
      this.user.set(JSON.parse(savedUser));
    }
  }

  loadBlogs() {
    return this.fetchBlogs('http://localhost:8000/api/blogs/', 'Error loading blogs');
  }

  private verifyToken() {
    const { token } = this.user()!;
    if (token) {
      return token;
    }
    return new Observable((observer) => {
      observer.error('Token not found!');
    });
  }

  private refreshToken(email: string, password: string) {
    return this.httpClient
      .post<{ user: User }>('http://localhost:8000/api/sign-in/', {
        email: email,
        password: password,
      })
      .pipe(
        tap({
          next: (respData) => {
            // console.log(respData.user);
            this.user.set(respData.user);
            localStorage.setItem('blog_user', JSON.stringify(respData.user));
          },
        }),
      )
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error('Sign-on error!'));
        }),
      );
  }

  private buildHttpHeaders(token: string) {
    return {
      headers: new HttpHeaders({
        Authorization: `token ${token}`,
      }),
    };
  }

  login(email: string, password: string) {
    return this.refreshToken(email, password);
  }

  logout(): Observable<any> {
    const tokenResponse = this.verifyToken();

    if (typeof tokenResponse === 'string') {
      return this.httpClient
        .delete('http://localhost:8000/api/sign-out/', {
          headers: {
            Authorization: `token ${tokenResponse}`,
          },
        })
        .pipe(
          tap({
            next: () => {
              this.user.set(undefined);
              localStorage.removeItem('blog_user');
            },
          }),
        );
    }

    return tokenResponse;
  }

  private fetchBlogs(url: string, errMessage: string): Observable<any> {
    const tokenResponse = this.verifyToken();

    if (typeof tokenResponse === 'string') {
      return this.httpClient
        .get<[Blog[], User]>(url, {
          headers: {
            Authorization: `token ${tokenResponse}`,
          },
        })
        .pipe(
          tap({
            next: (respData) => {
              // console.log(respData[1]);
              this.blogs.set(respData[0]);
              console.log(this.blogs());
            },
          }),
        )
        .pipe(
          catchError((error) => {
            console.log(error);
            return throwError(() => new Error(errMessage));
          }),
        );
    }

    return tokenResponse;
  }

  fetchBlogDetail(id: number) {
    const tokenResponse = this.verifyToken();

    if (typeof tokenResponse === 'string') {
      return this.httpClient
        .get<[Blog, Comment[]]>(`http://localhost:8000/api/blog/${id}/`, {
          headers: {
            Authorization: `token ${tokenResponse}`,
          },
        })
        .pipe(
          tap({
            next: (respData) => {
              // todo: correct typing
              // console.log(`fetchBlogDetail.1: ${Blog}`);
              console.log(`fetchBlogDetail.2: ${respData[0]}`);
              this.blogDetail.set({
                ...respData[0],
                comments: respData[1],
              });
            },
          }),
        )
        .pipe(
          catchError((error) => {
            console.log(error);
            return throwError(() => new Error('Error fetching blog'));
          }),
        );
    }

    return tokenResponse;
  }

  fetchAuthors() {
    const tokenResponse = this.verifyToken();

    if (typeof tokenResponse === 'string') {
      return (
        this.httpClient
          //* Correct data typing here is important
          .get<{ users: User[] }>(`http://localhost:8000/api/users/`, {
            headers: {
              Authorization: `token ${tokenResponse}`,
            },
          })
          .pipe(
            map((respData) => {
              this.users.set(respData.users); // , console.log(this.users())
            }),
          )
          .pipe(
            catchError((error) => {
              console.log(error);
              return throwError(() => new Error(`Error fetching authors: ${error.message}`));
            }),
          )
      );
    }

    return tokenResponse;
  }

  fetchCategories() {
    const tokenResponse = this.verifyToken();

    if (typeof tokenResponse === 'string') {
      return this.httpClient
        .get<{ categories: Category[] }>('http://localhost:8000/api/categories/', {
          headers: {
            Authorization: `token ${tokenResponse}`,
          },
        })
        .pipe(
          map((respData) => {
            this.categories.set(respData.categories);
          }),
        )
        .pipe(
          catchError((error) => {
            console.log(error);
            return throwError(() => new Error(`Error fetching categories: ${error.message}`));
          }),
        );
    }

    return tokenResponse;
  }

  postNewBlog(blog: NewBlogModel) {
    const tokenResponse = this.verifyToken();

    if (typeof tokenResponse === 'string') {
      const httpHeaders = this.buildHttpHeaders(tokenResponse);

      return this.httpClient
        .post<Blog>('http://localhost:8000/api/blogs/', blog, httpHeaders)
        .pipe(
          tap({
            next: (blog) => {
              this.blogs.update((blogs) => [...blogs, blog]);
            },
          }),
        )
        .pipe(
          catchError((error) => {
            return throwError(() => new Error('Failed to post this blog. Please try again.'));
          }),
        );
    }

    return tokenResponse;
  }
}
