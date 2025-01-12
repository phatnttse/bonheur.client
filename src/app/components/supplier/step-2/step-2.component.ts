import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { MaterialModule } from '../../../material.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { SupplierService } from '../../../services/supplier.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import { AuthService } from '../../../services/auth.service';
import { Map, MapStyle, Marker, Popup, config } from '@maptiler/sdk';
import { environment } from '../../../environments/environment.dev';
import { LocationService } from '../../../services/location.service';
import { Account } from '../../../models/account.model';
import {
  Supplier,
  UpdateSupplierAddressRequest,
} from '../../../models/supplier.model';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseResponse } from '../../../models/base.model';
import { StatusCode } from '../../../models/enums.model';

@Component({
  selector: 'app-step-2',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    TablerIconsModule,
  ],
  templateUrl: './step-2.component.html',
  styleUrl: './step-2.component.scss',
})
export class Step2Component implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map')
  formLocation: FormGroup; // Form địa chỉ
  account: Account | null = null; // Tài khoản
  supplier: Supplier | null = null; // Nhà cung cấp
  valueProvince: any = []; // Danh sách tỉnh
  provinceList: any = []; // Danh sách tỉnh
  districtList: any = []; // Danh sách huyện
  wardList: any = []; // Danh sách xã
  selectedProvinceId: string = ''; // Tỉnh được chọn
  selectedProvince: string = ''; // Tỉnh được chọn
  selectedDistrict: string = ''; // Huyện được chọn
  selectedWard: string = ''; // Xã được chọn
  map: Map | undefined; // Bản đồ
  private mapContainer!: ElementRef<HTMLElement>; // Container bản đồ
  longitudeSupplier: number = 0; // Kinh độ
  latitudeSupplier: number = 0; // Vĩ độ

  constructor(
    private formBuilder: FormBuilder,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private authService: AuthService,
    private locationService: LocationService
  ) {
    this.formLocation = this.formBuilder.group({
      street: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      ward: ['', [Validators.required]],
      district: ['', [Validators.required]],
      province: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    config.apiKey = environment.mapTilerApiKey;

    if (this.authService.isLoggedIn) {
      if (this.authService.currentUser) {
        this.account = this.authService.currentUser;
        this.getSupplierByUserId(this.account.id);
      }
    }

    this.locationService.getProvinces().subscribe({
      next: (response) => {
        this.valueProvince = response;
      },
      complete: () => {
        this.getDetailProvinces();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngAfterViewInit() {
    // HCM
    const initialState = {
      lng: 106.629662,
      lat: 10.823099,
      zoom: 10,
    };

    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: MapStyle.STREETS,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom,
    });

    setTimeout(() => {
      this.map?.resize();
    }, 0);

    window.addEventListener('resize', () => this.map?.resize());
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  btnUpdateMap() {
    const address =
      this.formLocation.value.street +
      ', ' +
      this.selectedWard +
      ', ' +
      this.selectedDistrict +
      ', ' +
      this.selectedProvince;
    this.locationService.geocodeAddress(address).subscribe((response: any) => {
      this.latitudeSupplier = response.features[0].geometry.coordinates[1]; // Vĩ độ
      this.longitudeSupplier = response.features[0].geometry.coordinates[0]; // Kinh độ
      this.map?.setCenter([this.longitudeSupplier, this.latitudeSupplier]);
      new Marker({ color: '#FF0000' })
        .setPopup(
          new Popup()
            .setText(this.supplier!.name!)
            .setHTML(`<strong>Address:</strong> ${address}`)
        )
        .setLngLat([this.longitudeSupplier, this.latitudeSupplier])
        .addTo(this.map!);
    });
  }

  getSupplierByUserId(userId: string) {
    this.supplierService.getSupplierByUserId(userId).subscribe({
      next: (response: BaseResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK)
          this.supplier = response.data;

        this.formLocation.patchValue({
          street: this.supplier?.street,
          ward: this.supplier?.ward,
          district: this.supplier?.district,
          province: this.supplier?.province,
        });

        const address =
          this.supplier?.street +
          ', ' +
          this.supplier?.ward +
          ', ' +
          this.supplier?.district +
          ', ' +
          this.supplier?.province;

        this.locationService.geocodeAddress(address).subscribe({
          next: (response: any) => {
            this.latitudeSupplier =
              response.features[0].geometry.coordinates[1];
            this.longitudeSupplier =
              response.features[0].geometry.coordinates[0];
            this.map?.setCenter([
              this.longitudeSupplier,
              this.latitudeSupplier,
            ]);
            new Marker({ color: '#FF0000' })
              .setPopup(
                new Popup()
                  .setText(this.supplier!.name!)
                  .setHTML(`<strong>Address:</strong> ${address}`)
              )
              .setLngLat([this.longitudeSupplier, this.latitudeSupplier])
              .addTo(this.map!);
          },
          error: (error: HttpErrorResponse) => {
            this.notificationService.handleApiError(error);
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  btnUpdateSupplierAddress() {
    if (this.formLocation.invalid) {
      this.notificationService.warning(
        'Warning',
        'Please fill in all required fields'
      );
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);

    const request: UpdateSupplierAddressRequest = {
      street: this.formLocation.get('street')!.value,
      ward: this.formLocation.get('ward')!.value,
      district: this.formLocation.get('district')!.value,
      province: this.formLocation.get('province')!.value,
    };

    this.supplierService.updateSupplierAddress(request).subscribe({
      next: (response: BaseResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.supplier = response.data;
          this.formLocation.patchValue({
            street: this.supplier?.street,
            ward: this.supplier?.ward,
            district: this.supplier?.district,
            province: this.supplier?.province,
          });
          this.btnUpdateMap();
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

  getDetailProvinces() {
    let setProvinces = new Set();
    this.wardList.splice(0, this.wardList.length);
    this.districtList.splice(0, this.districtList.length);
    this.valueProvince.forEach((response: any) => {
      if (!setProvinces.has(response.provinceId)) {
        let cloneProvince = {
          provinceName: response.provinceName,
          provinceId: response.provinceId,
        };
        this.provinceList.push(cloneProvince);
        setProvinces.add(response.provinceId);
      }
    });
  }
  onProvinceChange(provinceId: string) {
    this.selectedProvinceId = provinceId;

    // Reset danh sách huyện và xã
    this.districtList.splice(0, this.districtList.length);
    this.wardList.splice(0, this.wardList.length);

    // Tìm tỉnh theo ID và lưu tên vào form
    const selectedProvince = this.valueProvince.find(
      (province: any) => province.provinceId === provinceId
    );
    if (selectedProvince) {
      this.selectedProvince = selectedProvince.provinceName;
    }

    // Lọc danh sách huyện theo tỉnh được chọn
    let setDistricts = new Set();
    this.valueProvince.forEach((response: any) => {
      if (
        response.provinceId === provinceId &&
        !setDistricts.has(response.districtId)
      ) {
        let cloneDistrict = {
          districtName: response.districtName,
          districtId: response.districtId,
        };
        this.districtList.push(cloneDistrict);
        setDistricts.add(response.districtId);
      }
    });
  }

  onDistrictChange(districtId: string) {
    // Reset danh sách xã
    this.wardList.splice(0, this.wardList.length);

    // Tìm quận theo ID và lưu tên vào form
    const selectedDistrict = this.valueProvince.find(
      (district: any) => district.districtId === districtId
    );
    if (selectedDistrict) {
      this.selectedDistrict = selectedDistrict.districtName;
    }

    // Lọc danh sách xã theo huyện được chọn
    this.valueProvince.forEach((response: any) => {
      if (response.districtId === districtId) {
        let cloneCommune = {
          communeName: response.communeName,
          communeId: response.communeId,
        };
        this.wardList.push(cloneCommune);
      }
    });
  }

  onWardChange(communeId: string) {
    const selectedCommune = this.valueProvince.find(
      (commune: any) => commune.communeId === communeId
    );
    if (selectedCommune) {
      this.selectedWard = selectedCommune.communeName;
    }
  }
}
