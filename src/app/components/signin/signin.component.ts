import { MaterialModule } from './../../material.module';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private router: Router, private formBuilder: FormBuilder) {
    this.formSignin = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
    });
  }

  submit() {}
}
