import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../../material.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tool-sidebar',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './tool-sidebar.component.html',
  styleUrl: './tool-sidebar.component.scss',
})
export class ToolSidebarComponent {
  isFilterOpen: boolean = false;
  minPrice: number = 0;
  maxPrice: number = 10000000;

  toggleFilterMenu() {
    this.isFilterOpen = !this.isFilterOpen;
  }
  formatLabel(value: number): string {
    value = Math.round(value);
    return value.toLocaleString('vi-VN') + 'đ';
  }
}
