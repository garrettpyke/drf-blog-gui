import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { type Blog as BlogModel } from '../blog.model';
import { MatIconModule } from '@angular/material/icon';
type MatCardAppearance = 'outlined' | 'raised' | 'filled';

@Component({
  selector: 'app-blog',
  imports: [MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog {
  blog = input.required<BlogModel>();

  title: any = computed(() => {
    return this.blog().title;
  });
}
