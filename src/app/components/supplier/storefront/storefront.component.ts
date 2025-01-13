import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-storefront',
  standalone: true,
  imports: [MaterialModule, SidebarComponent, RouterOutlet],
  templateUrl: './storefront.component.html',
  styleUrl: './storefront.component.scss',
})
export class StorefrontComponent {}
