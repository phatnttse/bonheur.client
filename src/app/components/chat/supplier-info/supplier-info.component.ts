import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { RouterModule } from '@angular/router';
import { VNDCurrencyPipe } from '../../../pipes/vnd-currency.pipe';
import { OnlineUser } from '../../../models/chat.model';
import { Supplier } from '../../../models/supplier.model';

@Component({
  selector: 'app-supplier-info',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, RouterModule, VNDCurrencyPipe],
  templateUrl: './supplier-info.component.html',
  styleUrl: './supplier-info.component.scss',
})
export class SupplierInfoComponent {
  @Input() selectedUser: OnlineUser | null = null; // Selected user to send message to
  @Input() supplier: Supplier | null = null;

  constructor() {}
}
