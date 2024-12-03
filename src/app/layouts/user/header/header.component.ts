import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { animate, style, transition, trigger } from '@angular/animations';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgScrollbarModule, TablerIconsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':increment', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':decrement', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  announcements: string[] = [
    'Free consultation for your dream wedding planning!',
    'Sign up now and get 20% off your first booking!',
    'Exclusive bridal dress collection with special discounts!',
  ];

  currentAnnouncementIndex: number = 0;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.menu-container')) {
      this.isMenuOpen = false;
    }
  }

  ngOnInit() {
    setInterval(() => {
      this.currentAnnouncementIndex =
        (this.currentAnnouncementIndex + 1) % this.announcements.length;
    }, 3000);
  }
}
