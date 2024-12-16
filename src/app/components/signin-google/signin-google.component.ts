import { environment } from './../../environments/environment.dev';
import { Component } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from '../../services/auth.service';
import { Account } from '../../models/account.model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { MaterialModule } from '../../material.module';
import { StatusService } from '../../services/status.service';
import { DataService } from '../../services/data.service';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  logoutUrl: 'https://accounts.google.com/logout',
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin + '/authentication/signin-google',
  clientId: environment.googleClientId,
  scope: 'openid profile email',
};

@Component({
  selector: 'app-signin-google',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './signin-google.component.html',
  styleUrl: './signin-google.component.scss',
})
export class SigninGoogleComponent {
  constructor(
    private oauthService: OAuthService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private dataService: DataService,
    private statusService: StatusService
  ) {
    this.oauthService.configure(oAuthConfig);
    this.oauthService.loadDiscoveryDocument().then(() => {
      this.oauthService.tryLoginImplicitFlow().then(() => {
        if (!this.oauthService.hasValidAccessToken()) {
          this.oauthService.initLoginFlow();
        } else {
          this.statusService.statusLoadingSpinnerSource.next(true);
          const idToken = this.oauthService.getIdToken();
          this.authService.loginWithGoogle(idToken).subscribe({
            next: (response: Account) => {
              this.dataService.accountDataSource.next(response);
              this.statusService.statusLoadingSpinnerSource.next(false);
              this.router.navigate(['/']);
              this.notificationService.openSnackBarWelcome(
                'Welcome  ' + response.fullName
              );
            },
            error: (error: HttpErrorResponse) => {
              this.statusService.statusLoadingSpinnerSource.next(false);
              this.router.navigate(['/authentication/signin']);
              // this.notificationService.showToastrHandleError(error);
            },
          });
        }
      });
    });
  }
}
