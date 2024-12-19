import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [TablerIconsModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':increment', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':decrement', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class TopBarComponent {
  announcements: string[] = [
    'Free consultation for your dream wedding planning!',
    'Sign up now and get 20% off your first booking!',
    'Exclusive bridal dress collection with special discounts!',
  ];
  currentAnnouncementIndex: number = 0;

  ngOnInit() {
    setInterval(() => {
      this.currentAnnouncementIndex =
        (this.currentAnnouncementIndex + 1) % this.announcements.length;
    }, 3000);
  }
}
