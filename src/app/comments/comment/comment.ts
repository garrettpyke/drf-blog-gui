import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
type MatCardAppearance = 'outlined' | 'raised' | 'filled';

import { type Comment as CommentModel } from '../comment.model';

@Component({
  selector: 'app-comment',
  imports: [MatCardModule, MatIconModule, DatePipe],
  templateUrl: './comment.html',
  styleUrl: './comment.css',
})
export class Comment {
  commentAppearance: MatCardAppearance = 'filled';
  comment = input<CommentModel | undefined>(undefined);
  author = input.required<string>();
}
