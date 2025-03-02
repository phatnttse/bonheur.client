import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeago',
  pure: false,
  standalone: true,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) return '';

    const time = new Date(value).getTime();
    const now = new Date().getTime();
    const diffInSeconds = Math.floor((now - time) / 1000);
    const diffInDays = Math.floor(diffInSeconds / 86400); // Chênh lệch ngày

    if (diffInDays >= 1) {
      // Nếu trên 1 ngày, hiển thị định dạng dd/MM/yyyy HH:mm
      const date = new Date(value);
      return `${date.getDate().toString().padStart(2, '0')}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${date.getFullYear()} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;

    return '';
  }
}
