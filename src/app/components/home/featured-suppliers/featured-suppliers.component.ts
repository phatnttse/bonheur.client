import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import { DataService } from '../../../services/data.service';
import { FavoriteSupplierService } from '../../../services/favorite-supplier.service';
import { BaseResponse } from '../../../models/base.model';
import { FavoriteSupplier } from '../../../models/favorite-supplier.model';
import { StatusCode } from '../../../models/enums.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-featured-suppliers',
  standalone: true,
  imports: [SlickCarouselModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './featured-suppliers.component.html',
  styleUrl: './featured-suppliers.component.scss',
})
export class FeaturedSuppliersComponent {
  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    infinite: true,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          arrow: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          arrow: true,
        },
      },
    ],
  };

  slides = [
    {
      img: 'https://cdn0.hitched.co.uk/vendor/6613/3_2/640/jpg/69-kazooieloki-elsham_4_186613-171649437768041.webp',
      title: 'DoubleTree by Hilton',
      location: 'Nottingham, Nottinghamshire',
      rating: '5.0',
      reviewsCount: 69,
      price: '£64',
      capacity: '35 - 230',
      deals: 4,
      discount: '-3%',
    },
    {
      img: 'https://cdn0.hitched.co.uk/vendor/7933/3_2/640/jpg/the-granary-20170629102543740.webp',
      title: 'The Ritz London',
      location: 'London, England',
      rating: '4.9',
      reviewsCount: 105,
      price: '£120',
      capacity: '50 - 300',
      deals: 6,
      discount: '-5%',
    },
    {
      img: 'https://cdn0.hitched.co.uk/vendor/6089/3_2/640/jpg/the-three-sw-20171006123550431.webp',
      title: 'Hilton Manchester',
      location: 'Manchester, Greater Manchester',
      rating: '4.8',
      reviewsCount: 88,
      price: '£95',
      capacity: '40 - 250',
      deals: 3,
      discount: '-4%',
    },
    {
      img: 'https://cdn0.hitched.co.uk/vendor/9661/3_2/640/jpg/rs-131_4_199661-171137521855127.webp',
      title: 'Radisson Blu Edwardian',
      location: 'Birmingham, West Midlands',
      rating: '4.7',
      reviewsCount: 76,
      price: '£85',
      capacity: '30 - 200',
      deals: 5,
      discount: '-6%',
    },
    {
      img: 'https://cdn0.hitched.co.uk/vendor/8759/3_2/640/jpg/healing-mano-20180712030430539.webp',
      title: 'The Balmoral Edinburgh',
      location: 'Edinburgh, Scotland',
      rating: '4.9',
      reviewsCount: 94,
      price: '£150',
      capacity: '60 - 350',
      deals: 7,
      discount: '-8%',
    },
    {
      img: 'https://cdn0.hitched.co.uk/vendor/2449/3_2/640/jpg/rebeccamatthew-102-portfolio-photographic_4_192449-171603973481749.webp',
      title: 'The Grove Hertfordshire',
      location: 'Hertfordshire, England',
      rating: '4.6',
      reviewsCount: 61,
      price: '£110',
      capacity: '45 - 280',
      deals: 2,
      discount: '-2%',
    },
  ];
}
