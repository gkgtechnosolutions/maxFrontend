import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'lineBreaks',
})
export class LineBreaksPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return value || '';

    let html = value
      // Bold: *text* -> <strong>text</strong>
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      // Italic: _text_ -> <em>text</em>
      .replace(/_(.*?)_/g, '<em>$1</em>')
      // Strikethrough: ~text~ -> <del>text</del>
      .replace(/~(.*?)~/g, '<del>$1</del>')
      // Line breaks: \n -> <br>
      .replace(/\n/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}