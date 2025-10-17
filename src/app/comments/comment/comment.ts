import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
// import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
type MatCardAppearance = 'outlined' | 'raised' | 'filled';

import { type Comment as CommentModel } from '../comment.model';
import { type User } from '../../blogs/blog-api.service';

@Component({
  selector: 'app-comment',
  imports: [MatCardModule, MatIconModule, DatePipe],
  templateUrl: './comment.html',
  styleUrl: './comment.css',
})
export class Comment {
  commentAppearance: MatCardAppearance = 'filled';
  comment = input<CommentModel | undefined>(undefined);
  users = input<User[]>([]);

  // ngOnInit(): void {
  // console.log('Comment component OnInit with comment:', this.comment()); // does have value here, but not in constructor
  // console.log('Available users on OnInit:', this.users()); // still empty array here
  // }

  get authorEmail(): string {
    const author = this.users()?.find((user) => user.id === this.comment()?.author);
    if (author) {
      return author.email;
    }
    return 'Unknown Author';
  }
}
