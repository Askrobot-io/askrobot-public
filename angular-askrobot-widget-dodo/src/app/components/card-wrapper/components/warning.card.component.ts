import { Component } from '@angular/core';

import { DEFAULT_CLIENT_ID, DEFAULT_QUESTION } from '../helpers/card-wrapper-consts';
import { TOKEN } from 'environment';

@Component({
  selector: 'warning-askrobot-card',
  template: `
    <askrobot-card
        [question]="question"
        [token]="token"
        [clientId]="clientId"
        [warningText]="'Информация не является стандартом Додо'"
    ></askrobot-card>
  `
})

export class WarningCardComponent {
    question = DEFAULT_QUESTION
    token = TOKEN
    clientId = DEFAULT_CLIENT_ID
}