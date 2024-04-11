import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ActionsComponent } from './actions.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
    declarations: [ActionsComponent],
    exports: [ActionsComponent],
    imports: [CommonModule, SharedModule]
})
export class ActionsModule { }