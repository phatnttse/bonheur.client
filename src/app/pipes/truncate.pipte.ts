import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string,
    limit: number = 50,
    completeWords: boolean = false,
    ellipsis: string = '...'
  ): string {
    if (!value) return '';

    if (value.length <= limit) return value;

    if (completeWords) {
      let lastSpace = value.substring(0, limit).lastIndexOf(' ');
      return value.substring(0, lastSpace) + ellipsis;
    }

    return value.substring(0, limit) + ellipsis;
  }
}
