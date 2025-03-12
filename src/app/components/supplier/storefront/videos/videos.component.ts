import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { Supplier, SupplierVideo } from '../../../../models/supplier.model';
import { SupplierService } from '../../../../services/supplier.service';
import { NotificationService } from '../../../../services/notification.service';
import { StatusService } from '../../../../services/status.service';
import { DataService } from '../../../../services/data.service';
import { AuthService } from '../../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Account } from '../../../../models/account.model';
import { BaseResponse } from '../../../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusCode } from '../../../../models/enums.model';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DeleteVideoComponent } from '../../../dialogs/supplier/storefront/delete-video/delete-video.component';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss',
})
export class VideosComponent implements OnInit {
  videoUrl: string | null = null;
  fileInput!: HTMLInputElement;
  supplierVideos: SupplierVideo[] = [];
  supplier: Supplier | null = null;
  account: Account | null = null;
  videoFile: File | null = null;

  constructor(
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dataService: DataService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dataService.supplierData$.subscribe((supplier: Supplier | null) => {
      if (supplier != null) {
        this.supplier = supplier;
        this.supplierVideos = supplier.videos || [];
      } else {
        if (this.authService.currentUser) {
          this.account = this.authService.currentUser;
          this.getSupplierByUserId(this.account.id);
        }
      }
    });
  }

  onUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.videoUrl = URL.createObjectURL(file);
      this.fileInput = input;
      this.videoFile = file;
      this.cdRef.detectChanges();
    }
  }

  removeVideo() {
    this.videoUrl = null;

    if (this.fileInput) {
      this.fileInput.value = '';
    }
  }

  getSupplierByUserId(userId: string) {
    this.supplierService.getSupplierByUserId(userId).subscribe({
      next: (response: BaseResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.supplier = response.data;
          this.supplierVideos = this.supplier.videos || [];
          this.dataService.supplierDataSource.next(this.supplier);
          this.statusService.statusLoadingSpinnerSource.next(false);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  saveChanges() {
    const maxVideoSize = 500 * 1024 * 1024;
    if (this.videoFile?.size! > maxVideoSize) {
      this.notificationService.warning(
        'Warning',
        'File size cannot exceed 500MB'
      );
      return;
    }

    if (!this.videoFile) {
      this.notificationService.warning('Warning', 'Please select a video');
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);

    this.supplierService.uploadVideo(this.videoFile).subscribe({
      next: (response: BaseResponse<SupplierVideo>) => {
        this.supplierVideos.push(response.data);
        this.supplier!.videos = this.supplierVideos;
        this.dataService.supplierDataSource.next(this.supplier);
        this.notificationService.success('Success', response.message);
        this.removeVideo();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
      complete: () => {
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
    });
  }

  openDeleteVideoDialog(videoId: number) {
    const dialogRef = this.dialog.open(DeleteVideoComponent, {
      data: videoId,
    });

    dialogRef.afterClosed().subscribe((result: SupplierVideo) => {
      if (result) {
        this.supplierVideos = this.supplierVideos.filter(
          (video: SupplierVideo) => video.id !== result.id
        );
        this.supplier!.videos = this.supplierVideos;
        this.dataService.supplierDataSource.next(this.supplier);
        this.notificationService.success('Success', 'Video deleted');
      }
    });
  }
}
