import { Component } from '@angular/core';

import { DEFAULT_CLIENT_ID, DEFAULT_QUESTION } from '../helpers/card-wrapper-consts';
import { TOKEN } from 'environment';

@Component({
  selector: 'custom-style-status-askrobot-card',
  template: `
    <askrobot-card
        [question]="question"
        [token]="token"
        [clientId]="clientId"
        [statusBgColor]="'#FFD700'"
        [statusColor]="'rgba(0, 0, 0, 0.64)'"
    ></askrobot-card>
  `
})

export class CustomStyleStatusCardComponent {
    question = DEFAULT_QUESTION
    token = TOKEN
    clientId = DEFAULT_CLIENT_ID
}