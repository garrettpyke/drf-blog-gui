import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // todo: look into validators & formbuilder usage
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { BlogApiService, type Category } from '../blog-api.service';
import { type BlogDetail as BlogDetailModel } from '../blog-detail.model';
import { type NewBlogModel } from '../new-blog/new-blog';

@Component({
  selector: 'app-update-blog',
  imports: [FormsModule, MatButtonModule, MatDividerModule],
  templateUrl: './update-blog.html',
  styleUrl: './update-blog.css',
})
export class UpdateBlog {
  blogDetail = input.required<BlogDetailModel | undefined>();
  cancel = output<void>();

  blogValid = false;
  title = '';
  content = '';
  category!: number;
  newBlog!: NewBlogModel;
  categories = input<Category[]>();
  blogApiService = inject(BlogApiService);
  destroyRef = inject(DestroyRef);

  ngOnInit() {
    if (this.blogDetail()) {
      this.title = this.blogDetail()!.title;
      this.content = this.blogDetail()!.content;
      this.category = this.blogDetail()!.category;
    }
  }

  private validateBlog(): boolean {
    const { id, email, token } = this.blogApiService.currentUser()!;
    console.log(`validateBlog().token: ${token}`);
    console.log(`validateBlog().id: ${id}`);
    console.log(`validateBlog().email: ${email}`);

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
    // if (this.validateBlog()) {
    //   console.log('new blog valid!');
    //   const subscription = this.blogApiService.postNewBlog(this.newBlog).subscribe({
    //     error: (error: Error) => {
    //       console.error('Error posting new blog:', error);
    //     },
    //     complete: () => {
    //       console.log('Blog post completed');
    //       this.cancel.emit();
    //     },
    //   });
    //   this.destroyRef.onDestroy(() => subscription.unsubscribe());
    // } else {
    //   console.log('Could not validate new blog.');
    // }
  }

  onCancel() {
    this.cancel.emit();
  }

  onFieldChange(field: any) {
    if (this.blogApiService.currentUser()?.id && this.title && this.content) {
      this.blogValid = true;
    }
  }
}
