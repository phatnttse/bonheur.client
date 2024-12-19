import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from '../../material.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FeaturedSuppliersComponent } from './featured-suppliers/featured-suppliers.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TablerIconsModule,
    RouterModule,
    MaterialModule,
    SlickCarouselModule,
    FeaturedSuppliersComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
