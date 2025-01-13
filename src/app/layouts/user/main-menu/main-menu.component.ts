import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

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
}
