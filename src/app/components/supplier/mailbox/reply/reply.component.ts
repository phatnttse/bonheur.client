import { Component, OnInit } from '@angular/core';
import { ReplyChatWindowComponent } from './reply-chat-window/reply-chat-window.component';
import { ReplyUserInfoComponent } from './reply-user-info/reply-user-info.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RequestPricingService } from '../../../../services/request-pricing.service';
import {
  RequestPricing,
  RequestPricingResponse,
} from '../../../../models/request-pricing.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reply',
  standalone: true,
  imports: [ReplyChatWindowComponent, ReplyUserInfoComponent, RouterModule],
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.scss',
})
export class ReplyComponent implements OnInit {
  userId: string = '';
  requestPricing: RequestPricing | null = null;
  constructor(
    private route: ActivatedRoute,
    private requestPricingService: RequestPricingService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const requestPricingId = params['rqp'];
      if (requestPricingId) {
        this.getRequestPricingById(requestPricingId);
      }
    });
  }

  getRequestPricingById(requestPricingId: number): void {
    this.requestPricingService
      .getRequestPricingById(requestPricingId)
      .subscribe({
        next: (response: RequestPricingResponse) => {
          this.requestPricing = response.data;
          this.userId = response.data?.user?.id || '';
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error:', error);
        },
      });
  }
}
