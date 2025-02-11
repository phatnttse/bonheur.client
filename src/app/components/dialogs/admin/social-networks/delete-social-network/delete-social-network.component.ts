import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../material.module';
import { SocialNetworkService } from '../../../../../services/social-networks.service';
import { NotificationService } from '../../../../../services/notification.service';
import { StatusService } from '../../../../../services/status.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SocialNetworkDetailsComponent } from '../social-network-details/social-network-details.component';
import { SocialNetwork } from '../../../../../models/social-network';
import { BaseResponse } from '../../../../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-social-network',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './delete-social-network.component.html',
  styleUrl: './delete-social-network.component.scss',
})
export class DeleteSocialNetworkComponent {
  constructor(
    private socialNetworkService: SocialNetworkService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private dialogRef: MatDialogRef<SocialNetworkDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {}

  btnDelete() {
    this.statusService.statusLoadingSpinnerSource.next(true);
    this.socialNetworkService.deleteSocialNetwork(this.data).subscribe({
      next: (response: BaseResponse<SocialNetwork>) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.success('Success', response.message);
        this.dialogRef.close(response.data);
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
        this.dialogRef.close();
      },
    });
  }
}
