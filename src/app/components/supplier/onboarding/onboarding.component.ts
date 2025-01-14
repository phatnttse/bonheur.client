import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Supplier } from '../../../models/supplier.model';
import { OnBoardStatus } from '../../../models/enums.model';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent implements OnInit {
  supplier: Supplier | null = null;
  onBoardStatus: typeof OnBoardStatus = OnBoardStatus;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.supplierData$.subscribe((supplier: Supplier | null) => {
      if (supplier != null) {
        this.supplier = supplier;
      }
    });
  }
}
