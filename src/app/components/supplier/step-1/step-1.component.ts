import {
  Component,
  Input,
  OnInit,
  SecurityContext,
  ViewEncapsulation,
} from '@angular/core';
import { MaterialModule } from '../../../material.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  ListSupplierCategoryResponse,
  SupplierCategory,
} from '../../../models/category.model';
import { CommonModule } from '@angular/common';
import {
  CKEditorModule,
  loadCKEditorCloud,
  CKEditorCloudResult,
} from '@ckeditor/ckeditor5-angular';
import type {
  ClassicEditor,
  EditorConfig,
} from 'https://cdn.ckeditor.com/typings/ckeditor5.d.ts';
import { RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SupplierService } from '../../../services/supplier.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import {
  Supplier,
  UpdateSupplierProfileRequest,
} from '../../../models/supplier.model';
import { BaseResponse } from '../../../models/base.model';
import { StatusCode } from '../../../models/enums.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryService } from '../../../services/category.service';
import { Account } from '../../../models/account.model';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../environments/environment.dev';
import { DataService } from '../../../services/data.service';
import { LocalStorageManager } from '../../../services/localstorage-manager.service';
import { DBkeys } from '../../../services/db-keys';
import { AutoImage } from 'ckeditor5';

@Component({
  selector: 'app-step-1',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    TablerIconsModule,
    CKEditorModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './step-1.component.html',
  styleUrl: './step-1.component.scss',
})
export class Step1Component implements OnInit {
  formBusinessInfo: FormGroup;
  supplierCategories: SupplierCategory[] = [];
  public Editor: typeof ClassicEditor | null = null;
  public config: EditorConfig | null = null;
  account: Account | null = null;
  supplier: Supplier | null = null;
  responseTimeStart: number = 0;
  responseTimeEnd: number = 0;
  @Input() isEditMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private dataService: DataService,
    private localStorage: LocalStorageManager
  ) {
    this.formBusinessInfo = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      phoneNumber: [
        '',
        [Validators.pattern(/^[0-9]{10}$/), Validators.required],
      ],
      categoryId: [0, [Validators.required]],
      websiteUrl: [''],
      price: [0, [Validators.required]],
      responseTimeStart: ['', [Validators.required]],
      responseTimeEnd: ['', [Validators.required]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(100),
          Validators.maxLength(10000),
        ],
      ],
    });
  }

  public ngOnInit(): void {
    loadCKEditorCloud({
      version: '44.1.0',
      premium: true,
    }).then(this._setupEditor.bind(this));

    this.dataService.supplierCategoryData$.subscribe(
      (categories: SupplierCategory[] | null) => {
        if (categories) {
          this.supplierCategories = categories;
        } else {
          this.getSupplierCategories();
        }
      }
    );

    this.account = this.localStorage.getDataObject(DBkeys.CURRENT_USER);

    this.dataService.supplierData$.subscribe((supplier: Supplier | null) => {
      if (supplier) {
        this.supplier = supplier;
        this.formBusinessInfo.patchValue({
          email: this.account?.email,
          name: this.supplier?.name,
          phoneNumber: this.supplier?.phoneNumber,
          websiteUrl: this.supplier?.websiteUrl,
          categoryId: this.supplier?.category?.id,
          price: this.supplier?.price,
          responseTimeStart: this.formatTime(this.supplier?.responseTimeStart),
          responseTimeEnd: this.formatTime(this.supplier?.responseTimeEnd),
          description: this.supplier?.description,
        });
      } else {
        if (this.authService.currentUser) {
          this.account = this.authService.currentUser;
          this.getSupplierByUserId(this.account.id);
        }
      }
    });
  }

  formatTime(time: string | undefined): string {
    if (!time) return ''; // Tránh lỗi nếu time không có giá trị
    return time.substring(0, 5); // Cắt bỏ giây để giữ lại HH:mm
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

  onSubmit() {
    if (this.formBusinessInfo.invalid) {
      this.formBusinessInfo.markAllAsTouched();
      this.notificationService.warning(
        'Warning',
        'Please fill all required fields'
      );
      return;
    }

    const rawDescription = this.formBusinessInfo.get('description')!.value;
    const sanitizedDescription = this.sanitizer.sanitize(
      SecurityContext.HTML,
      rawDescription
    );

    if (!sanitizedDescription) {
      this.notificationService.error('Error', 'Invalid description content.');
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);

    const request: UpdateSupplierProfileRequest = {
      name: this.formBusinessInfo.get('name')!.value,
      phoneNumber: this.formBusinessInfo.get('phoneNumber')!.value,
      categoryId: this.formBusinessInfo.get('categoryId')!.value,
      websiteUrl: this.formBusinessInfo.get('websiteUrl')!.value,
      price: this.formBusinessInfo.get('price')!.value,
      responseTimeStart:
        this.formBusinessInfo.get('responseTimeStart')!.value + ':00',
      responseTimeEnd:
        this.formBusinessInfo.get('responseTimeEnd')!.value + ':00',
      description: sanitizedDescription,
    };

    this.supplierService.updateSupplierProfile(request).subscribe({
      next: (response: BaseResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.dataService.supplierDataSource.next(response.data);
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.notificationService.success('Success', response.message);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }

  getSupplierCategories() {
    this.categoryService.getAllSupplierCategories().subscribe({
      next: (response: ListSupplierCategoryResponse) => {
        this.dataService.supplierCategoryDataSource.next(response.data);
        this.supplierCategories = response.data;
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  getSupplierByUserId(userId: string) {
    this.supplierService.getSupplierByUserId(userId).subscribe({
      next: (response: BaseResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.supplier = response.data;
          this.dataService.supplierDataSource.next(this.supplier);
          this.formBusinessInfo.patchValue({
            email: this.account?.email,
            name: this.supplier?.name,
            phoneNumber: this.supplier?.phoneNumber,
            websiteUrl: this.supplier?.websiteUrl,
            categoryId: this.supplier?.category?.id,
            price: this.supplier?.price,
            responseTimeStart: this.formatTime(
              this.supplier?.responseTimeStart
            ),
            responseTimeEnd: this.formatTime(this.supplier?.responseTimeEnd),
            description: this.supplier?.description,
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }
}
