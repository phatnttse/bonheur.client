import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MaterialModule,
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    NgScrollbarModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {}
