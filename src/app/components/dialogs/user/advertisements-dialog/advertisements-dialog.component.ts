import { PaginationResponse } from './../../../../models/base.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { AdvertisementService } from '../../../../services/advertisement.service';
import { Advertisement } from '../../../../models/advertisement.model';
import { HttpErrorResponse } from '@angular/common/http';
import { SlickCarouselModule } from 'ngx-slick-carousel';

@Component({
  selector: 'app-advertisements-dialog',
  standalone: true,
  imports: [MaterialModule, CommonModule, SlickCarouselModule],
  templateUrl: './advertisements-dialog.component.html',
  styleUrl: './advertisements-dialog.component.scss',
})
export class AdvertisementsDialogComponent {
  pageNumber: number = 1;
  pageSize: number = 10;
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    infinite: true,
  };

  constructor(
    private dialogRef: MatDialogRef<AdvertisementsDialogComponent>,
    private advertisementService: AdvertisementService,
    @Inject(MAT_DIALOG_DATA) public data: Advertisement[]
  ) {
    // Constructor logic here
  }
}
