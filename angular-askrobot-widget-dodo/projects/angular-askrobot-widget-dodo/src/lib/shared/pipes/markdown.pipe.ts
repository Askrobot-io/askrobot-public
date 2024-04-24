import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { marked } from 'marked';

@Pipe({
    name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {

    constructor(
    ) { }

    public transform(markdown: string): any {
        let html = '';
        if (markdown) {
            html = marked(markdown) as string;
        }
        return html;
    }

}
