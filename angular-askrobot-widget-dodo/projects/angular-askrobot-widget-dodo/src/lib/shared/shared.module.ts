import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SanitiserPipe } from './pipes/sanitiser.pipe';
import { MarkdownPipe } from './pipes/markdown.pipe';

@NgModule({
    declarations: [SanitiserPipe, MarkdownPipe],
    exports: [SanitiserPipe, MarkdownPipe],
    imports: [CommonModule]
})

export class SharedModule { }