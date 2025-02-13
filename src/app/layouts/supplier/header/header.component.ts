import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { Router, RouterModule } from '@angular/router';
import { Account } from '../../../models/account.model';
import { DataService } from '../../../services/data.service';
import { LocalStoreManager } from '../../../services/localstorage-manager.service';
import { DBkeys } from '../../../services/db-keys';
import { Supplier } from '../../../models/supplier.model';
import { MaterialModule } from '../../../material.module';
import { AuthService } from '../../../services/auth.service';
import { SidebarMobileComponent } from '../sidebar-mobile/sidebar-mobile.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    TablerIconsModule,
    MainMenuComponent,
    RouterModule,
    MaterialModule,
    SidebarMobileComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  account: Account | null = null;
  supplier: Supplier | null = null;
  isMenuOpen = false;
  primaryImage: string = '';

  constructor(
    private dataService: DataService,
    private localStorage: LocalStoreManager,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataService.accountData$.subscribe((account: Account | null) => {
      if (account) {
        this.account = account;
      } else {
        this.account = this.localStorage.getDataObject(DBkeys.CURRENT_USER);
      }
    });

    this.dataService.supplierData$.subscribe((supplier: Supplier | null) => {
      if (supplier) {
        this.supplier = supplier;
        if (this.supplier.images) {
          this.supplier.images.forEach((image) => {
            if (image.isPrimary) {
              this.primaryImage = image.imageUrl ?? '';
            }
          });
        }
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.dataService.resetData();
    this.router.navigate(['/authentication/signin']);
  }
}
