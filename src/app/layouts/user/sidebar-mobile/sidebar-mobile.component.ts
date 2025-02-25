import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Account } from '../../../models/account.model';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/data.service';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Role } from '../../../models/enums.model';

@Component({
  selector: 'app-sidebar-mobile',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, TablerIconsModule],
  templateUrl: './sidebar-mobile.component.html',
  styleUrl: './sidebar-mobile.component.scss',
})
export class SidebarMobileComponent {
  @Input() isMenuOpen: boolean = false;
  @Output() toggleMenuEvent = new EventEmitter<void>();
  @Input() account: Account | null = null;
  @Input() messageUnreadCount: number = 0;
  role = Role;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMenu() {
    this.toggleMenuEvent.emit();
  }

  closeMenu(event: MouseEvent) {
    event.stopPropagation();
    this.toggleMenu();
  }

  btnLogout() {
    this.authService.logout();
    this.dataService.resetData();
    this.router.navigate(['/authentication/signin']);
  }
}
