import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { SocialNetworkService } from '../../../services/social-networks.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../services/data.service';
import { MatTableDataSource } from '@angular/material/table';
import { SocialNetwork } from '../../../models/social-network';
import { MatSort } from '@angular/material/sort';
import { TablerIconsModule } from 'angular-tabler-icons';
import { BaseResponse } from '../../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { SocialNetworkDetailsComponent } from '../../dialogs/admin/social-networks/social-network-details/social-network-details.component';
import { DeleteSocialNetworkComponent } from '../../dialogs/admin/social-networks/delete-social-network/delete-social-network.component';

@Component({
  selector: 'app-social-networks-management',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule],
  templateUrl: './social-networks-management.component.html',
  styleUrl: './social-networks-management.component.scss',
})
export class SocialNetworksManagementComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<SocialNetwork> =
    new MatTableDataSource<SocialNetwork>();
  displayedColumns: string[] = ['icon', 'name', 'action'];
  socialNetworks: SocialNetwork[] = [];

  constructor(
    private socialNetworkService: SocialNetworkService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dialog: MatDialog,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.dataService.socialNetworkData$.subscribe(
      (socialNetworks: SocialNetwork[] | null) => {
        if (socialNetworks?.values) {
          this.socialNetworks = socialNetworks;
          this.dataSource = new MatTableDataSource(this.socialNetworks);
          this.dataSource.sort = this.sort;
        } else {
          this.getSocialNetworks();
        }
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSocialNetworks() {
    this.socialNetworkService.getSocialNetworks().subscribe({
      next: (response: BaseResponse<SocialNetwork[]>) => {
        this.socialNetworks = response.data;
        this.dataSource = new MatTableDataSource(this.socialNetworks);
        this.dataSource.sort = this.sort;
        this.dataService.socialNetworkDataSource.next(this.socialNetworks);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }
  openSNDetailsDialog(socialNetwork?: SocialNetwork) {
    const dialogRef = this.dialog.open(SocialNetworkDetailsComponent, {
      data: socialNetwork,
    });

    dialogRef.afterClosed().subscribe((result: SocialNetwork) => {
      if (result) {
        const index = this.socialNetworks.findIndex(
          (sn) => sn.id === result.id
        );

        if (index !== -1) {
          this.socialNetworks[index] = result;
        } else {
          this.socialNetworks.push(result);
        }

        this.dataSource = new MatTableDataSource(this.socialNetworks);
        this.dataSource.sort = this.sort;
      }
    });
  }

  openDeleteDialog(id: number) {
    const dialogRef = this.dialog.open(DeleteSocialNetworkComponent, {
      data: id,
    });
    dialogRef.afterClosed().subscribe((result: SocialNetwork) => {
      if (result) {
        this.socialNetworks = this.socialNetworks.filter(
          (sn) => sn.id !== result.id
        );
        this.dataSource = new MatTableDataSource(this.socialNetworks);
        this.dataSource.sort = this.sort;
      }
    });
  }
}
