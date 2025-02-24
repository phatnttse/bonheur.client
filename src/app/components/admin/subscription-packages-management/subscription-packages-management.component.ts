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
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import { DeleteCategoryComponent } from '../../dialogs/admin/delete-category/delete-category.component';
import { SubscriptionPackageDialogComponent } from '../../dialogs/admin/subscription-package-dialog/subscription-package-dialog.component';

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
    'action',
  ];
  constructor(
    private subscriptionPackageService: SubscriptionPackagesService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dialog: MatDialog,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.subscriptionPackagesData$.subscribe(
      (subscriptionPackages: SubscriptionPackage[] | null) => {
        if (subscriptionPackages?.values) {
          this.subscriptionPackages = subscriptionPackages;
          this.dataSource = new MatTableDataSource(this.subscriptionPackages);
          this.dataSource.sort = this.sort;
        } else {
          this.getSubscriptionPackages();
        }
      }
    );
  }

  // Get all subscription packages
  getSubscriptionPackages() {
    this.subscriptionPackageService.getSubscriptionPackages().subscribe({
      next: (response: ListSubscriptionPackageResponse) => {
        this.subscriptionPackages = response.data;
        this.dataSource = new MatTableDataSource(this.subscriptionPackages);
        this.dataSource.sort = this.sort;
        this.dataService.subscriptionPackagesDataSource.next(
          this.subscriptionPackages
        );
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error('ERROR', error.error.message);
        this.statusService.statusLoadingSpinnerSource.next(false);
      },
    });
  }

  openDialog(id?: number): void {
    let selectedSubscriptionPackage;

    if (id) {
      selectedSubscriptionPackage = this.subscriptionPackages.find(
        (sp) => sp.id === id
      );
    } else {
      selectedSubscriptionPackage = {};
    }

    const dialogRef = this.dialog.open(SubscriptionPackageDialogComponent, {
      data: selectedSubscriptionPackage,
    });

    dialogRef.afterClosed().subscribe((result: SubscriptionPackage) => {
      if (result) {
        const index = this.subscriptionPackages.findIndex(
          (item) => item.id === result.id
        );
        if (index !== -1) {
          this.subscriptionPackages[index] = result;
        } else {
          this.subscriptionPackages.push(result);
        }

        this.dataService.subscriptionPackagesDataSource.next(
          this.subscriptionPackages
        );
      }
    });
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

          this.dataService.subscriptionPackagesDataSource.next(
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
