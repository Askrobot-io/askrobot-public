import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CardModule } from 'projects/angular-askrobot-widget-dodo/src/lib/components/card/card.module';

import { DefaultCardComponent } from './components/default-card.component';
import { LoadingCardComponent } from './components/loading-card.component';
import { LightThemeCardComponent } from './components/light-theme.card.component';
import { NoStatusCardComponent } from './components/no-status.card.component';
import { CustomStyleStatusCardComponent } from './components/custom-style-status.card.component';
import { WarningCardComponent } from './components/warning.card.component';
import { CustomLinesCardComponent } from './components/custom-lines-card.component';
import { NotExpandableCardComponent } from './components/not-expandable.card.component';
import { ShowSearchCardComponent } from './components/show-search-card.component';
import { ShowBothActionsCardComponent } from './components/show-both-actions.card.component';
import { ShowRatingCardComponent } from './components/show-rating-card.component';

@NgModule({
    declarations: [
        DefaultCardComponent,
        LoadingCardComponent,
        LightThemeCardComponent,
        NoStatusCardComponent,
        CustomStyleStatusCardComponent,
        WarningCardComponent,
        CustomLinesCardComponent,
        NotExpandableCardComponent,
        ShowSearchCardComponent,
        ShowRatingCardComponent,
        ShowBothActionsCardComponent
    ],
    exports: [
        DefaultCardComponent,
        LoadingCardComponent,
        LightThemeCardComponent,
        NoStatusCardComponent,
        CustomStyleStatusCardComponent,
        WarningCardComponent,
        CustomLinesCardComponent,
        NotExpandableCardComponent,
        ShowSearchCardComponent,
        ShowRatingCardComponent,
        ShowBothActionsCardComponent
    ],
    imports: [CommonModule, CardModule]
})

export class CardWrapperModule { }