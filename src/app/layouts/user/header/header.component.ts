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
import { SidebarMobileComponent } from '../sidebar-mobile/sidebar-mobile.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { ToolSidebarComponent } from '../../../components/suppliers/tool-sidebar/tool-sidebar.component';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    TablerIconsModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    SidebarMobileComponent,
    TopBarComponent,
    MainMenuComponent,
    ToolSidebarComponent,
    MatBadgeModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  account: Account | null = null;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit(): void {
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
