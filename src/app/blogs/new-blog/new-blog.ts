import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // todo: look into validators & formbuilder usage
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
// import { MatFormField, MatLabel } from '@angular/material/form-field';
// import { MatSelect } from '@angular/material/select';
// import { MatInputModule } from '@angular/material/input';

import { BlogApiService, type Category, type User } from '../blog-api.service';
// import { type Blog } from '../blog.model';
export interface NewBlogModel {
  title: string;
  content: string;
  category: number;
  author: number;
}

@Component({
  selector: 'app-new-blog',
  imports: [FormsModule, MatButtonModule, MatDividerModule],
  templateUrl: './new-blog.html',
  styleUrl: './new-blog.css',
})
export class NewBlog {
  close = output<void>();
  // blogValid = false;
  title = '';
  content = '';
  category!: number;
  newBlog!: NewBlogModel;
  categories = input<Category[]>();
  blogApiService = inject(BlogApiService);
  destroyRef = inject(DestroyRef);
  blogValid = (this.blogApiService.currentUser()?.id && this.title && this.content) || false;

  private validateBlog(): boolean {
    const { id, email, token } = this.blogApiService.currentUser()!;
    console.log(`validateBlog().token: ${token}`);
    console.log(`validateBlog().id: ${id}`);
    console.log(`validateBlog().email: ${email}`);
    this.blogApiService.verifyToken();

    if (id && this.title && this.content) {
      this.newBlog = {
        title: this.title,
        content: this.content,
        category: this.category,
        author: id,
      };

      this.blogValid = true;
      console.log('New Blog is valid!');
      return true;
    }
    console.log('New Blog invalid.');
    return false;
  }

  onSubmit() {
    // Handle form submission logic here
    if (this.validateBlog()) {
      console.log('new blog valid!');

      const subscription = this.blogApiService.postNewBlog(this.newBlog).subscribe({
        error: (error: Error) => {
          console.error('Error posting new blog:', error);
        },
        complete: () => {
          console.log('Blog post completed');
          this.close.emit();
        },
      });
      this.destroyRef.onDestroy(() => subscription.unsubscribe());
      // this.close.emit();
    } else {
      console.log('Could not validate new blog.');
    }

    // todo next #1: listen for an event in blogs after a successful post.
    // todo: pop-up error message if form issues or use `(ngModelChange)="onFieldChange()"`
  }

  onCancel() {
    this.close.emit();
  }

  onFieldChange() {
    // todo next #2: make sure this is necessary. the required option may be all we need.
    this.blogValid = (this.blogApiService.currentUser()?.id && this.title && this.content) || false;
  }
}
