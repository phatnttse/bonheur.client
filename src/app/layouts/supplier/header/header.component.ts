import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { RouterModule } from '@angular/router';
import { Account } from '../../../models/account.model';
import { DataService } from '../../../services/data.service';
import { LocalStoreManager } from '../../../services/localstorage-manager.service';
import { DBkeys } from '../../../services/db-keys';
import { Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TablerIconsModule, MatIconModule, MainMenuComponent, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  account: Account | null = null;
  supplier: Supplier | null = null;

  constructor(
    private dataService: DataService,
    private localStorage: LocalStoreManager
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
      }
    });
  }
}
