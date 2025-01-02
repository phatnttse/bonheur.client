import { SubscriptionPackagesService } from './../../../services/subscription-packages.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import {
  ListSubscriptionPackageResponse,
  SubscriptionPackage,
  SubscriptionPackageResponse,
} from './../../../models/subscription-packages.model';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterModule } from '@angular/router';
import { SubscriptionPackageDialogComponent } from '../../dialogs/subscription-package-dialog/subscription-package-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteCategoryComponent } from '../../dialogs/delete-category/delete-category.component';

@Component({
  selector: 'app-subscription-packages-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    TablerIconsModule,
    RouterModule,
  ],
  templateUrl: './subscription-packages-management.component.html',
  styleUrl: './subscription-packages-management.component.scss',
})
export class SubscriptionPackagesManagementComponent {
  @ViewChild(MatSort) sort!: MatSort;
  subscriptionPackages: SubscriptionPackage[] = [];
  selectedSubscriptionPackage: SubscriptionPackage | null = null;
  dataSource: MatTableDataSource<SubscriptionPackage> =
    new MatTableDataSource<SubscriptionPackage>();
  displayedColumns: string[] = [
    'name',
    'description',
    'durationInDays',
    'price',
    'isFeatured',
    'priority',
    'action',
  ];
  constructor(
    private subscriptionPackageService: SubscriptionPackagesService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getSubscriptionPackages();
  }

  // Get all subscription packages
  getSubscriptionPackages() {
    this.subscriptionPackageService.getSubscriptionPackages().subscribe({
      next: (response: ListSubscriptionPackageResponse) => {
        this.subscriptionPackages = response.data;
        this.dataSource = new MatTableDataSource(this.subscriptionPackages);
        this.dataSource.sort = this.sort;
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error('ERROR', error.error.message);
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
    });
  }

  openDialog(id?: number): void {
    if (id) {
      this.subscriptionPackageService.getSubscriptionPackageById(id).subscribe({
        next: (response: SubscriptionPackageResponse) => {
          const dialogRef = this.dialog.open(
            SubscriptionPackageDialogComponent,
            {
              data: response.data,
              width: '1500px',
            }
          );

          dialogRef.afterClosed().subscribe((result) => {
            this.getSubscriptionPackages();
          });
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.error('ERROR', error.error.message);
        },
      });
    } else {
      const dialogRef = this.dialog.open(SubscriptionPackageDialogComponent, {
        data: {},
        width: '1500px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.getSubscriptionPackages();
      });
    }
  }

  openDeleteDialog(id: number): void {
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      width: '300px',
      data: {
        id,
        deleteFn: () =>
          this.subscriptionPackageService.deleteSubscriptionPackage(id),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.subscriptionPackages.findIndex(
          (category) => category.id === id
        );
        if (index !== -1) {
          this.subscriptionPackages.splice(index, 1);

          this.dataSource = new MatTableDataSource(this.subscriptionPackages);
          this.dataSource.sort = this.sort;

          this.subscriptionPackageService.subscriptionPackagesDataSource.next(
            this.subscriptionPackages
          );
        }
      }
    });
  }

  deleteItemById(id: number) {
    return this.subscriptionPackageService.deleteSubscriptionPackage(id);
  }
}
