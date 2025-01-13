import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
