import { Component, Input } from '@angular/core';

import { DEFAULT_CLIENT_ID, DEFAULT_QUESTION } from '../helpers/card-wrapper-consts';
import { TOKEN } from 'environment';

@Component({
  selector: 'light-theme-askrobot-card',
  template: `
    <askrobot-card
        [question]="_question"
        [token]="token"
        [clientId]="clientId"
        [theme]="'light'"
        [previewAnswerLines]="7"
    ></askrobot-card>
  `
})

export class LightThemeCardComponent {
  @Input() set question(value: string) {
    this._question = value || DEFAULT_QUESTION;
  }
  _question = ""
  token = TOKEN
  clientId = DEFAULT_CLIENT_ID
}