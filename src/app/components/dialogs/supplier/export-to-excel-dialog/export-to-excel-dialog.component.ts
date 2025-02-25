import { Component } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-export-to-excel-dialog',
  standalone: true,
  imports: [MaterialModule, RouterModule],
  templateUrl: './export-to-excel-dialog.component.html',
  styleUrl: './export-to-excel-dialog.component.scss',
})
export class ExportToExcelDialogComponent {}
