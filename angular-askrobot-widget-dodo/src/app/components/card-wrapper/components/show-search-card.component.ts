import { Component } from '@angular/core';

import { DEFAULT_DESCRIPTION, DEFAULT_STATUS_TEXT, DEFAULT_TITLE } from '../helpers/card-wrapper-consts';

@Component({
  selector: 'show-search-askrobot-card',
  template: `
    <askrobot-card
        [title]="title"
        [description]="description"
        [statusText]="statusText"
        [showSearch]="true"
    ></askrobot-card>
  `
})

export class ShowSearchCardComponent {
    title = DEFAULT_TITLE
    description = DEFAULT_DESCRIPTION
    statusText = DEFAULT_STATUS_TEXT
}