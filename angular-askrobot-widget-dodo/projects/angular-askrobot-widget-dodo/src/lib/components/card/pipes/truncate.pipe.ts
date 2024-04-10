import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, lines: number): string {
    const div = document.createElement('div');
    div.innerHTML = value;
    const linesArray = Array.from(div.childNodes).map(node => node.textContent?.trim());
    const truncatedLines = linesArray.slice(0, lines);
    const remainingLines = linesArray.slice(lines);
    let truncatedText = truncatedLines.join('<br>');
    if (remainingLines.length > 0) {
      truncatedText += '<span class="truncated">...</span>';
    }
    return truncatedText;
  }
}