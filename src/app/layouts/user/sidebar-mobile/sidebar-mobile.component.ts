import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-sidebar-mobile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-mobile.component.html',
  styleUrl: './sidebar-mobile.component.scss',
})
export class SidebarMobileComponent {
  @Input() isMenuOpen: boolean = false;
  @Output() toggleMenuEvent = new EventEmitter<void>();
  @Input() account: Account | null = null;

  toggleMenu() {
    this.toggleMenuEvent.emit();
  }

  closeMenu(event: MouseEvent) {
    event.stopPropagation();
    this.toggleMenu();
  }
}
