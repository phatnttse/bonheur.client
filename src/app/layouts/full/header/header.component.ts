import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from '../../../material.module';
import { Account } from '../../../models/account.model';
import { AuthService } from '../../../services/auth.service';
import { LocalStoreManager } from '../../../services/localstorage-manager.service';
import { DBkeys } from '../../../services/db-keys';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  @Output() toggleSidebarMini = new EventEmitter<void>();

  accountInfo: Account | null = null; // Information about the currently logged in user

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private localStorage: LocalStoreManager,
    private router: Router
  ) {}

  ngOnInit() {
    this.dataService.accountData$.subscribe((account: Account | null) => {
      if (account) {
        this.accountInfo = account;
      } else {
        this.accountInfo = this.localStorage.getDataObject(DBkeys.CURRENT_USER);
      }
    });
  }

  btnLogout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
