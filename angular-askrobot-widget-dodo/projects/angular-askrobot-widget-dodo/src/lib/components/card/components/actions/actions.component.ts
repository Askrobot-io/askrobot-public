import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardTheme } from '../../helpers/card.consts';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.less']
})
export class ActionsComponent {
  @Input() theme: CardTheme = CardTheme.DARK

  @Input() mainButtonText = "";
  @Input() mainButtonIcon: TemplateRef<any> | null = null;
  @Input() secondaryButtonText: string = "#fff";
  @Input() secondaryButtonIcon: TemplateRef<any> | null = null;
  @Input() secondaryButtonComponent: TemplateRef<any> | null = null;
  @Input() hasBackground: boolean = true;

  @Output() mainButtonAction = new EventEmitter<void>();
  @Output() secondaryButtonAction = new EventEmitter<void>();

  getSearchIconColor() {
    return this.theme === CardTheme.DARK ? "#323232" : "#fff";
  }

  mainButtonClick() {
    this.mainButtonAction.emit();
  }

  secondaryButtonClick() {
    this.secondaryButtonAction.emit();
  }
}
