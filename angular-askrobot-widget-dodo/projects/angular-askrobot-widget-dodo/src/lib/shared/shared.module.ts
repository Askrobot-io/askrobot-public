import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SanitiserPipe } from './pipes/sanitiser.pipe';

@NgModule({
    declarations: [SanitiserPipe],
    exports: [SanitiserPipe],
    imports: [CommonModule]
})

export class SharedModule { }