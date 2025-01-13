import { Component, Output } from '@angular/core';
import { Step1Component } from '../../step-1/step-1.component';

@Component({
  selector: 'app-business-detail',
  standalone: true,
  imports: [Step1Component],
  templateUrl: './business-detail.component.html',
  styleUrl: './business-detail.component.scss',
})
export class BusinessDetailComponent {}
