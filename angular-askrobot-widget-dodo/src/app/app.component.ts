import { Component } from '@angular/core';

@Component({
  selector: 'askrobot-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  showLightThemeDefault = false;
  showCustomStyleStatus = false;
  showWarning = false;
  showCustomLines = false;
  showNotExapandable = false;
  showLightThemeAllProps = false;

  onShowLightThemeDefault() {
    this.showLightThemeDefault = !this.showLightThemeDefault;
  }

  onShowCustomStyleStatus() {
    this.showCustomStyleStatus = !this.showCustomStyleStatus;
  }

  onShowWarning() {
    this.showWarning = !this.showWarning;
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
