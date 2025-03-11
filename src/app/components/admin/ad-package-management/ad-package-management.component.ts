import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MaterialModule } from '../../../material.module';
import { MatTableDataSource } from '@angular/material/table';
import { AdPackage } from '../../../models/ad-package.model';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DataService } from '../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../services/notification.service';
import { AdPackageService } from '../../../services/ad-package.service';
import { PaginationResponse } from '../../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AdPackageDialogComponent } from '../../dialogs/admin/ad-package-dialog/ad-package-dialog.component';
import { DeleteAdPackageDialogComponent } from '../../dialogs/admin/delete-ad-package-dialog/delete-ad-package-dialog.component';
import { VNDCurrencyPipe } from '../../../pipes/vnd-currency.pipe';

@Component({
  selector: 'app-ad-package-management',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule, VNDCurrencyPipe],
  templateUrl: './ad-package-management.component.html',
  styleUrl: './ad-package-management.component.scss',
})
export class AdPackageManagementComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  adPackages: AdPackage[] = [];
  dataSource: MatTableDataSource<AdPackage> =
    new MatTableDataSource<AdPackage>();
  displayedColumns: string[] = [
    'title',
    'price',
    'startDate',
    'endDate',
    'adType',
    'isActive',
    'actions',
  ];
  pageNumber: number = 1;
  pageSize: number = 10;
  totalItemCount: number = 0;
  pageCount: number = 0;
  isFirstPage: boolean = false;
  isLastPage: boolean = false;
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private adPackageService: AdPackageService
  ) {}

  ngOnInit(): void {
    this.dataService.adPackageListData$.subscribe(
      (data: AdPackage[] | null) => {
        if (data?.values) {
          this.adPackages = data;
          this.dataSource = new MatTableDataSource(this.adPackages);
          this.dataSource.sort = this.sort;
        } else {
          this.getAdPackages(this.pageNumber, this.pageSize);
        }
      }
    );
  }

  getAdPackages(pageNumber: number, pageSize: number, adPackageTitle?: string) {
    this.adPackageService
      .getAdPackages(pageNumber, pageSize, adPackageTitle)
      .subscribe({
        next: (response: PaginationResponse<AdPackage>) => {
          this.adPackages = response.data.items;
          this.dataSource = new MatTableDataSource(this.adPackages);
          this.dataService.adPackageListDataSource.next(this.adPackages);
          this.dataSource.sort = this.sort;
          this.pageNumber = response.data.pageNumber;
          this.pageSize = response.data.pageSize;
          this.totalItemCount = response.data.totalItemCount;
          this.isFirstPage = response.data.isFirstPage;
          this.isLastPage = response.data.isLastPage;
          this.hasNextPage = response.data.hasNextPage;
          this.hasPreviousPage = response.data.hasPreviousPage;
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.handleApiError(error);
        },
      });
  }

  openAdPackageDialog(adPackage: AdPackage | null = null) {
    const dialogRef = this.dialog.open(AdPackageDialogComponent, {
      data: adPackage,
    });

    dialogRef.afterClosed().subscribe((result: AdPackage) => {
      if (result) {
        const index = this.adPackages.findIndex(
          (adPackage) => adPackage.id === result.id
        );
        if (index !== -1) {
          this.adPackages[index] = result;
        } else {
          this.adPackages.push(result);
        }
        this.dataService.adPackageListDataSource.next(this.adPackages);
      }
    });
  }

  openDeleteDialog(id: number): void {
    const dialogRef = this.dialog.open(DeleteAdPackageDialogComponent, {
      data: id,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.adPackages.findIndex(
          (adPackage) => adPackage.id === id
        );
        if (index !== -1) {
          this.adPackages.splice(index, 1);

          this.dataService.adPackageListDataSource.next(this.adPackages);
        }
      }
    });
  }
}
