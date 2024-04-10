import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'sanitiser',
})
export class SanitiserPipe implements PipeTransform {

    constructor(
        private readonly sanitizer: DomSanitizer
    ) { }

    public transform(value: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(value);
    }

}
