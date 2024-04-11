import { Component } from '@angular/core';

import { DEFAULT_DESCRIPTION, DEFAULT_STATUS_TEXT, DEFAULT_TITLE } from '../helpers/card-wrapper-consts';

@Component({
  selector: 'custom-lines-askrobot-card',
  template: `
    <askrobot-card
        [title]="title"
        [description]="description"
        [statusText]="statusText"
        [previewDescriptionLines]="7"
    ></askrobot-card>
  `
})

export class CustomLinesCardComponent {
    title = DEFAULT_TITLE
    description = DEFAULT_DESCRIPTION
    statusText = DEFAULT_STATUS_TEXT
}