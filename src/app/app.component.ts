import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material.module';
import { StatusService } from './services/status.service';
import AOS from 'aos';
import { ScrollToTopComponent } from './layouts/scroll-to-top/scroll-to-top.component';
import { ToastrComponent } from './components/toastr/toastr.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdvertisementService } from './services/advertisement.service';
import { MatDialog } from '@angular/material/dialog';
import { Advertisement } from './models/advertisement.model';
import { PaginationResponse } from './models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AdvertisementsDialogComponent } from './components/dialogs/user/advertisements-dialog/advertisements-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MaterialModule,
    ScrollToTopComponent,
    ToastrComponent,
    FontAwesomeModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Bonheur';
  isLoading: boolean = false; // Indicates whether the application is loading data
  showScrollButton = false; // Indicates whether the scroll button should be displayed
  advertisementList: Advertisement[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;

  constructor(
    public statusService: StatusService,
    private advertisementService: AdvertisementService,
    private dialog: MatDialog
  ) {
    this.statusService.statusLoadingSpinner$.subscribe((isLoading: boolean) => {
      this.isLoading = isLoading;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;
    this.showScrollButton = scrollPosition > 10;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  ngOnInit() {
    AOS.init();
    this.getAdvertisements();
  }

  ngAfterViewInit(): void {
    this.showDialogInSequence();
  }

  getAdvertisements() {
    this.advertisementService
      .getActiveAdvertisements(this.pageNumber, this.pageSize)
      .subscribe({
        next: (response: PaginationResponse<Advertisement>) => {
          this.advertisementList = response.data.items;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching advertisements:', error);
        },
      });
  }

  showDialogInSequence() {
    setTimeout(() => {
      this.openAdvertisementsDialog();

      setTimeout(() => {
        this.openAdvertisementsDialog();

        setTimeout(() => {
          this.openAdvertisementsDialog();
        }, 180000); // 3 phút sau lần 2
      }, 60000); // 1 phút sau lần 2
    }, 3000);
  }

  openAdvertisementsDialog() {
    this.dialog.open(AdvertisementsDialogComponent, {
      data: this.advertisementList,
    });
  }
}
