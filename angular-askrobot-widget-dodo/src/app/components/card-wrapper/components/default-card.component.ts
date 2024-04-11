import { Component, Input } from '@angular/core';

import { DEFAULT_DESCRIPTION, DEFAULT_STATUS_TEXT, DEFAULT_TITLE } from '../helpers/card-wrapper-consts';
import { CardThemeType } from 'projects/angular-askrobot-widget-dodo/src/lib/components/card/helpers/card.typings';
import { CardTheme } from 'projects/angular-askrobot-widget-dodo/src/lib/components/card/helpers/card.consts';

@Component({
  selector: 'default-askrobot-card',
  template: `
    <askrobot-card
        [title]="title"
        [description]="description"
        [statusText]="statusText"
        [theme]="theme"
        [statusBgColor]="'#FFD700'"
        [statusColor]="'rgba(0, 0, 0, 0.64)'"
    ></askrobot-card>
  `
})

export class DefaultCardComponent {
    title = DEFAULT_TITLE
    description = DEFAULT_DESCRIPTION
    statusText = DEFAULT_STATUS_TEXT

    @Input() theme: CardThemeType = CardTheme.DARK
}
