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

    // So sánh ngày của thời điểm hiện tại và thời điểm đầu vào
    const date = new Date(value);
    const nowDate = new Date(now);
    const isSameDay =
      date.getDate() === nowDate.getDate() &&
      date.getMonth() === nowDate.getMonth() &&
      date.getFullYear() === nowDate.getFullYear();

    // Nếu không cùng ngày, hiển thị định dạng dd/MM/yyyy HH:mm
    if (!isSameDay) {
      return `${date.getDate().toString().padStart(2, '0')}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${date.getFullYear()} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    // Nếu cùng ngày
    if (diffInSeconds < 60) return 'Vừa xong'; // Dưới 1 phút
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} phút trước`; // Dưới 1 giờ
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} giờ trước`; // Dưới 24 giờ
    }

    return '';
  }
}
