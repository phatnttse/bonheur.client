import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { GetSuppliersParams, Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';
import { BaseResponse, PaginationResponse } from '../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { StatusService } from '../../services/status.service';
import { StatusCode } from '../../models/enums.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FavoriteSupplierService } from '../../services/favorite-supplier.service';
import { DataService } from '../../services/data.service';
import {
  FavoriteSupplier,
  PaginatedFavoriteSupplier,
} from '../../models/favorite-supplier.model';
import { MatDialog } from '@angular/material/dialog';
import { Utilities } from '../../services/utilities';
import { TruncatePipe } from '../../pipes/truncate.pipte';
import { VNDCurrencyPipe } from '../../pipes/vnd-currency.pipe';
import {
  ListSupplierCategoryResponse,
  SupplierCategory,
} from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { config, Map, MapStyle, Marker, Popup } from '@maptiler/sdk';
import { environment } from '../../environments/environment.dev';
import { DeleteCategoryComponent } from '../dialogs/admin/delete-category/delete-category.component';
import { AuthService } from '../../services/auth.service';
import { RequestPricingDialogComponent } from '../dialogs/user/request-pricing-dialog/request-pricing-dialog.component';
import { LocalStorageManager } from '../../services/localstorage-manager.service';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    TruncatePipe,
    VNDCurrencyPipe,
  ],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.scss',
})
export class SuppliersComponent implements OnInit, OnDestroy {
  map: Map | undefined; // Bản đồ
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>; // Container bản đồ
  supplierList: Supplier[] = []; // Danh sách supplier
  minPrice: number = 0; // Giá tối thiểu
  maxPrice: number = 0; // Giá tối đa
  gridLayout: boolean = false; // Hiển thị grid hoặc list
  favoriteSuppliers: FavoriteSupplier[] = []; // Danh sách supplier yêu thích
  pageNumber: number = 1; // Trang hiện tại
  pageSize: number = 10; // Số item mỗi trang
  totalItemCount: number = 0; // Tổng số item
  pageCount: number = 0; // Tổng số trang
  isFirstPage: boolean = false; // Có phải trang đầu tiên không
  isLastPage: boolean = false; // Có phải trang cuối cùng không
  hasNextPage: boolean = false; // Có trang tiếp theo không
  hasPreviousPage: boolean = false; // Có trang trước đó không
  search: string = ''; // Search theo tên supplier
  province: string = ''; // Lọc theo tỉnh thành
  isFeatured: boolean = false; // Lọc theo supplier nổi bật
  averageRating: number = 0; // Lọc theo rating
  sortAsc: boolean | null = null; // Sắp xếp tăng dần
  orderBy: string = ''; // Sắp xếp theo
  supplierCategories: SupplierCategory[] = [];
  supplierCategoryIds: number[] = []; // Lưu các ID category đã chọn
  selectedFilters: { key: string; value: string }[] = []; // Lưu các filter đã chọn
  selectedCategories: Set<number> = new Set(); // Lưu các category đã chọn để set lại checked của checkbox
  isFilterOpen: boolean = false; // Check xem filter menu có mở không
  openMap: boolean = false; // Check xem có hiển thị bản đồ không
  private markers: Marker[] = []; // Lưu các marker trên bản đồ

  constructor(
    private supplierService: SupplierService,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private router: Router,
    private dataService: DataService,
    private favoriteSupplierService: FavoriteSupplierService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorage: LocalStorageManager
  ) {}

