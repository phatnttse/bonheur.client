import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Supplier } from '../../models/supplier.model';
import { SupplierService } from '../../services/supplier.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AverageScores, BaseResponse } from '../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { StatusCode, SupplierStatus } from '../../models/enums.model';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DataService } from '../../services/data.service';
import { StatusService } from '../../services/status.service';
import { VNDCurrencyPipe } from '../../pipes/vnd-currency.pipe';
import { config, Map, MapStyle, Marker, Popup } from '@maptiler/sdk';
import { environment } from '../../environments/environment.dev';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { GalleryModule, Gallery, GalleryItem, GalleryRef } from 'ng-gallery';
import { Lightbox, LightboxModule } from 'ng-gallery/lightbox';
import { MatDialog } from '@angular/material/dialog';
import { RequestPricingDialogComponent } from '../dialogs/user/request-pricing-dialog/request-pricing-dialog.component';
import { AuthService } from '../../services/auth.service';
import { ReviewService } from '../../services/review.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier-detail',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    VNDCurrencyPipe,
    SlickCarouselModule,
    RouterModule,
    GalleryModule,
    CommonModule,
  ],
  templateUrl: './supplier-detail.component.html',
  styleUrl: './supplier-detail.component.scss',
})
export class SupplierDetailComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  map: Map | undefined; // Bản đồ
  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>; // Container bản đồ
  supplier: Supplier | null = null;
  relatedSuppliers: Supplier[] = [];
  galleryId = 'myLightbox';
  galleryItems!: GalleryItem[];
  averageScores: AverageScores | null = null;
  galleryRef!: GalleryRef;

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private dataService: DataService,
    private statusService: StatusService,
    public gallery: Gallery,
    private lightbox: Lightbox,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    config.apiKey = environment.mapTilerApiKey;

    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      if (slug) {
        this.getSupplierBySlug(slug);
      }
    });
  }

  initializeGallery() {
    this.galleryRef = this.gallery.ref(this.galleryId);
  }

  openInFullScreen(index: number, type: string) {
    if (type === 'photos') {
      this.galleryRef.reset();
      this.supplier?.images?.forEach((image) => {
        this.galleryRef.addImage({
          src: image.imageUrl || '',
          thumb: image.imageUrl || '',
        });
      });
      this.galleryRef.load(this.galleryItems);
    } else {
      this.galleryRef.reset();
      this.supplier?.videos?.forEach((video) => {
        this.galleryRef.addVideo({
          src: video.url || '',
          controls: true,
        });
      });
      this.galleryRef.load(this.galleryItems);
    }

    this.lightbox.open(index, this.galleryId, {
      panelClass: 'fullscreen',
      hasBackdrop: true,
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

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  getSupplierBySlug(slug: string): void {
    this.supplierService.getSupplierBySlug(slug).subscribe({
      next: (response: BaseResponse<Supplier>) => {
        if (response.success && response.statusCode === StatusCode.OK) {
          this.supplier = response.data;
          this.getAverageScore();
          this.initializeGallery();
          setTimeout(() => {
            this.initializeMap();
          }, 1000);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }

  initializeMap() {
    if (!this.map) return; // Đảm bảo this.map đã sẵn sàng

    const address = `${this.supplier?.street + ',' || ''} ${
      this.supplier?.ward || ''
    }, ${this.supplier?.district || ''}, ${this.supplier?.province || ''}`;
    const cardHTML = `
            <img src=${
              this.supplier?.images?.[0]?.imageUrl || ''
            } class="max-h-[201px] w-full object-cover rounded-t-md" />
            <div class="flex flex-col justify-between">
              <div class="px-4 py-4">
                <h2 class="text-[#3d4750] text-base font-bold truncate mb-2">
                  ${this.supplier?.name || 'Supplier Name'}
                </h2>
                <p class="text-[#3d4750] text-[14px]">${address}</p>
                <div class="flex items-center mt-2">
                  <span class="text-[#fabb00] text-xl mb-[4px]">★</span>
                  <span class="text-sm mr-1"></span>${
                    this.supplier?.averageRating.toFixed(1) || 0
                  }
                  <span class="text-[#7d7d7d] text-[12px] ml-2"> (${
                    this.supplier?.totalRating
                  } reviews) </span>
                </div>
                <span class="text-sm font-semibold mt-2">
                  <span class="font-medium">From: </span> 
                  ${(this.supplier?.price || 0).toLocaleString('vi-VN')}đ
                </span>
              </div>       
            </div>
          `;

    new Marker({ color: '#FF0000' })
      .setPopup(
        new Popup().setHTML(cardHTML).setMaxWidth('300px').setOffset([0, -40])
      )
      .setLngLat([
        parseFloat(this.supplier?.longitude || '0'),
        parseFloat(this.supplier?.latitude || '0'),
      ])
      .addTo(this.map!);
  }

  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    infinite: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          arrow: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          arrow: true,
        },
      },
    ],
  };

  getFormattedTime(time: string | undefined): string {
    return time ? time.substring(0, 5) : '';
  }

  openRequestPricingDialog() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/authentication/signin']);
      this.notificationService.info(
        'Information',
        'Please sign in to continue'
      );
      return;
    }

    this.dialog.open(RequestPricingDialogComponent, {
      data: this.supplier,
    });
  }

  getAverageScore() {
    this.reviewService.getAverageRating(this.supplier?.id || 0).subscribe({
      next: (response: any) => {
        this.averageScores = response.data.averageScores;
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.handleApiError(error);
      },
    });
  }
}
