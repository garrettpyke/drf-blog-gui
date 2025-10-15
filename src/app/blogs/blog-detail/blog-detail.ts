import { Component, input, OnInit } from '@angular/core';

import { type BlogDetail as BlogDtl } from '../blog-detail.model';

@Component({
  selector: 'app-blog-detail',
  imports: [],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css',
})
export class BlogDetail implements OnInit {
  // blogId = input<number>();
  blogDetail = input<BlogDtl | undefined>();
  blogArray = input<any[]>([]);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // console.log(`blogArray initialized with blogDetail:`, this.blogArray());
  }
}
