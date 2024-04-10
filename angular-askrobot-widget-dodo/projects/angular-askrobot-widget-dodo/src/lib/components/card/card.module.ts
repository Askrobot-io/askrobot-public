import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TruncatePipe } from './pipes/truncate.pipe';

import { SharedModule } from '../../shared/shared.module';
import { IconsModule } from './components/icons/icons.module';
import { ActionsModule } from './components/actions/actions.module';

import { CardComponent } from './card.component';

@NgModule({
    declarations: [CardComponent, TruncatePipe],
    exports: [CardComponent],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ActionsModule,
        IconsModule
    ],
})
export class CardModule { }