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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BaseResponse } from '../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { StatusCode } from '../../models/enums.model';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DataService } from '../../services/data.service';
import { StatusService } from '../../services/status.service';
import { VNDCurrencyPipe } from '../../pipes/vnd-currency.pipe';
import { config, Map, MapStyle, Marker, Popup } from '@maptiler/sdk';
import { environment } from '../../environments/environment.dev';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { GalleryModule, Gallery, GalleryItem } from 'ng-gallery';
import { Lightbox, LightboxModule } from 'ng-gallery/lightbox';

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

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private dataService: DataService,
    private statusService: StatusService,
    public gallery: Gallery,
    private lightbox: Lightbox
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
    const galleryRef = this.gallery.ref(this.galleryId);
    this.supplier?.images?.forEach((image) => {
      galleryRef.addImage({
        src: image.imageUrl || '',
        thumb: image.imageUrl || '',
      });
    });
    galleryRef.load(this.galleryItems);
  }

  openInFullScreen(index: number) {
    this.lightbox.open(index, this.galleryId, {
      panelClass: 'fullscreen',
      hasBackdrop: true,
    });
  }

  ngAfterViewInit() {
    // // HCM
    // const initialState = {
    //   lng: 106.629662,
    //   lat: 10.823099,
    //   zoom: 10,
    // };
    // this.map = new Map({
    //   container: this.mapContainer.nativeElement,
    //   style: MapStyle.STREETS,
    //   center: [initialState.lng, initialState.lat],
    //   zoom: initialState.zoom,
    // });
    // setTimeout(() => {
    //   this.map?.resize();
    // }, 0);
    // window.addEventListener('resize', () => {
    //   if (this.map) {
    //     this.map.resize();
    //   }
    // });
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
          this.initializeGallery();
          // setTimeout(() => {
          //   this.initializeMap();
          // }, 1000);
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
                    this.supplier?.averageRating || 0
                  }
                  <span class="text-[#7d7d7d] text-[12px] ml-2"> (0 reviews) </span>
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
}
