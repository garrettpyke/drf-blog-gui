import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';

import { type Blog } from './blog.model';

export interface User {
  id: number;
  email: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class BlogApiService {
  user?: User;
  private blogs = signal<Blog[]>([]);
  private httpClient = inject(HttpClient);

  loadedBlogs = this.blogs.asReadonly();

  private refreshToken(email: string, password: string) {
    return (
      this.httpClient
        .post<{ user: User }>('http://localhost:8000/api/sign-in/', {
          email: email,
          password: password,
        })
        // .pipe(
        //   tap({
        //     next: (user) => {
        //       console.log(user);
        //       this.user = user;
        //       localStorage.setItem('blog_user', JSON.stringify(this.user));
        //     },
        //   })
        // );
        .pipe(
          tap({
            next: (respData) => {
              console.log(respData.user);
              this.user = respData.user;
              localStorage.setItem('blog_user', JSON.stringify(respData.user));
            },
          })
        )
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
}
