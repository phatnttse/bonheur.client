import { Component, Input } from '@angular/core';
import { RequestPricing } from '../../../../../models/request-pricing.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reply-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reply-user-info.component.html',
  styleUrl: './reply-user-info.component.scss',
})
export class ReplyUserInfoComponent {
  @Input() requestPricing: RequestPricing | null = null;
}
