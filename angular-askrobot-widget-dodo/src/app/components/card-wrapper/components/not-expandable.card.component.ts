import { Component } from '@angular/core';

import { DEFAULT_DESCRIPTION, DEFAULT_STATUS_TEXT, DEFAULT_TITLE } from '../helpers/card-wrapper-consts';

@Component({
  selector: 'not-expandable-askrobot-card',
  template: `
    <askrobot-card
        [title]="title"
        [description]="description"
        [statusText]="statusText"
        [isExpandable]="false"
    ></askrobot-card>
  `
})

export class NotExpandableCardComponent {
    title = DEFAULT_TITLE
    description = DEFAULT_DESCRIPTION
    statusText = DEFAULT_STATUS_TEXT
}