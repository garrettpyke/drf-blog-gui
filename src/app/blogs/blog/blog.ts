import { Component, computed, input } from '@angular/core';

import { type Blog as BlogModel } from '../blog.model';

@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog {
  blog = input.required<BlogModel>();

  title: any = computed(() => {
    return this.blog().title;
  });
}
