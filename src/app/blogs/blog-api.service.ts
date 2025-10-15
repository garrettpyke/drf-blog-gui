import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { type Blog } from './blog.model';
import { type BlogDetail } from './blog-detail.model';
import { type Comment } from '../comments/comment.model';

export interface User {
  id: number;
  email: string;
  token?: string;
}
export interface BlogsResponse {
  // todo: revisit this in fetch operations
  response: [blogs: Blog[], user: User];
  // response: {blogs: Blog[], user: User};
}

@Injectable({ providedIn: 'root' })
export class BlogApiService {
  private httpClient = inject(HttpClient);
  private user = signal<User | undefined>(undefined);
  private blogs = signal<Blog[]>([]);
  private blogDetail = signal<BlogDetail | undefined>(undefined);

  currentUser = this.user.asReadonly();
  loadedBlogs = this.blogs.asReadonly();
  loadedBlogDetail = this.blogDetail.asReadonly();

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
            // this.user = respData.user;
            this.user.set(respData.user);
            localStorage.setItem('blog_user', JSON.stringify(respData.user));
          },
        })
      )
      .pipe(
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error('Sign-on error!'));
        })
      );
  }

  login(email: string, password: string) {
    return this.refreshToken(email, password);
  }

  logout(): Observable<{} | string> {
    const token = this.user()!.token;

    if (token) {
      return this.httpClient
        .delete('http://localhost:8000/api/sign-out/', {
          headers: {
            Authorization: `token ${token}`,
          },
        })
        .pipe(
          tap({
            next: () => {
              this.user.set(undefined);
              localStorage.removeItem('blog_user');
            },
          })
        );
    } else {
      return new Observable((observer) => {
        observer.error('Token not found!');
      });
    }
  }

  private fetchBlogs(url: string, errMessage: string): Observable<{} | string> {
    const token = this.user()!.token;

    if (token) {
      return this.httpClient
        .get<[[], {}]>(url, {
          headers: {
            Authorization: `token ${token}`,
          },
        })
        .pipe(
          tap({
            next: (respData) => {
              // console.log(respData[0]);
              this.blogs.set(respData[0]);
              console.log(this.blogs());
            },
          })
        )
        .pipe(
          catchError((error) => {
            console.log(error);
            return throwError(() => new Error(errMessage));
          })
        );
    }
    return new Observable((observer) => {
      observer.error('Token not found!');
    });
  }

  fetchBlogDetail(id: number) {
    const token = this.user()!.token;

    if (token) {
      return this.httpClient
        .get<[Blog, Comment[]]>(`http://localhost:8000/api/blog/${id}/`, {
          headers: {
            Authorization: `token ${token}`,
          },
        })
        .pipe(
          tap({
            next: (respData) => {
              console.log(`fetchBlogDetail: ${respData[0]}`);
              this.blogDetail.set({
                ...respData[0],
                comments: respData[1],
              });
            },
          })
        )
        .pipe(
          catchError((error) => {
            console.log(error);
            return throwError(() => new Error('Error fetching blog'));
          })
        );
    }
    return new Observable((observer) => {
      observer.error('Token not found!');
    });
  }
}
