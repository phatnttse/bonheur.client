import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

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

  toggleMenu() {
    this.toggleMenuEvent.emit();
  }

  closeMenu(event: MouseEvent) {
    event.stopPropagation();
    this.toggleMenu();
  }
}