  ngOnInit(): void {
    config.apiKey = environment.mapTilerApiKey;

    this.cdr.detectChanges();

    this.route.queryParams.subscribe((params) => {
      this.search = params['q'] || '';
      this.province = params['province'] || '';

      this.getSuppliers();
      this.updateSelectedFilters();
    });

    this.dataService.supplierListData$.subscribe(
      (suppliers: Supplier[] | null) => {
        if (suppliers?.values) {
          this.supplierList = suppliers;
        } else {
          this.getSuppliers();
        }
      }
    );

    this.dataService.supplierCategoryData$.subscribe(
      (categories: SupplierCategory[] | null) => {
        if (categories?.values) {
          this.supplierCategories = categories;
        } else {
          this.getCategories();
        }
      }
    );

    this.dataService.favoriteSupplierData$.subscribe(
      (favoriteSuppliers: FavoriteSupplier[] | null) => {
        if (favoriteSuppliers?.values) {
          this.favoriteSuppliers = favoriteSuppliers;
          this.cdr.detectChanges();
        } else {
          this.getAllFavoriteSupplier(this.pageNumber, this.pageSize);
        }
      }
    );
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

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  btnAddFavoriteSupplier(supplierId: number) {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/authentication/signin']);
      this.notificationService.info(
        'Information',
        'Please sign in to continue'
      );
      return;
    }
    this.favoriteSupplierService.addFavoriteSupplier(supplierId).subscribe({
      next: (response: BaseResponse<FavoriteSupplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          // this.supplierList = mockSupplierData.data.items;
          // Kiểm tra nếu supplier đã có trong favoriteSuppliers thì không thêm nữa
          if (
            !this.favoriteSuppliers.some((fs) => fs.supplierId === supplierId)
          ) {
            this.favoriteSuppliers.push(response.data);
          }
          this.dataService.favoriteSupplierDataSource.next(
            this.favoriteSuppliers
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  isFavorite(supplierId: number): boolean {
    return this.favoriteSuppliers.some((fs) => fs.supplierId === supplierId);
  }

  getSuppliers() {
    const getSupplierParams: GetSuppliersParams = {
      supplierName: this.search,
      supplierCategoryIds: this.supplierCategoryIds,
      province: this.province,
      isFeatured: this.isFeatured,
      averageRating: this.averageRating,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sortAsc: this.sortAsc,
      orderBy: this.orderBy,
    };
    this.supplierService.getSuppliers(getSupplierParams).subscribe({
      next: (response: PaginationResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.supplierList = response.data.items;
          this.pageNumber = response.data.pageNumber;
          this.pageSize = response.data.pageSize;
          this.pageCount = response.data.pageCount;
          this.totalItemCount = response.data.totalItemCount;
          this.isFirstPage = response.data.isFirstPage;
          this.isLastPage = response.data.isLastPage;
          this.hasNextPage = response.data.hasNextPage;
          this.hasPreviousPage = response.data.hasPreviousPage;
          this.dataService.supplierListDataSource.next(this.supplierList);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  getAllFavoriteSupplier(pageNumber: number, pageSize: number) {
    const user = this.localStorage.getDataObject<{ id: string }>(
      'current_user'
    );

    if (!user || !user.id) {
      console.error('User ID not found in local storage.');
      return;
    }
    //Lấy toàn bộ danh sách
    this.favoriteSupplierService
      .getAllFavoriteSupplier(user.id, pageNumber, pageSize)
      .subscribe({
        next: (response: PaginatedFavoriteSupplier) => {
          if (response.success && response.statusCode === StatusCode.OK) {
            if (Array.isArray(response.data)) {
              this.favoriteSuppliers = response.data;
              this.pageNumber = response.data.pageNumber;
              this.pageSize = response.data.pageSize;
              this.totalItemCount = response.data.totalItemCount;
              this.isFirstPage = response.data.isFirstPage;
              this.isLastPage = response.data.isLastPage;
              this.hasNextPage = response.data.hasNextPage;
              this.hasPreviousPage = response.data.hasPreviousPage;
              this.dataService.favoriteSupplierDataSource.next(
                this.favoriteSuppliers
              );
              this.statusService.statusLoadingSpinnerSource.next(false);
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          this.statusService.statusLoadingSpinnerSource.next(false);
          this.notificationService.handleApiError(error);
        },
      });
  }

  openDeleteDialog(id: number): void {
    const dialogRef = this.dialog.open(DeleteCategoryComponent, {
      width: '400px',
      data: {
        id,
        deleteFn: (id: number) =>
          this.favoriteSupplierService.deleteFavoriteSupplier(id),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.favoriteSuppliers.findIndex(
          (supplier) => supplier.supplierId === id
        );
        if (index !== -1) {
          this.favoriteSuppliers.splice(index, 1);

          this.dataService.favoriteSupplierDataSource.next(
            this.favoriteSuppliers
          );
        }
      }
    });
  }

  formatLabel(value: number): string {
    return Utilities.formatVND(value);
  }

  btnChangeGridLayOut(flag: boolean): void {
    this.gridLayout = flag;
  }

  viewSupplierDetail(slug: string): void {
    this.router.navigate(['/suppliers', slug]);
  }

  getCategories() {
    this.categoryService.getAllSupplierCategories().subscribe({
      next: (response: ListSupplierCategoryResponse) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.supplierCategories = response.data;
          this.dataService.supplierCategoryDataSource.next(
            this.supplierCategories
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        this.notificationService.handleApiError(error);
      },
    });
  }

  updateCategorySelection(categoryId: number, isChecked: boolean): void {
    if (isChecked) {
      this.supplierCategoryIds.push(categoryId);
      this.selectedCategories.add(categoryId);
    } else {
      this.supplierCategoryIds = this.supplierCategoryIds.filter(
        (id) => id !== categoryId
      );
      this.selectedCategories.delete(categoryId);
    }

    this.getSuppliers();
    this.updateSelectedFilters();
  }

  updatePriceRange(): void {
    this.getSuppliers();
    this.updateSelectedFilters();
  }

  updateRatingFilter($event: any) {
    this.averageRating = $event.value;
    this.getSuppliers();
    this.updateSelectedFilters();
  }

  changePage(pageNumber: number): void {
    this.pageNumber = pageNumber;
    this.getSuppliers();
    this.updateSelectedFilters();
  }

  updateSelectedFilters() {
    this.selectedFilters = [];

    if (this.search)
      this.selectedFilters.push({
        key: 'search',
        value: `Tìm kiếm: ${this.search}`,
      });
    if (this.province)
      this.selectedFilters.push({ key: 'province', value: this.province });
    if (this.isFeatured)
      this.selectedFilters.push({ key: 'isFeatured', value: 'Nổi bật' });
    if (this.averageRating)
      this.selectedFilters.push({
        key: 'averageRating',
        value: `${this.averageRating} sao`,
      });

    if (this.minPrice && this.maxPrice) {
      this.selectedFilters.push({
        key: 'price',
        value: `${Utilities.formatVND(this.minPrice)} - ${Utilities.formatVND(
          this.maxPrice
        )}`,
      });
    } else if (this.minPrice) {
      this.selectedFilters.push({
        key: 'minPrice',
        value: Utilities.formatVND(this.minPrice),
      });
    } else if (this.maxPrice) {
      this.selectedFilters.push({
        key: 'maxPrice',
        value: Utilities.formatVND(this.maxPrice),
      });
    }

    if (this.supplierCategoryIds.length) {
      this.supplierCategoryIds.forEach((id) => {
        const category = this.supplierCategories.find((cat) => cat.id === id);
        if (category) {
          this.selectedFilters.push({
            key: `category-${id}`,
            value: category.name,
          });
        }
      });
      this.cdr.detectChanges();
    }
  }

  removeFilter(filter: { key: string; value: string }) {
    this.selectedFilters = this.selectedFilters.filter(
      (f) => f.key !== filter.key
    );

    switch (filter.key) {
      case 'search':
        this.search = '';
        this.router.navigate([], {
          queryParams: { q: null },
          queryParamsHandling: 'merge',
        });
        break;
      case 'province':
        this.province = '';
        this.router.navigate([], {
          queryParams: { province: null },
          queryParamsHandling: 'merge',
        });
        break;
      case 'isFeatured':
        this.isFeatured = false;
        break;
      case 'averageRating':
        this.averageRating = 0;
        break;
      case 'minPrice':
        this.minPrice = 0;
        break;
      case 'maxPrice':
        this.maxPrice = 0;
        break;
      case 'price':
        this.minPrice = 0;
        this.maxPrice = 0;
        break;
      default:
        if (filter.key.startsWith('category-')) {
          const categoryId = parseInt(filter.key.split('-')[1], 10);
          this.selectedCategories.delete(categoryId);
          this.cdr.detectChanges();
          this.supplierCategoryIds = this.supplierCategoryIds.filter(
            (id) => id !== categoryId
          );
        }
        break;
    }

    this.getSuppliers();
  }

  clearAllFilters() {
    this.selectedFilters = [];
    this.search = '';
    this.province = '';
    this.isFeatured = false;
    this.averageRating = 0;
    this.minPrice = 0;
    this.maxPrice = 0;
    this.supplierCategoryIds = [];
    this.selectedCategories.clear();
    this.router.navigate([], {
      queryParams: { q: null, province: null },
      queryParamsHandling: 'merge',
    });
    this.getSuppliers();
  }

  toggleFilterMenu() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  /** Map */
  initializeMap() {
    if (!this.map) return; // Đảm bảo this.map đã sẵn sàng

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          if (this.map) {
            this.map.setCenter([userLng, userLat]); // Đặt trung tâm bản đồ về vị trí user
          }

          new Marker({ color: 'blue' })
            .setLngLat([userLng, userLat])
            .setPopup(new Popup().setText('Vị trí của tôi'))
            .addTo(this.map!);
        },
        (error) => {
          console.error('Lỗi lấy vị trí người dùng:', error.message);
        }
      );
    }

    this.addMarkersToMap();
  }

  addMarkersToMap() {
    if (!this.map) return;

    // Xóa tất cả marker cũ trước khi thêm mới
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];

    this.supplierList.forEach((supplier) => {
      if (!supplier.longitude || !supplier.latitude) return; // Bỏ qua nếu không có tọa độ hợp lệ

      const address = `${supplier.street}, ${supplier.ward}, ${supplier.district}, ${supplier.province}`;
      const cardHTML = `
        <img src=${
          supplier?.images?.[0]?.imageUrl || ''
        } class="max-h-[201px] w-full object-cover rounded-t-md" />
        <div class="flex flex-col justify-between">
          <div class="px-4 py-4">
            <h2 class="text-[#3d4750] text-base font-bold truncate mb-2">
              ${supplier?.name || 'Supplier Name'}
            </h2>
            <p class="text-[#3d4750] text-[14px]">${address}</p>
            <div class="flex items-center mt-2">
              <span class="text-[#fabb00] text-xl mb-[4px]">★</span>
              <span class="text-sm mr-1"></span>${supplier?.averageRating || 0}
              <span class="text-[#7d7d7d] text-[12px] ml-2"> (${
                supplier?.totalRating
              } reviews) </span>
            </div>
            <span class="text-sm font-semibold mt-2">
              <span class="font-medium">From: </span> 
              ${(supplier?.price || 0).toLocaleString('vi-VN')}đ
            </span>
          </div>       
        </div>
      `;

      const marker = new Marker({ color: '#FF0000' })
        .setPopup(
          new Popup().setHTML(cardHTML).setMaxWidth('300px').setOffset([0, -40])
        )
        .setLngLat([
          parseFloat(supplier.longitude),
          parseFloat(supplier.latitude),
        ])
        .addTo(this.map!);

      this.markers.push(marker); // Lưu marker vào danh sách để sau này xóa
    });
  }

  btnOpenMap() {
    if (this.openMap) {
      this.closeMap();
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);

    setTimeout(() => {
      this.initializeMap();

      this.openMap = true;
      this.statusService.statusLoadingSpinnerSource.next(false);

      this.cdr.detectChanges();
      this.cdr.markForCheck();
    }, 2000);
  }

  closeMap() {
    this.openMap = false;
  }
  /**End Handle Map */

  getFormattedTime(time: string | undefined): string {
    return time ? time.substring(0, 5) : '';
  }

  openRequestPricingDialog(supplierId: number): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/authentication/signin']);
      this.notificationService.info(
        'Information',
        'Please sign in to continue'
      );
      return;
    }

    const supplier = this.supplierList.find((s) => s.id === supplierId);
    if (!supplier) return;

    const dialogRef = this.dialog.open(RequestPricingDialogComponent, {
      data: supplier,
    });
  }
}
