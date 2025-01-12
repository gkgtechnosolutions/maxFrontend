import { MatPaginatorIntl } from '@angular/material/paginator';

export class CustomMatPaginatorIntl extends MatPaginatorIntl {
 override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
        return `Page 1 of 1`;
      }
      const totalPages = Math.ceil(length / pageSize);
      return `Page ${page + 1} of ${totalPages}`;
    
  }
}