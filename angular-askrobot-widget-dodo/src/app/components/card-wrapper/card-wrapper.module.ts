import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CardModule } from 'projects/angular-askrobot-widget-dodo/src/lib/components/card/card.module';

import { DefaultCardComponent } from './components/default-card.component';
import { LightThemeCardComponent } from './components/light-theme.card.component';
import { CustomLinesCardComponent } from './components/custom-lines-card.component';
import { NotExpandableCardComponent } from './components/not-expandable.card.component';

@NgModule({
    declarations: [
        DefaultCardComponent,
        LightThemeCardComponent,
        CustomLinesCardComponent,
        NotExpandableCardComponent,
    ],
    exports: [
        DefaultCardComponent,
        LightThemeCardComponent,
        CustomLinesCardComponent,
        NotExpandableCardComponent,
    ],
    imports: [CommonModule, CardModule]
})

export class CardWrapperModule { }