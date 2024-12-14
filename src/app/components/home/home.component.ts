import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TablerIconsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
