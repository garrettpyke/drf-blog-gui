import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // todo: look into validators & formbuilder usage
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
// import { MatFormField, MatLabel } from '@angular/material/form-field';
// import { MatSelect } from '@angular/material/select';
// import { MatInputModule } from '@angular/material/input';

import { BlogApiService } from '../blog-api.service';

@Component({
  selector: 'app-new-blog',
  imports: [FormsModule, MatButtonModule, MatDividerModule],
  templateUrl: './new-blog.html',
  styleUrl: './new-blog.css',
})
export class NewBlog {
  blogFormValid: boolean = false;
  title: string = '';
  content: string = '';
  category!: number;

  onSubmit() {
    // Handle form submission logic here
  }

  onCancel() {
    // Handle form cancellation logic here
  }
}
