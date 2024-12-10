import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SupplierCategory } from '../../../../models/category.model';

@Component({
  selector: 'app-supplier-request-pricing-management',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatTooltipModule,
    CommonModule,
    MatPaginator,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    TranslateModule],
  templateUrl: './supplier-request-pricing-management.component.html',
  styleUrl: './supplier-request-pricing-management.component.scss'
})
export class SupplierRequestPricingManagementComponent {
  @ViewChild(MatSort) sort!: MatSort;
  supplierCategories : SupplierCategory[] = [];
  dataSource: MatTableDataSource<SupplierCategory> =
  new MatTableDataSource<SupplierCategory>();
  displayedColumns: string[] = ['id','name', 'description', 'action'];
  statusPage: number = 0; 
  selectedCategory: SupplierCategory | null = null;
  categoryForm: FormGroup; 

  constructor(
    private fb: FormBuilder,
  ){
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]], 
      description: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(200)]],
    });
  }
}
