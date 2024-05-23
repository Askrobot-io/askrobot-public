import { Component, Input, OnChanges } from '@angular/core';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { HttpClient } from '@angular/common/http';

import { ASKROBOT_URL, CardTheme, SCOPE } from './helpers/card.consts';
import { CardThemeType, Scope } from './helpers/card.typings';

@Component({
  selector: 'askrobot-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.less']
})
export class CardComponent implements OnChanges {

  @Input() question: string = "";
  @Input() clientId: string = "";
  @Input() token: string = "";

  // optional
  @Input() userId: string = "";
  @Input() theme: CardThemeType = CardTheme.DARK
  @Input() isExpandable: boolean = true;
  @Input() previewAnswerLines: number = 4;

  answer = "";
  scope: Scope = SCOPE.STANDARDS;
  isLoading = true;
  isStreaming = true;
  isStandard: boolean | null = null;
  showSearch = false;
  showWarning = false;

  expanded = false;
  showSearchConfirmation = false;
  showRatingBlock = false;
  ratingSuccessBlock = false;
  hoverRating = 0;
  // form
  ratingSubmitted = false;
  rating = 0;
  comment = '';

  constructor(private http: HttpClient) { }

  ngOnChanges() {
    if (this.isExpandable !== undefined) {
      this.expanded = !this.isExpandable;
    }
    this.scope = SCOPE.STANDARDS;
    this.fetchData();
    this.answer = "";
    this.isStandard = null;
    this.showWarning = false;
    this.showSearch = false;
  }

  async fetchData() {
    if (!this.token || !this.clientId) return;
    const ctrl = new AbortController();
    let last_created_at = 0;
    this.isLoading = true;

    const body: Record<string, any> = {
      question: this.question,
      protocol: "sse",
      scope: this.scope,
      engine: "answer",
      client: this.clientId,
    };

    if (this.userId) {
      body.user_info = {
        id: this.userId,
      }
    }

    await fetchEventSource(ASKROBOT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        'Authorization': "Bearer " + this.token,
      },
      body: JSON.stringify(body),
      signal: ctrl.signal,
      onmessage: (ev) => {
        try {
          let message = JSON.parse(ev.data);
          this.isStreaming = true;

          if (message != null && message.id != null && message.created_at >= last_created_at) {
            last_created_at = message.created_at; // HOT FIX: checking that the messages are going sequentially
            this.isLoading = false;
            this.answer = message.answer;
            if (!message.streaming) {
              this.isStreaming = false;
              this.answer = message.markdown.replace(/\\\./gi, '.'); // HOT FIX: unescape dot(.) for `marked` module
              this.isStandard = message.is_standard;
              this.showWarning = !message.is_standard;
              this.showSearch = message.has_answer_in_articles;
            }
          }

        } catch (error) {
          this.isLoading = false;
          console.error("Error receiving messages", error);
        }
      }
    });
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
    this.scope = SCOPE.ARTICLES;
    this.showSearchConfirmation = false;
    this.isLoading = true;
    this.fetchData();
  }

  ratingClick() {
    this.ratingSuccessBlock = true;
    const reviewData = {
      api: true,
      engine: 'event',
      client: this.clientId,
      question: this.question,
      rating: this.rating + 1,
      message: this.comment
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };

    this.http.post<any>(ASKROBOT_URL, reviewData, { headers })
      .subscribe(
        (res) => {
          this.ratingSubmitted = true;
          this.showRatingBlock = false;
          this.ratingSuccessBlock = false;
          this.rating = 0;
          this.hoverRating = 0;
          this.comment = '';
        },
        (error) => {
          console.error('Error posting review', error);
        }
      );
  }

  searchCancelClick() {
    this.showSearchConfirmation = false;
  }

  ratingCancelClick() {
    this.showRatingBlock = false;
    this.rating = 0;
    this.hoverRating = 0;
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
    return this.theme === CardTheme.DARK ? "#fff" : "#141414";
  }

  getSearchIconColor() {
    return this.theme === CardTheme.DARK ? "#323232" : "#fff";
  }

  getFilledStarColor() {
    return this.theme === CardTheme.DARK ? "#FAFAFA" : "#141414";
  }

}
