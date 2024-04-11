import { Component } from '@angular/core';

import { DEFAULT_DESCRIPTION, DEFAULT_STATUS_TEXT, DEFAULT_TITLE } from '../helpers/card-wrapper-consts';

@Component({
  selector: 'show-rating-askrobot-card',
  template: `
    <askrobot-card
        [title]="title"
        [description]="description"
        [statusText]="statusText"
        [showRating]="true"
    ></askrobot-card>
  `
})

export class ShowRatingCardComponent {
    title = DEFAULT_TITLE
    description = DEFAULT_DESCRIPTION
    statusText = DEFAULT_STATUS_TEXT
}