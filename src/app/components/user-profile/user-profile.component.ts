import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  backgroundColor = '#fdf1ed'; // Màu nền
}
