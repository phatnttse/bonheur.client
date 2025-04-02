import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  Advertisement,
  AdvertisementRequest,
} from '../../../../models/advertisement.model';
import { StatusService } from '../../../../services/status.service';
import { AdvertisementService } from '../../../../services/advertisement.service';
import { NotificationService } from '../../../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  BaseResponse,
  PaginationResponse,
} from '../../../../models/base.model';
import {
  GetSuppliersParams,
  Supplier,
} from '../../../../models/supplier.model';
import { AdPackage } from '../../../../models/ad-package.model';
import { SupplierService } from '../../../../services/supplier.service';
import { AdPackageService } from '../../../../services/ad-package.service';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-advertisement-dialog',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './advertisement-dialog.component.html',
  styleUrl: './advertisement-dialog.component.scss',
})
export class AdvertisementDialogComponent implements OnInit {
  advertisementForm: FormGroup;
  isEditMode: boolean = false;
  suppliers: Supplier[] = [];
  adPackages: AdPackage[] = [];
  image: File | null = null;
  previewImageUrl: string | null = null;
  supplierControl = new FormControl();
  adPackageControl = new FormControl();
  filteredSuppliers: Observable<Supplier[]> = of([]);
  filteredAdPackages: Observable<AdPackage[]> = of([]);

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AdvertisementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Advertisement,
    private statusService: StatusService,
    private advertisementService: AdvertisementService,
    private notificationService: NotificationService,
    private supplierService: SupplierService,
    private adPackageService: AdPackageService
  ) {
    this.advertisementForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: [''],
      targetUrl: [''],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
    });

    if (this.data !== null) {
      this.isEditMode = true;
      this.advertisementForm.patchValue({
        title: this.data.title,
        content: this.data.content,
        targetUrl: this.data.targetUrl,
        startDate: this.data.startDate,
        endDate: this.data.endDate,
        isActive: this.data.isActive,
        supplierId: this.data.supplier?.id,
        adPackageId: this.data.adPackage?.id,
      });
      this.previewImageUrl = this.data.imageUrl || null;
      this.supplierControl.setValue(this.data.supplier || null);
      this.adPackageControl.setValue(this.data.adPackage || null);
    } else {
      this.isEditMode = false;
    }
  }

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadAdPackages();
  }

  loadSuppliers() {
    const params: GetSuppliersParams = {
      pageNumber: 1,
      pageSize: 1000,
    };
    this.supplierService.getSuppliers(params).subscribe({
      next: (response: PaginationResponse<Supplier>) => {
        this.suppliers = response.data.items;
        console.log('Loaded suppliers:', this.suppliers); // Debug log
        // Set up autocomplete for suppliers after loading data
        this.filteredSuppliers = this.supplierControl.valueChanges.pipe(
          startWith(this.supplierControl.value || ''),
          tap((value) => console.log('Supplier input value:', value)), // Debug log
          map((value) =>
            typeof value === 'string' ? value : value?.name || ''
          ),
          map((name) =>
            name ? this._filterSuppliers(name) : this.suppliers.slice()
          ),
          tap((filtered) => console.log('Filtered suppliers:', filtered)) // Debug log
        );
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  loadAdPackages() {
    this.adPackageService.getAdPackages(1, 1000).subscribe({
      next: (response: PaginationResponse<AdPackage>) => {
        this.adPackages = response.data.items;
        console.log('Loaded ad packages:', this.adPackages); // Debug log
        // Set up autocomplete for ad packages after loading data
        this.filteredAdPackages = this.adPackageControl.valueChanges.pipe(
          startWith(this.adPackageControl.value || ''),
          tap((value) => console.log('Ad package input value:', value)), // Debug log
          map((value) =>
            typeof value === 'string' ? value : value?.title || ''
          ),
          map((title) =>
            title ? this._filterAdPackages(title) : this.adPackages.slice()
          ),
          tap((filtered) => console.log('Filtered ad packages:', filtered)) // Debug log
        );
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  private _filterSuppliers(name: string): Supplier[] {
    if (!name) return this.suppliers.slice();
    const filterValue = name.toLowerCase();
    return this.suppliers.filter((supplier) =>
      supplier.name?.toLowerCase().includes(filterValue)
    );
  }

  private _filterAdPackages(title: string): AdPackage[] {
    if (!title) return this.adPackages.slice();
    const filterValue = title.toLowerCase();
    return this.adPackages.filter((adPackage) =>
      adPackage.title?.toLowerCase().includes(filterValue)
    );
  }

  displaySupplier(supplier: Supplier): string {
    return supplier?.name || '';
  }

  displayAdPackage(adPackage: AdPackage): string {
    return adPackage?.title || '';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.image = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.image);
    }
  }

  onSubmit(): void {
    if (this.advertisementForm.invalid) {
      this.advertisementForm.markAllAsTouched();
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);

    const formData = new FormData();
    if (this.image) {
      formData.append('image', this.image);
    }
    const startDate = new Date(
      this.advertisementForm.value.startDate
    ).toISOString();
    const endDate = new Date(
      this.advertisementForm.value.endDate
    ).toISOString();

    formData.append('title', this.advertisementForm.value.title);
    formData.append('content', this.advertisementForm.value.content);
    formData.append('targetUrl', this.advertisementForm.value.targetUrl);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('isActive', this.advertisementForm.value.isActive);
    formData.append('supplierId', this.supplierControl.value?.id.toString());
    formData.append('adPackageId', this.adPackageControl.value?.id.toString());

    debugger;
    if (this.isEditMode) {
      this.advertisementService
        .updateAdvertisement(this.data.id, formData)
        .subscribe({
          next: (response: BaseResponse<Advertisement>) => {
            this.statusService.statusLoadingSpinnerSource.next(false);
            this.dialogRef.close(response.data);
            this.notificationService.success('Success', response.message);
          },
          error: (error: HttpErrorResponse) => {
            this.statusService.statusLoadingSpinnerSource.next(false);
            this.notificationService.handleApiError(error);
          },
        });
    } else {
      this.advertisementService.createAdvertisement(formData).subscribe({
        next: (response: BaseResponse<Advertisement>) => {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.dialogRef.close(response.data);
          this.notificationService.success('Success', response.message);
        },
        error: (error: HttpErrorResponse) => {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.notificationService.handleApiError(error);
        },
      });
    }
  }
}
