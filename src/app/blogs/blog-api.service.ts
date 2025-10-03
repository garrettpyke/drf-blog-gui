import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

import { type Blog } from './blog.model';

export interface User {
  id: number;
  email: string;
  token: string;
}
export interface BlogsResponse {
  // todo: revisit this in fetch operations
  response: [blogs: Blog[], user: User];
}

@Injectable({ providedIn: 'root' })
export class BlogApiService {
  user?: User;
  private blogs = signal<Blog[]>([]);
  private httpClient = inject(HttpClient);

  loadedBlogs = this.blogs.asReadonly();

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
            this.user = respData.user;
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

  getCurrentToken(): {} | boolean {
    const user = localStorage.getItem('blog_user');
    if (user) {
      return JSON.parse(user).token;
    }
    return false;
  }

  login(email: string, password: string) {
    return this.refreshToken(email, password);
  }

  // todo: use this.user for token, stop using local storage
  private fetchBlogs(url: string, errMessage: string) {
    const token = this.getCurrentToken();

    if (token) {
      // <[[], {}]>
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
    return new Observable(() => {
      'Token not found!';
    });
  }
}
