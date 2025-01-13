import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from '../user/footer/footer.component';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatProgressSpinnerModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss',
})
export class SupplierComponent {}
