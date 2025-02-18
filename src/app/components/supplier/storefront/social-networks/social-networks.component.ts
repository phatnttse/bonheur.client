import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { SocialNetwork } from '../../../../models/social-network';
import { SocialNetworkService } from '../../../../services/social-networks.service';
import { BaseResponse } from '../../../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../../services/notification.service';
import { StatusService } from '../../../../services/status.service';
import { SupplierService } from '../../../../services/supplier.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SupplierSocialNetwork,
  SupplierSocialNetworkRequest,
} from '../../../../models/supplier.model';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-social-networks',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './social-networks.component.html',
  styleUrl: './social-networks.component.scss',
})
export class SocialNetworksComponent implements OnInit {
  socialNetworks: SocialNetwork[] = [];
  supplierSocialNetworks: SupplierSocialNetwork[] = [];
  socialNetworkForm: FormGroup;

  constructor(
    private socialNetworkService: SocialNetworkService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private supplierService: SupplierService,
    private formBuilder: FormBuilder,
    private dataService: DataService
  ) {
    this.socialNetworkForm = this.formBuilder.group({
      socialNetworks: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.dataService.socialNetworkData$.subscribe(
      (data: SocialNetwork[] | null) => {
        if (data?.values) {
          this.socialNetworks = data;
          this.populateSocialNetworksForm();
        } else {
          this.getSocialNetworks();
        }
      }
    );
    this.dataService.supplierSocialNetworkData$.subscribe(
      (data: SupplierSocialNetwork[] | null) => {
        if (data?.values) {
          this.supplierSocialNetworks = data;
          this.populateSupplierSocialNetworksForm();
        } else {
          this.getSupplierSocialNetworks();
        }
      }
    );
  }

  socialNetworksFormArray(): FormArray {
    return this.socialNetworkForm.get('socialNetworks') as FormArray;
  }

  populateSocialNetworksForm(): void {
    const socialNetworksArray = this.socialNetworksFormArray();
    socialNetworksArray.clear();
    this.socialNetworks.forEach((network) => {
      socialNetworksArray.push(
        this.formBuilder.group({
          id: new FormControl(network.id),
          name: new FormControl(network.name),
          icon: new FormControl(network.imageUrl),
          url: new FormControl(''), // URL người dùng nhập
        })
      );
    });
  }

  getSocialNetworks(): void {
    this.socialNetworkService.getSocialNetworks().subscribe({
      next: (response: BaseResponse<SocialNetwork[]>) => {
        this.socialNetworks = response.data;
        this.dataService.socialNetworkDataSource.next(this.socialNetworks);
        this.populateSocialNetworksForm();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  populateSupplierSocialNetworksForm(): void {
    const socialNetworksArray = this.socialNetworksFormArray();
    this.supplierSocialNetworks.forEach((network) => {
      const control = socialNetworksArray.controls.find(
        (x) => x.get('id')?.value === network.socialNetworkId
      );
      if (control) {
        control.get('url')?.setValue(network.url);
        (control as FormGroup).addControl(
          'originalUrl',
          new FormControl(network.url)
        );
        (control as FormGroup).addControl(
          'supplierSocialNetworkId',
          new FormControl(network.id)
        );
      }
    });
  }

  getSupplierSocialNetworks(): void {
    this.supplierService.getSupplierSocialNetworks().subscribe({
      next: (response: BaseResponse<SupplierSocialNetwork[]>) => {
        this.supplierSocialNetworks = response.data;
        this.dataService.supplierSocialNetworkDataSource.next(
          this.supplierSocialNetworks
        );
        this.populateSupplierSocialNetworksForm();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  insertUpdateSupplierSocialNetworks(): void {
    const socialNetworksArray = this.socialNetworksFormArray();
    const newSupplierSocialNetworks: SupplierSocialNetworkRequest[] = [];
    const updatedSupplierSocialNetworks: SupplierSocialNetworkRequest[] = [];

    socialNetworksArray.controls.forEach((control) => {
      const url = control.get('url')!.value;
      const originalUrl = control.get('originalUrl')?.value;
      const supplierSocialNetworkId =
        control.get('supplierSocialNetworkId')?.value || 0; // Lấy ID nhà cung cấp

      if (url) {
        if (supplierSocialNetworkId === 0) {
          // THÊM MỚI
          newSupplierSocialNetworks.push({
            socialNetworkId: control.get('id')?.value,
            url: url ?? '',
          });
        } else if (url !== originalUrl) {
          // CẬP NHẬT
          updatedSupplierSocialNetworks.push({
            socialNetworkId: control.get('id')?.value,
            url: url ?? '',
            id: supplierSocialNetworkId, // ID cũ cần cập nhật
          });
        }
      }
    });

    // Gọi API nếu có dữ liệu mới cần gửi
    if (newSupplierSocialNetworks.length > 0) {
      this.supplierService
        .createSupplierSocialNetworks(newSupplierSocialNetworks)
        .subscribe({
          next: (response: BaseResponse<SupplierSocialNetwork[]>) => {
            this.supplierSocialNetworks.push(...response.data);
            this.dataService.supplierSocialNetworkDataSource.next(
              this.supplierSocialNetworks
            );
            this.populateSupplierSocialNetworksForm();
            this.notificationService.success('Success', 'Saved successfully');
          },
          error: (error: HttpErrorResponse) => {
            this.notificationService.handleApiError(error);
          },
        });
    }

    if (updatedSupplierSocialNetworks.length > 0) {
      this.supplierService
        .updateSupplierSocialNetworks(updatedSupplierSocialNetworks)
        .subscribe({
          next: (response: BaseResponse<SupplierSocialNetwork[]>) => {
            this.supplierSocialNetworks = response.data;
            this.dataService.supplierSocialNetworkDataSource.next(
              this.supplierSocialNetworks
            );
            this.populateSupplierSocialNetworksForm();
            this.notificationService.success('Success', 'Saved successfully');
          },
          error: (error: HttpErrorResponse) => {
            this.notificationService.handleApiError(error);
          },
        });
    }

    if (
      newSupplierSocialNetworks.length === 0 &&
      updatedSupplierSocialNetworks.length === 0
    ) {
      return;
    }
  }
}
