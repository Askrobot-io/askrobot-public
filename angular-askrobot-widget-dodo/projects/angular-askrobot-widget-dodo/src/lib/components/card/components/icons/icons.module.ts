import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ArrowDownIconComponent } from './arrow-down-icon.component';
import { AskrobotLogoIconComponent } from './askrobot-logo-icon.component';
import { FilledStarIconComponent } from './filled-star-icon.component';
import { RatingIconComponent } from './rating-icon.component';
import { SearchIconComponent } from './search-icon.component';
import { StarIconComponent } from './star-icon.component';
import { WarningIconComponent } from './warning-icon.component';

@NgModule({
    declarations: [
        AskrobotLogoIconComponent,
        WarningIconComponent,
        ArrowDownIconComponent,
        RatingIconComponent,
        SearchIconComponent,
        StarIconComponent,
        FilledStarIconComponent,
    ],
    exports: [
        AskrobotLogoIconComponent,
        WarningIconComponent,
        ArrowDownIconComponent,
        RatingIconComponent,
        SearchIconComponent,
        StarIconComponent,
        FilledStarIconComponent,
    ],
    imports: [
        CommonModule,
    ]
})
export class IconsModule { }