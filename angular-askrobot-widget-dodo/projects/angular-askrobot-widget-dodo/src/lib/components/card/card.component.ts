import { Component, Input, OnChanges } from '@angular/core';

import { CardTheme } from './helpers/card.consts';
import { CardThemeType } from './helpers/card.typings';

@Component({
  selector: 'askrobot-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less']
})
export class CardComponent implements OnChanges {

  @Input() title : string = "";
  @Input() description : string = "";
  @Input() statusText : string = "";

  // optional
  @Input() theme: CardThemeType = CardTheme.DARK
  @Input() isLoading = false;
  @Input() statusBgColor: string = "#fff";
  @Input() statusColor: string = "#000";
  @Input() isExpandable: boolean = true;
  @Input() previewDescriptionLines: number = 4;
  @Input() warningText: string = "";
  @Input() showSearch: boolean = false;
  @Input() showRating: boolean = false;

  expanded = false;
  showSearchConfirmation = false;
  showRatingBlock = false;
  ratingSuccessBlock = false;
  hoverRating = 0;
  // form
  rating = 0;
  comment = '';

  ngOnChanges() {
    if (this.isExpandable !== undefined) {
      this.expanded = !this.isExpandable;
    }
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  searchConfirmationClick() {
    this.showSearchConfirmation = true;
  }

  ratingBlockClick() {
    this.showRatingBlock = true;
  }

  searchClick() {
  }

  ratingClick() {
    this.ratingSuccessBlock = true;
  }

  searchCancelClick() {
    this.showSearchConfirmation = false;
  }

  ratingCancelClick() {
    this.showRatingBlock = false;
  }

  onStarHover(index: number): void {
    this.hoverRating = index;
  }

  onStarLeave(): void {
    this.hoverRating = this.rating;
  }

  onStarClick(index: number): void {
    this.rating = index;
    this.hoverRating = index;
  }

  getThemeClass() {
    return this.theme === CardTheme.DARK ? CardTheme.DARK : CardTheme.LIGHT;
  }

  getIconColor() {
    return this.theme === CardTheme.DARK ? "#fff" : "#000";
  }

  getLogoColor() {
    return this.theme === CardTheme.DARK ? "#fff" : "#26BD00";
  }

  getSearchIconColor() {
    return this.theme === CardTheme.DARK ? "#323232" : "#fff";
  }

}
