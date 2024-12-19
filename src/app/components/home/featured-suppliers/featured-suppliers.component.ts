import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { SlickCarouselModule } from 'ngx-slick-carousel';

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
      img: 'https://via.placeholder.com/300x200?text=Vendor+1',
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
      img: 'https://via.placeholder.com/300x200?text=Vendor+2',
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
      img: 'https://via.placeholder.com/300x200?text=Vendor+3',
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
      img: 'https://via.placeholder.com/300x200?text=Vendor+4',
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
      img: 'https://via.placeholder.com/300x200?text=Vendor+5',
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
      img: 'https://via.placeholder.com/300x200?text=Vendor+6',
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
