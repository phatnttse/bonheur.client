import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Input,
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
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-2',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    TablerIconsModule,
    CommonModule,
  ],
  templateUrl: './step-2.component.html',
  styleUrl: './step-2.component.scss',
})
export class Step2Component implements OnInit, AfterViewInit, OnDestroy {
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
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>; // Container bản đồ
  longitudeSupplier: number = 0; // Kinh độ
  latitudeSupplier: number = 0; // Vĩ độ
  filteredProvinces: any[] = []; // Danh sách tỉnh lọc
  filteredDistricts: any[] = []; // Danh sách huyện lọc
  filteredWards: any[] = []; // Danh sách xã lọc
  currentMarker: Marker | null = null;
  @Input() isEditMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private authService: AuthService,
    private locationService: LocationService,
    private dataService: DataService
  ) {
    this.formLocation = this.formBuilder.group({
      street: [''],
      ward: ['', [Validators.required]],
      district: ['', [Validators.required]],
      province: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    config.apiKey = environment.mapTilerApiKey;

    this.dataService.provinceData$.subscribe((provinces: any) => {
      if (provinces != null) {
        this.valueProvince = provinces;
        this.getDetailProvinces();
      } else {
        this.getProvinces();
      }
    });

    this.dataService.supplierData$.subscribe((supplier: Supplier | null) => {
      if (supplier != null) {
        this.supplier = supplier;
        setTimeout(() => {
          if (this.valueProvince && this.valueProvince.length > 0) {
            this.patchSupplerInfo(supplier);
          }
        }, 1000);
      } else {
        if (this.authService.currentUser) {
          this.account = this.authService.currentUser;
          setTimeout(() => {
            if (this.valueProvince && this.valueProvince.length > 0) {
              this.getSupplierByUserId(this.account!.id!);
            }
          }, 1000);
        }
      }
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

    window.addEventListener('resize', () => {
      if (this.map) {
        this.map.resize();
      }
    });
  }

  ngOnDestroy() {
    this.map?.remove();
    if (this.currentMarker) {
      this.currentMarker.remove(); // Remove the marker if it exists
    }
  }

  removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  filterProvinces(value: string): any[] {
    const filterValue = this.removeAccents(value.toLowerCase());
    return this.provinceList.filter((province) =>
      this.removeAccents(province.provinceName.toLowerCase()).includes(
        filterValue
      )
    );
  }

  onProvinceInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.filteredProvinces = this.filterProvinces(input);
  }

  filterDistricts(value: string): any[] {
    const filterValue = this.removeAccents(value.toLowerCase());
    return this.districtList.filter((district) =>
      this.removeAccents(district.districtName.toLowerCase()).includes(
        filterValue
      )
    );
  }

  onDistrictInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.filteredDistricts = this.filterDistricts(input);
  }

  filterWards(value: string): any[] {
    const filterValue = this.removeAccents(value.toLowerCase());
    return this.wardList.filter((ward) =>
      this.removeAccents(ward.communeName.toLowerCase()).includes(filterValue)
    );
  }

  onWardInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.filteredWards = this.filterWards(input);
  }

  getProvinces() {
    this.locationService.getProvinces().subscribe({
      next: (response: any) => {
        this.dataService.provinceDataSource.next(response);
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

  btnUpdateMap() {
    if (this.formLocation.invalid) {
      this.notificationService.warning(
        'Warning',
        'Please fill in all required fields'
      );
      return;
    }

    const address = `${this.formLocation.get('street')!.value}, ${
      this.formLocation.get('ward')!.value
    }, ${this.formLocation.get('district')!.value}, ${
      this.formLocation.get('province')!.value
    }`;

    this.getGeoCodeAddress(address);
  }

  getGeoCodeAddress(address: string) {
    this.locationService.geocodeAddress(address).subscribe({
      next: (response: any) => {
        this.patchGeoCodeAddressValue(response, address);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.notificationService.warning('Warning', 'Address not found');
        } else {
          this.notificationService.handleApiError(error);
        }
      },
    });
  }

  patchGeoCodeAddressValue(response: any, address: string) {
    this.latitudeSupplier = response.features[0].geometry.coordinates[1]; // Vĩ độ
    this.longitudeSupplier = response.features[0].geometry.coordinates[0]; // Kinh độ
    this.map?.setCenter([this.longitudeSupplier, this.latitudeSupplier]);
    const cardHTML = `
  <img
    src=${this.supplier?.images?.[0]?.imageUrl || ''}
    class="max-h-[201px] w-full object-cover rounded-t-md"
  />
  <div
    class="flex flex-col justify-between"
  >
    <div class="px-4 py-4">
      <h2 class="text-[#3d4750] text-base font-bold truncate mb-2">
        ${this.supplier?.name || 'Supplier Name'}
      </h2>
      <p class="text-[#3d4750] text-[14px]">${address}</p>
      <div class="flex items-center mt-2">
        <span class="text-[#fabb00] text-xl mb-[4px]">★</span>
        <span class="text-sm mr-1"></span>${this.supplier?.averageRating || 0}
        <span class="text-[#7d7d7d] text-[12px] ml-2"> (0 reviews) </span>
      </div>
      <span class="text-sm font-semibold mt-2"><span class="font-medium">From: </span> ${(
        this.supplier?.price || 0
      ).toLocaleString('en-US')}đ</span>
    </div>       
  </div>
`;
    this.currentMarker = new Marker({ color: '#FF0000' })
      .setPopup(
        new Popup()
          .setHTML(`${cardHTML}`)
          .setMaxWidth('300px')
          .setOffset([0, -40])
      )
      .setLngLat([this.longitudeSupplier, this.latitudeSupplier])
      .addTo(this.map!);
  }

  patchSupplerInfo(supplier: Supplier) {
    this.supplier = supplier;

    this.formLocation.patchValue({
      street: supplier.street,
      ward: supplier.ward,
      district: supplier.district,
      province: supplier.province,
    });

    if (this.supplier.latitude && this.supplier.longitude) {
      this.latitudeSupplier = parseFloat(this.supplier.latitude);
      this.longitudeSupplier = parseFloat(this.supplier.longitude);
      this.map?.setCenter([this.longitudeSupplier, this.latitudeSupplier]);
      const address = `${supplier.street}, ${supplier.ward}, ${supplier.district}, ${supplier.province}`;
      const cardHTML = `
      <img
        src=${this.supplier?.images?.[0]?.imageUrl || ''}
        class="max-h-[201px] w-full object-cover rounded-t-md"
      />
      <div
        class="flex flex-col justify-between"
      >
        <div class="px-4 py-4">
          <h2 class="text-[#3d4750] text-base font-bold truncate mb-2">
            ${this.supplier?.name || 'Supplier Name'}
          </h2>
          <p class="text-[#3d4750] text-[14px]">${address}</p>
          <div class="flex items-center mt-2">
            <span class="text-[#fabb00] text-xl mb-[4px]">★</span>
            <span class="text-sm mr-1"></span>${
              this.supplier?.averageRating || 0
            }
            <span class="text-[#7d7d7d] text-[12px] ml-2"> (0 reviews) </span>
          </div>
          <span class="text-sm font-semibold mt-2"><span class="font-medium">From: </span> ${(
            this.supplier?.price || 0
          ).toLocaleString('vi-VN')}đ</span>
        </div>       
      </div>
    `;
      this.currentMarker = new Marker({ color: '#FF0000' })
        .setPopup(
          new Popup()
            .setHTML(`${cardHTML}`)
            .setMaxWidth('300px')
            .setOffset([0, -40])
        )
        .setLngLat([this.longitudeSupplier, this.latitudeSupplier])
        .addTo(this.map!);
    } else {
      const address = `${supplier.street}, ${supplier.ward}, ${supplier.district}, ${supplier.province}`;
      this.getGeoCodeAddress(address);
    }
  }

  getSupplierByUserId(userId: string) {
    this.supplierService.getSupplierByUserId(userId).subscribe({
      next: (response: BaseResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.patchSupplerInfo(response.data);
          this.dataService.supplierDataSource.next(response.data);
        }
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
      latitude: this.latitudeSupplier.toString(),
      longitude: this.longitudeSupplier.toString(),
    };

    this.supplierService.updateSupplierAddress(request).subscribe({
      next: (response: BaseResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.currentMarker?.remove().addTo(this.map!);
          this.patchSupplerInfo(response.data);
          this.dataService.supplierDataSource.next(response.data);
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
    this.filteredProvinces = this.provinceList;
  }
  onProvinceChange(provinceId: string) {
    this.selectedProvinceId = provinceId;

    this.districtList = this.valueProvince
      .filter((p) => p.provinceId === provinceId)
      .map((p) => ({
        districtName: p.districtName,
        districtId: p.districtId,
      }));

    // Reset danh sách huyện và xã
    this.districtList.splice(0, this.districtList.length);
    this.wardList.splice(0, this.wardList.length);
    this.selectedDistrict = '';
    this.selectedWard = '';
    this.filteredDistricts = [];
    this.filteredWards = [];
    this.formLocation.get('district')?.reset();
    this.formLocation.get('ward')?.reset();

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

    this.filteredDistricts = this.districtList;
  }

  onDistrictChange(districtId: string) {
    // Reset danh sách xã
    this.wardList.splice(0, this.wardList.length);
    this.selectedWard = '';
    this.filteredWards = [];
    this.formLocation.get('ward')?.reset();

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

    this.filteredWards = this.wardList;
  }

  onWardChange(communeId: string) {
    const selectedCommune = this.valueProvince.find(
      (commune: any) => commune.communeId === communeId
    );
    if (selectedCommune) {
      this.selectedWard = selectedCommune.communeName;
    }
  }

  onEnter(type: string) {
    if (type === 'province') {
      const provinceName = this.formLocation.get('province')!.value;
      const provinceId = this.provinceList.find(
        (province) => province.provinceName === provinceName
      )?.provinceId;
      this.onProvinceChange(provinceId!);
    } else if (type === 'district') {
      const districtName = this.formLocation.get('district')!.value;
      const districtId = this.districtList.find(
        (district) => district.districtName === districtName
      )?.districtId;
      this.onDistrictChange(districtId!);
    } else if (type === 'ward') {
      const wardName = this.formLocation.get('ward')!.value;
      const communeId = this.wardList.find(
        (ward) => ward.communeName === wardName
      )?.communeId;
      this.onWardChange(communeId!);
    }
  }
}
