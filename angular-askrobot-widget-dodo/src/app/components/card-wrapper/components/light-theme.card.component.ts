import { Component } from '@angular/core';

import { DEFAULT_CLIENT_ID, DEFAULT_QUESTION } from '../helpers/card-wrapper-consts';
import { TOKEN } from 'environment';

@Component({
  selector: 'light-theme-askrobot-card',
  template: `
    <askrobot-card
        [question]="question"
        [token]="token"
        [clientId]="clientId"
        [theme]="'light'"
        [statusBgColor]="'#FFD700'"
        [statusColor]="'rgba(0, 0, 0, 0.64)'"
        [previewAnswerLines]="7"
        [warningText]="'Информация не является стандартом Додо'"
    ></askrobot-card>
  `
})

export class LightThemeCardComponent {
    question = DEFAULT_QUESTION
    token = TOKEN
    clientId = DEFAULT_CLIENT_ID
}