import { Component, HostListener, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Router, RouterModule } from '@angular/router';
import { Account } from '../../../models/account.model';
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/data.service';
import { SidebarMobileComponent } from '../sidebar-mobile/sidebar-mobile.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { LocationService } from '../../../services/location.service';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { BaseResponse } from '../../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    TablerIconsModule,
    RouterModule,
    SidebarMobileComponent,
    TopBarComponent,
    MainMenuComponent,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SearchBarComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  @Output() account: Account | null = null;
  valueProvince: any = [];
  @Output() provinceList: any = []; // Danh sách tỉnh
  selectedProvince: string = ''; // Tỉnh đã chọn
  isDropdownOpen = false;
  searchValue: string = '';
  searchProvince: string = '';
  filteredProvinces: any = []; // Danh sách tỉnh lọc
  messageUnreadCount: number = 0;
  isSidebarOpen = false;
  searchQuery: string = '';
  isSearchBarOpen = false;

  menuItems = [
    { name: 'Home' },
    { name: 'Suppliers' },
    { name: 'Planning Tools' },
    { name: 'About Us' },
    { name: 'Contact' },
  ];

  get filteredResults() {
    return this.menuItems.filter((item) =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleSearchBar() {
    this.isSearchBarOpen = !this.isSearchBarOpen;
  }

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private locationService: LocationService,
    private messageService: MessageService
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onSearchProvince() {
    this.filteredProvinces = this.provinceList.filter((province) =>
      province.provinceName
        .toLowerCase()
        .includes(this.searchProvince.toLowerCase().trim())
    );
  }

  ngOnInit(): void {
    this.dataService.accountData$.subscribe((account: Account | null) => {
      if (account) {
        this.account = account;
      } else if (this.authService.isLoggedIn) {
        this.account = this.authService.currentUser;
      }
    });

    this.dataService.provinceData$.subscribe((province: any | null) => {
      if (province) {
        this.valueProvince = province;
        this.getDetailProvinces();
      } else {
        this.getProvinces();
      }
    });

    this.dataService.messageUnreadCountUserData$.subscribe(
      (count: number | null) => {
        if (count) {
          this.messageUnreadCount = count;
        } else {
          this.getUnreadMessagesCountByUser();
        }
      }
    );
  }

  btnLogout() {
    this.authService.logout();
    this.dataService.resetData();
    this.router.navigate(['/authentication/signin']);
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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectProvince(province: string) {
    this.selectedProvince = province;
    this.isDropdownOpen = false;
    this.router.navigate(['/suppliers'], {
      queryParams: { province: this.selectedProvince },
    });
  }

  onSearch() {
    this.searchValue = this.searchValue.trim();
    if (this.searchValue === '') {
      return;
    }
    this.router.navigate(['/suppliers'], {
      queryParams: { q: this.searchValue },
    });
  }

  getDetailProvinces() {
    let setProvinces = new Set();
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

  getUnreadMessagesCountByUser() {
    this.messageService.getUnreadMessagesCountByUser().subscribe({
      next: (response: BaseResponse<number>) => {
        this.dataService.messageUnreadCountUserDataSource.next(response.data);
        this.messageUnreadCount = response.data;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
    });
  }
}
