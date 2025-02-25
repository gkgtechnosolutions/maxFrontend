import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcToLocal'
})
export class UtcToLocalPipe implements PipeTransform {
  transform(utcTimeStr: string): string {
    if (!utcTimeStr) return '';
  
    if (!utcTimeStr.endsWith('Z')) {
      utcTimeStr += 'Z';
    }
  
    const utcDate = new Date(utcTimeStr);
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = new Date(utcDate.toLocaleString('en-US', { timeZone: localTimezone }));
  
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    let hours = localDate.getHours();
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    const seconds = String(localDate.getSeconds()).padStart(2, '0');
  
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  
    return ` ${hours}:${minutes} ${period}`;
  }
}
