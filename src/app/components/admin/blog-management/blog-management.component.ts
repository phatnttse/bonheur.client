import { NgModule } from '@angular/core';
// blog-management.component.ts
import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { BlogPost } from '../../../models/blogpost.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CKEditorModule,
  loadCKEditorCloud,
  CKEditorCloudResult,
} from '@ckeditor/ckeditor5-angular';
import type {
  ClassicEditor,
  EditorConfig,
} from 'https://cdn.ckeditor.com/typings/ckeditor5.d.ts';
import { environment } from '../../../environments/environment.dev';
import { BlogService } from '../../../services/blog-post.service';
@Component({
  selector: 'app-blog-management',
  standalone: true,
  imports: [
    MaterialModule,
    CKEditorModule,
    CommonModule,
    TablerIconsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './blog-management.component.html',
  styleUrl: './blog-management.component.scss',
})
export class BlogManagementComponent {
  displayedColumns: string[] = [
    'id',
    'title',
    'slug',
    'authorId',
    'categoryId',
    'isPublished',
    'action',
  ];
  dataSource = new MatTableDataSource<BlogPost>([]);
  @ViewChild(MatSort) sort!: MatSort;

  showCreateForm: boolean = false;
  blogForm: FormGroup;
  public Editor: typeof ClassicEditor | null = null;
  public config: EditorConfig | null = null;

  constructor(private fb: FormBuilder, private blogService: BlogService) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      slug: ['', Validators.required],
      content: ['', Validators.required],
      thumbnailUrl: [''],
      authorId: [''],
      isPublished: [false],
      categoryId: ['', Validators.required],
    });
  }

  ngOnInit() {
    loadCKEditorCloud({
      version: '44.1.0',
      premium: true,
    }).then(this._setupEditor.bind(this));
  }
  private _setupEditor(
    cloud: CKEditorCloudResult<{ version: '44.1.0'; premium: true }>
  ) {
    const {
      ClassicEditor,
      Essentials,
      Paragraph,
      Bold,
      Italic,
      Heading,
      Link,
      List,
      Underline,
    } = cloud.CKEditor;

    this.Editor = ClassicEditor;
    this.config = {
      licenseKey: environment.ckeditorLicenseKey,
      plugins: [
        Essentials,
        Paragraph,
        Bold,
        Italic,
        Heading,
        Link,
        List,
        Underline,
      ],
      toolbar: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'link',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'undo',
        'redo',
      ],
    };
  }

  public editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo',
      ],
    },
    language: 'en',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
      ],
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
  };

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  openCreateBlogDialog() {
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
    this.blogForm.reset({
      isPublished: false,
    });
  }

  saveBlog() {
    if (this.blogForm.valid) {
      const newBlog: BlogPost = {
        id: this.dataSource.data.length + 1,
        title: this.blogForm.get('title')?.value,
        slug: this.blogForm.get('slug')?.value,
        content: this.blogForm.get('content')?.value,
        thumbnailUrl: this.blogForm.get('thumbnailUrl')?.value || undefined,
        authorId: this.blogForm.get('authorId')?.value || undefined,
        isPublished: this.blogForm.get('isPublished')?.value,
        categoryId: this.blogForm.get('categoryId')?.value,
      };
      this.dataSource.data = [...this.dataSource.data, newBlog];
      this.closeCreateForm();
    }
  }

  openEditBlogDialog(blogId: number) {
    // Logic để mở dialog chỉnh sửa blog
  }

  openDeleteBlogDialog(blogId: number) {
    // Logic để mở dialog xác nhận xóa blog
  }
}
