import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../../../services/location.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  @Input() isSearchBarOpen: boolean = false;
  @Output() toggleSearchBarEvent = new EventEmitter<void>();
  @Input() provinceList: any = [];
  searchValue: string = '';
  filteredProvinces: any = []; // Danh sách tỉnh lọc
  searchProvince: string = '';
  selectedProvince: string = ''; // Tỉnh đã chọn
  isDropdownOpen = false;

  constructor(
    private router: Router,
    private locationService: LocationService
  ) {}

  toggleSearchBar() {
    this.toggleSearchBarEvent.emit();
  }

  closeMenu(event: MouseEvent) {
    event.stopPropagation();
    this.toggleSearchBar();
  }

  onSearchProvince() {
    this.filteredProvinces = this.provinceList.filter((province) =>
      province.provinceName
        .toLowerCase()
        .includes(this.searchProvince.toLowerCase().trim())
    );
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
}
