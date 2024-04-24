import { Component, Input } from '@angular/core';

import { DEFAULT_CLIENT_ID, DEFAULT_QUESTION } from '../helpers/card-wrapper-consts';
import { TOKEN } from 'environment';
import { CardThemeType } from 'projects/angular-askrobot-widget-dodo/src/lib/components/card/helpers/card.typings';
import { CardTheme } from 'projects/angular-askrobot-widget-dodo/src/lib/components/card/helpers/card.consts';

@Component({
  selector: 'default-askrobot-card',
  template: `
    <askrobot-card
        [question]="_question"
        [token]="token"
        [clientId]="clientId"
        [theme]="theme"
    ></askrobot-card>
  `
})

export class DefaultCardComponent {
  @Input() theme: CardThemeType = CardTheme.DARK
  @Input() set question(value: string) {
    this._question = value || DEFAULT_QUESTION;
  }
  _question = ""
  token = TOKEN
  clientId = DEFAULT_CLIENT_ID

}
