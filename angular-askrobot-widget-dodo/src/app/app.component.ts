import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'askrobot-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  form: FormGroup;
  question = '';
  showLightThemeDefault = false;
  showCustomLines = false;
  showNotExapandable = false;
  showLightThemeAllProps = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      question: ['']
    });
  }

  onSubmit() {
    this.question = this.form.get('question')?.value || "";
  }

  onShowLightThemeDefault() {
    this.showLightThemeDefault = !this.showLightThemeDefault;
  }

  onCustomLines() {
    this.showCustomLines = !this.showCustomLines;
  }

  onNotExpandable() {
    this.showNotExapandable = !this.showNotExapandable;
  }

  onLightThemeAllProps() {
    this.showLightThemeAllProps = !this.showLightThemeAllProps;
  }
}
