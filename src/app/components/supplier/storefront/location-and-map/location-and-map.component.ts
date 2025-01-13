import { Component } from '@angular/core';
import { Step2Component } from '../../step-2/step-2.component';

@Component({
  selector: 'app-location-and-map',
  standalone: true,
  imports: [Step2Component],
  templateUrl: './location-and-map.component.html',
  styleUrl: './location-and-map.component.scss',
})
export class LocationAndMapComponent {}
