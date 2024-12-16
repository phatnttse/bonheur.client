import { MaterialModule } from './../../material.module';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Account } from '../../models/account.model';
import { NotificationService } from '../../services/notification.service';
import { StatusService } from '../../services/status.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  formSignin: FormGroup;
  passwordVisible: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private dataService: DataService,
    private statusService: StatusService
  ) {
    this.formSignin = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
    });
  }

  btnLogin() {
    if (this.formSignin.invalid) {
      this.formSignin.markAllAsTouched();
      return;
    }
    this.statusService.statusLoadingSpinnerSource.next(true);
    const email = this.formSignin.get('email')?.value;
    const password = this.formSignin.get('password')?.value;

    this.authService.loginWithPassword(email, password).subscribe({
      next: (response: Account) => {
        this.dataService.accountDataSource.next(response);
        this.statusService.statusLoadingSpinnerSource.next(false);
        if (this.authService.isAdmin) {
          this.router.navigate(['/admin']);
        } else if (this.authService.isSupplier) {
          this.router.navigate(['/supplier']);
        } else {
          this.router.navigate(['/']);
        }
        this.notificationService.openSnackBarWelcome(
          'Welcome  ' + response.fullName
        );
      },
      error: (error: HttpErrorResponse) => {
        this.statusService.statusLoadingSpinnerSource.next(false);
        // this.notificationService.showToastrHandleError(error);
      },
    });
  }
}
