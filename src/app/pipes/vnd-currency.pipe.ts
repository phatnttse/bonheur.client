import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vndCurrency',
  standalone: true,
})
export class VNDCurrencyPipe implements PipeTransform {
  transform(value: number, withSuffix: boolean = true): string {
    if (isNaN(value)) return '';

    let formattedValue = new Intl.NumberFormat('vi-VN').format(value);
    return withSuffix ? `${formattedValue} đ` : formattedValue;
  }
}
