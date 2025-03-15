import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  constructor(private meta: Meta, private title: Title) {
    this.title.setTitle('Bonheur - Nền tảng dịch vụ cưới hỏi chuyên nghiệp');

    this.meta.addTags([
      {
        name: 'description',
        content:
          'Bonheur - Nền tảng giúp bạn tìm kiếm, xem hồ sơ nhà cung cấp dịch vụ cưới, xem vị trí trên bản đồ, yêu cầu báo giá và trò chuyện trực tiếp với nhà cung cấp.',
      },
      {
        name: 'keywords',
        content:
          'dịch vụ cưới, tổ chức tiệc cưới, wedding planner, nhà cung cấp dịch vụ cưới, báo giá cưới hỏi, Bonheur, wedding service, wedding vendor, wedding quotation, wedding planner, wedding, bonheur wedding, bonheur pro, bonheur wedding pro',
      },
      {
        property: 'og:title',
        content: 'Bonheur - Dịch vụ cưới hỏi chuyên nghiệp',
      },
      {
        property: 'og:description',
        content:
          'Tìm kiếm nhà cung cấp dịch vụ cưới, xem vị trí, yêu cầu báo giá và trò chuyện với nhà cung cấp trên nền tảng Bonheur.',
      },
      {
        property: 'og:image',
        content: 'https://bonheur.pro/assets/images/backgrounds/about-1.webp',
      },
      { property: 'og:url', content: 'https://bonheur.pro/about' },
    ]);
  }
}
