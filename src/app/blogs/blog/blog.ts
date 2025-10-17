import { Component, computed, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
type MatCardAppearance = 'outlined' | 'raised' | 'filled';

import { type Blog as BlogModel } from '../blog.model';

@Component({
  selector: 'app-blog',
  imports: [MatCardModule, MatChipsModule, MatIconModule, DatePipe],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog {
  blog = input.required<BlogModel>();
  author = input.required<string>();
  appearance: MatCardAppearance = 'raised';

  get totalVotes(): number {
    return this.blog().votes || 0;
  }

  title: any = computed(() => {
    return this.blog().title;
  });
}
