import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../../../services/location.service';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, MaterialModule, TablerIconsModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
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

  ngOnInit(): void {
    this.filteredProvinces = this.provinceList;
  }

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
