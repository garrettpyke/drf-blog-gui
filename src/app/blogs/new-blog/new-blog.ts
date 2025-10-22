import { Component, EventEmitter, inject, input } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // todo: look into validators & formbuilder usage
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
// import { MatFormField, MatLabel } from '@angular/material/form-field';
// import { MatSelect } from '@angular/material/select';
// import { MatInputModule } from '@angular/material/input';

import { BlogApiService, type Category, type User } from '../blog-api.service';
import { type Blog } from '../blog.model';

@Component({
  selector: 'app-new-blog',
  imports: [FormsModule, MatButtonModule, MatDividerModule],
  templateUrl: './new-blog.html',
  styleUrl: './new-blog.css',
})
export class NewBlog {
  blogValid = false;
  // cancel = false;
  title = '';
  content = '';
  category!: number;
  categories = input<Category[]>();
  blogApiService = inject(BlogApiService);
  newBlog!: Blog;

  private validateBlog(): boolean {
    const { id } = this.blogApiService.currentUser()!;
    if (id && this.title && this.content) {
      this.newBlog!.title = this.title;
      this.newBlog!.content = this.content;
      const category = this.category || 1;
      this.newBlog!.author = id;

      this.blogValid = true;
      return true;
    }
    return false;
  }

  onSubmit() {
    // Handle form submission logic here
    if (this.title && this.content) {
      const subscription = this.blogApiService.postNewBlog(this.newBlog!).subscribe();
    }
    // todo: pop-up error message if form issues
  }

  onCancel() {
    // Handle form cancellation logic here
  }
}
