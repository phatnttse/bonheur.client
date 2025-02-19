import { Component } from '@angular/core';
import { MaterialModule } from '../../../../material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-hitched-rated',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule],
  templateUrl: './hitched-rated.component.html',
  styleUrl: './hitched-rated.component.scss',
})
export class HitchedRatedComponent {}
