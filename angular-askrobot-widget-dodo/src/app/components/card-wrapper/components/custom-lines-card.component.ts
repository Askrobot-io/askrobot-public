import { Component } from '@angular/core';

import { DEFAULT_CLIENT_ID, DEFAULT_QUESTION } from '../helpers/card-wrapper-consts';
import { TOKEN } from 'environment';

@Component({
  selector: 'custom-lines-askrobot-card',
  template: `
    <askrobot-card
        [question]="question"
        [token]="token"
        [clientId]="clientId"
        [previewAnswerLines]="7"
    ></askrobot-card>
  `
})

export class CustomLinesCardComponent {
    question = DEFAULT_QUESTION
    token = TOKEN
    clientId = DEFAULT_CLIENT_ID
}