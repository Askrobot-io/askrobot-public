import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
  hasAnswer = false;
  isStandard: boolean | null = null;
  showSearch = false;
  showWarning = false;

  expanded = false;
  showRatingBlock = false;
  ratingSuccessBlock = false;
  // form
  ratingSubmitted = false;
  tempRating = 0;
  rating = 0;
  comment = '';
  private abortController: AbortController;

  ngOnDestroy() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  constructor(private http: HttpClient) {
    this.abortController = new AbortController();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.question.firstChange && changes.question.currentValue !== changes.question.previousValue) {
      this.showRatingBlock = true;
    }

    if (this.isExpandable !== undefined) {
      this.expanded = !this.isExpandable;
    }
    this.scope = SCOPE.STANDARDS;
    this.fetchData();
    this.answer = "";
    this.isStandard = null;
    this.showWarning = false;
    this.showSearch = false;
    this.showRatingBlock = false;
  }

  async fetchData() {
    if (!this.token || !this.clientId) return;
    const { signal } = this.abortController;
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
      signal: signal,
      onmessage: (ev) => {
        try {
          let message = JSON.parse(ev.data);
          this.isStreaming = true;

          if (
            message != null
            && message.id != null
            && (message.streaming === false || message.created_at > last_created_at)
        ) {
            last_created_at = message.created_at; // HOT FIX: checking that the messages are going sequentially
            this.isLoading = false;
            this.answer =
              (message.markdown)
                ? message.markdown.replace(/\\([\.\-\>])/g, '$1')
                : message.answer;

            if (!message.streaming) {
              this.isStreaming = false;
              this.hasAnswer = true;
              this.isStandard = message.is_standard || null;
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


  ratingBlockClick() {
    this.showRatingBlock = true;
  }

  searchClick() {
    this.scope = SCOPE.ARTICLES;
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
          this.comment = '';
        },
        (error) => {
          console.error('Error posting review', error);
        }
      );
  }

  ratingCancelClick() {
    this.showRatingBlock = false;
    this.rating = 0;
  }

  onStarHover(index: number) {
    this.tempRating = index;
  }

  onStarLeave() {
    this.tempRating = this.rating;
  }

  onStarClick(index: number): void {
    this.tempRating = index;
    this.rating = this.tempRating;
    const reviewData = {
      api: true,
      engine: 'event',
      client: this.clientId,
      question: this.question,
      rating: this.rating + 1,
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    };

    this.http.post<any>(ASKROBOT_URL, reviewData, { headers })
      .subscribe(
        (res) => {},
        (error) => {
          console.error('Error posting review', error);
        }
      );
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
