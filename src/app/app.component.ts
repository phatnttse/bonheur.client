import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material.module';
import { StatusService } from './services/status.service';
import AOS from 'aos';
import { ScrollToTopComponent } from './layouts/scroll-to-top/scroll-to-top.component';
import { ToastrComponent } from './components/toastr/toastr.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

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
export class AppComponent implements OnInit {
  title = 'Bonheur';
  isLoading: boolean = false; // Indicates whether the application is loading data
  showScrollButton = false; // Indicates whether the scroll button should be displayed

  constructor(public statusService: StatusService) {
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
  }
}
