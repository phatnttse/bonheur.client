import { Component, OnInit, ViewChild } from '@angular/core';
import { Advertisement } from '../../../models/advertisement.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../services/notification.service';
import { AdvertisementService } from '../../../services/advertisement.service';
import { PaginationResponse } from '../../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AdvertisementDialogComponent } from '../../dialogs/admin/advertisement-dialog/advertisement-dialog.component';

@Component({
  selector: 'app-advertisement-management',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule],
  templateUrl: './advertisement-management.component.html',
  styleUrl: './advertisement-management.component.scss',
})
export class AdvertisementManagementComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  advertisementList: Advertisement[] = [];
  dataSource: MatTableDataSource<Advertisement> =
    new MatTableDataSource<Advertisement>();
  displayedColumns: string[] = [
    'imageOrVideo',
    'supplier',
    'adPackage',
    'startDate',
    'endDate',
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
    private advertisementService: AdvertisementService
  ) {}

  ngOnInit(): void {
    this.getAdvertisement(this.pageNumber, this.pageSize); // Load data on initialization
  }

  getAdvertisement(pageNumber: number, pageSize: number) {
    this.advertisementService
      .getAdvertisements(pageNumber, pageSize)
      .subscribe({
        next: (response: PaginationResponse<Advertisement>) => {
          this.advertisementList = response.data.items;
          this.dataSource = new MatTableDataSource(this.advertisementList);
          this.dataSource.sort = this.sort;
          this.pageNumber = response.data.pageNumber;
          this.pageSize = response.data.pageSize;
          this.totalItemCount = response.data.totalItemCount;
          this.isFirstPage = response.data.isFirstPage;
          this.isLastPage = response.data.isLastPage;
          this.hasNextPage = response.data.hasNextPage;
          this.hasPreviousPage = response.data.hasPreviousPage;
        },
        error: (error: HttpErrorResponse) => {},
      });
  }

  openAdvertisementDialog(advertisement: Advertisement | null = null) {
    const dialogRef = this.dialog.open(AdvertisementDialogComponent, {
      data: advertisement,
      maxHeight: '100vh', // Set a maximum height (90% of viewport height)
      width: '600px', // Set a reasonable width
      panelClass: 'scrollable-dialog', // Add a custom class for styling
      autoFocus: false, // Prevent auto-focusing on the first input
    });

    dialogRef.afterClosed().subscribe((result: Advertisement) => {
      if (result) {
        const index = this.advertisementList.findIndex(
          (ad) => ad.id === result.id
        );
        if (index !== -1) {
          this.advertisementList[index] = result;
        } else {
          this.advertisementList.push(result);
        }
        this.dataSource = new MatTableDataSource(this.advertisementList);
        this.dataSource.sort = this.sort;
      }
    });
  }
}
