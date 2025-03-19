import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { DataService } from '../../../../services/data.service';
import { Supplier } from '../../../../models/supplier.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  title: string;
  icon: string;
  count?: number;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MaterialModule, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    const menuItems: MenuItem[] = [
      {
        title: 'Gói đăng ký',
        icon: 'growth.svg',
        route: '/supplier/packages/subscriptions',
      },
      {
        title: 'Gói quảng cáo',
        icon: 'megaphone.svg',
        route: '/supplier/packages/advertisements',
      },
    ];
    this.menuItems = menuItems;
  }
}
