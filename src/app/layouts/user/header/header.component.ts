import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { animate, style, transition, trigger } from '@angular/animations';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Account } from '../../../models/account.model';
import { AuthService } from '../../../services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
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
  account: Account | null = null;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

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

    this.dataService.accountData$.subscribe((account: Account | null) => {
      if (account) {
        this.account = account;
      } else if (this.authService.isLoggedIn) {
        this.account = this.authService.currentUser;
      }
    });
  }

  btnLogout() {
    this.authService.logout();
    this.dataService.resetData();
    this.router.navigate(['/authentication/signin']);
  }
}
