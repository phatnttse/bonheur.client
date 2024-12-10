import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatSort } from '@angular/material/sort';
import { SupplierCategory } from '../../../models/category.model';
import { NotificationService } from '../../../services/notification.service';
import { StatusService } from '../../../services/status.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-request-pricing-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MaterialModule,
    TablerIconsModule,
  ],
  templateUrl: './request-pricing-management.component.html',
  styleUrl: './request-pricing-management.component.scss'
})
export class RequestPricingManagementComponent {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<SupplierCategory> =
  new MatTableDataSource<SupplierCategory>();
  displayedColumns: string[] = ['id','name', 'description', 'action'];
  statusPage: number = 0;
  requestPricingForm : FormGroup;

  constructor(
    private notificationService: NotificationService,
    private statusService: StatusService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialog: MatDialog
  ){
    this.requestPricingForm = this.fb.group({
    });
  }


   // Thay đổi trạng thái của trang
   btnChangeStatusPage(status: number) {
    this.statusPage = status;
  }

}
