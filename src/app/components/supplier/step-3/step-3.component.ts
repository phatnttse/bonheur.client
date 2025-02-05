import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupplierService } from '../../../services/supplier.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import {
  Supplier,
  SupplierImage,
  UpdateSupplierImagesRequest,
} from '../../../models/supplier.model';
import { BaseResponse } from '../../../models/base.model';
import { StatusCode } from '../../../models/enums.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Account } from '../../../models/account.model';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateMainPhotoDialogComponent } from '../../dialogs/update-main-photo-dialog/update-main-photo-dialog.component';
import { FormsModule } from '@angular/forms';
import { DeletePhotoDialogComponent } from '../../dialogs/delete-photo-dialog/delete-photo-dialog.component';

@Component({
  selector: 'app-step-3',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    RouterModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './step-3.component.html',
  styleUrl: './step-3.component.scss',
})
export class Step3Component implements OnInit {
  previewImages: string[] = []; // Ảnh xem trước
  fileUploads: File[] = []; // File ảnh
  primaryImageIndex: number | null = null; // Index ảnh chính
  account: Account | null = null; // Tài khoản
  supplier: Supplier | null = null; // Nhà cung cấp
  supplierImages: SupplierImage[] = []; // Ảnh hiện tại
  currentPrimaryImage: SupplierImage | null = null; // Ảnh chính hiện tại
  @Input() isEditMode: boolean = false; // Chỉnh sửa

  constructor(
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dataService: DataService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dataService.supplierData$.subscribe((supplier: Supplier | null) => {
      if (supplier != null) {
        this.supplier = supplier;
        this.supplierImages = supplier.images || [];
        this.currentPrimaryImage =
          this.supplierImages.find((image: SupplierImage) => image.isPrimary) ??
          null;
      } else {
        if (this.authService.currentUser) {
          this.account = this.authService.currentUser;
          this.getSupplierByUserId(this.account.id);
        }
      }
    });
  }

  onUpload(event: any) {
    const files: FileList = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.fileUploads.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  setPrimaryImage(index: number) {
    this.primaryImageIndex = index;
  }

  removeImage(index: number) {
    this.previewImages.splice(index, 1);
    this.fileUploads.splice(index, 1);

    if (this.primaryImageIndex === index) {
      this.primaryImageIndex = null;
    } else if (
      this.primaryImageIndex !== null &&
      this.primaryImageIndex > index
    ) {
      this.primaryImageIndex--;
    }
  }

  saveChanges() {
    if (this.fileUploads.length === 0) {
      this.notificationService.warning(
        'Warning',
        'Please upload at least 4 photos'
      );
      return;
    }

    if (this.primaryImageIndex == null && this.supplierImages.length === 0) {
      this.notificationService.warning('Warning', 'Please select a main photo');
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);

    const request: UpdateSupplierImagesRequest = {
      files: this.fileUploads,
      primaryImageIndex: this.primaryImageIndex ?? null,
    };

    this.supplierService.updateSupplierImages(request).subscribe({
      next: (response: BaseResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.previewImages = [];
          this.getSupplierByUserId(this.account!.id!);
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

  getSupplierByUserId(userId: string) {
    this.supplierService.getSupplierByUserId(userId).subscribe({
      next: (response: BaseResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.supplier = response.data;
          this.supplierImages = this.supplier.images || [];
          this.currentPrimaryImage =
            this.supplierImages.find(
              (image: SupplierImage) => image.isPrimary
            ) ?? null;
          this.dataService.supplierDataSource.next(this.supplier);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  openUpdateMainPhotoDialog(imageId: number) {
    const dialogRef = this.dialog.open(UpdateMainPhotoDialogComponent, {
      data: imageId,
    });

    dialogRef.afterClosed().subscribe((result: SupplierImage) => {
      if (result) {
        this.supplierImages = this.supplierImages.map(
          (image: SupplierImage) => {
            if (image.id === result.id) {
              image.isPrimary = true;
            } else {
              image.isPrimary = false;
            }
            return image;
          }
        );
        this.supplier!.images = this.supplierImages;
        this.dataService.supplierDataSource.next(this.supplier);
        this.notificationService.success('Success', 'Main photo updated');
      } else {
        const updatedImages = this.supplierImages.map(
          (image: SupplierImage) => {
            if (image.id === this.currentPrimaryImage!.id) {
              image.isPrimary = true;
            } else {
              image.isPrimary = false;
            }
            return image;
          }
        );
        this.supplierImages = [...updatedImages];
        this.supplier!.images = updatedImages;
        this.dataService.supplierDataSource.next(this.supplier);
      }
    });
  }

  openDeletePhotoDialog(imageId: number) {
    if (this.supplierImages.length === 4) {
      this.notificationService.warning(
        'Warning',
        'You must have at least 4 photos'
      );
      return;
    }

    const dialogRef = this.dialog.open(DeletePhotoDialogComponent, {
      data: imageId,
    });

    dialogRef.afterClosed().subscribe((result: SupplierImage) => {
      if (result) {
        this.supplierImages = this.supplierImages.filter(
          (image: SupplierImage) => image.id !== result.id
        );
        this.supplier!.images = this.supplierImages;
        this.dataService.supplierDataSource.next(this.supplier);
        this.notificationService.success('Success', 'Photo deleted');
      }
    });
  }
}
