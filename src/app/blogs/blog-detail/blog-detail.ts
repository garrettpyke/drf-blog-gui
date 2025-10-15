import { Component, input, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
type MatCardAppearance = 'outlined' | 'raised' | 'filled';

// import { type Blog as BlogModel } from '../blog.model';
import { type BlogDetail as BlogDtl } from '../blog-detail.model';

@Component({
  selector: 'app-blog-detail',
  imports: [MatCardModule, MatChipsModule, MatIconModule, DatePipe],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css',
})
export class BlogDetail {
  blogAppearance: MatCardAppearance = 'raised';
  commentAppearance: MatCardAppearance = 'filled';
  blogDetail = input<BlogDtl | undefined>();
  comments = computed(() => this.blogDetail()?.comments ?? []);
}
