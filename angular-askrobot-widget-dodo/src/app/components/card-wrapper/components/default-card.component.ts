import { Component, Input } from '@angular/core';

import { DEFAULT_CLIENT_ID, DEFAULT_QUESTION } from '../helpers/card-wrapper-consts';
import { TOKEN } from 'environment';
import { CardThemeType } from 'projects/angular-askrobot-widget-dodo/src/lib/components/card/helpers/card.typings';
import { CardTheme } from 'projects/angular-askrobot-widget-dodo/src/lib/components/card/helpers/card.consts';

@Component({
  selector: 'default-askrobot-card',
  template: `
    <askrobot-card
        [question]="question"
        [token]="token"
        [clientId]="clientId"
        [theme]="theme"
        [statusBgColor]="'#FFD700'"
        [statusColor]="'rgba(0, 0, 0, 0.64)'"
    ></askrobot-card>
  `
})

export class DefaultCardComponent {
    question = DEFAULT_QUESTION
    token = TOKEN
    clientId = DEFAULT_CLIENT_ID

    @Input() theme: CardThemeType = CardTheme.DARK
}
