import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Gender, StatusCode } from '../../models/enums.model';
import { NotificationService } from '../../services/notification.service';
import { StatusService } from '../../services/status.service';
import { SignUpResponse } from '../../models/account.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  formSignup: FormGroup;
  passwordVisible: boolean = false;
  gender = Gender;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private statusService: StatusService,
    private authService: AuthService
  ) {
    this.formSignup = this.formBuilder.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: ['', [Validators.email, Validators.required]],
      gender: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  btnSignup() {
    if (this.formSignup.invalid) {
      this.formSignup.markAllAsTouched();
      return;
    }

    this.statusService.statusLoadingSpinnerSource.next(true);
    const fullName = this.formSignup.get('fullName')?.value;
    const email = this.formSignup.get('email')?.value;
    const gender = this.formSignup.get('gender')?.value;
    const password = this.formSignup.get('password')?.value;

    this.authService
      .signUpAccount(fullName, email, gender, password)
      .subscribe({
        next: (response: SignUpResponse) => {
          if (response.success && response.statusCode === StatusCode.OK) {
            this.statusService.statusLoadingSpinnerSource.next(false);
            this.notificationService.openSnackBarBottom(
              response.message,
              'Ok',
              0
            );
          }
        },
        error: (error: HttpErrorResponse) => {
          this.statusService.statusLoadingSpinnerSource.next(false);
          // this.notificationService.showToastrHandleError(error);
        },
      });
  }
}
