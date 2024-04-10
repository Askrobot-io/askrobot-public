

import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'warning-icon',
    template: `
        <svg [attr.width]="width" [attr.height]="height" [attr.viewBox]="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 13.8182H16L8 0L0 13.8182ZM8.72727 11.6364H7.27273V10.1818H8.72727V11.6364ZM8.72727 8.72727H7.27273V5.81818H8.72727V8.72727Z" [attr.fill]="color"/>
        </svg>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class WarningIconComponent implements OnChanges {
    @Input() public color = "#fff";
    @Input() public width = "16";
    @Input() public height = "14";

    viewBox = "0 0 16 14";

    ngOnChanges() {
        this.viewBox = `0 0 ${this.width} ${this.height}`
    }
}