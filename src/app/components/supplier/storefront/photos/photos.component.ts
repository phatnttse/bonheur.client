import { Component } from '@angular/core';
import { Step3Component } from '../../step-3/step-3.component';

@Component({
  selector: 'app-photos',
  standalone: true,
  imports: [Step3Component],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.scss',
})
export class PhotosComponent {}
