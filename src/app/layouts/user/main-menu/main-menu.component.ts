import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { DataService } from '../../../services/data.service';
import { CategoryService } from '../../../services/category.service';
import {
  ListSupplierCategoryResponse,
  SupplierCategory,
} from '../../../models/category.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Account } from '../../../models/account.model';
import { Role } from '../../../models/enums.model';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent implements OnInit {
  categories: SupplierCategory[] = [];
  account: Account | null = null;
  role = Role;

  constructor(
    private router: Router,
    public authService: AuthService,
    private notificationService: NotificationService,
    private dataService: DataService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.dataService.supplierCategoryData$.subscribe(
      (data: SupplierCategory[] | null) => {
        if (data?.values) {
          this.categories = data;
        } else {
          this.getCategories();
        }
      }
    );

    this.dataService.accountData$.subscribe((data: Account | null) => {
      if (data) {
        this.account = data;
      } else {
        this.account = this.authService.currentUser;
      }
    });
  }

  goToRegisterSupplier() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['authentication/signin']);
      this.notificationService.openSnackBarTop(
        'You need to log in to become a supplier',
        'OK',
        0
      );
    } else {
      this.router.navigate(['supplier/signup']);
    }
  }

  getCategories() {
    this.categoryService.getAllSupplierCategories().subscribe({
      next: (response: ListSupplierCategoryResponse) => {
        this.categories = response.data;
        this.dataService.supplierCategoryDataSource.next(this.categories);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }
}
