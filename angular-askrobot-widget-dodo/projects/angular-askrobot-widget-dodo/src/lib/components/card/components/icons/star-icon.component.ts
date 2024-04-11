import { OnChanges, ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'star-icon',
    template: `
        <svg [attr.width]="width" [attr.height]="height" [attr.viewBox]="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 6.89L10.94 10H13.76L11.49 11.62L12.42 14.63L10 12.79L7.58 14.63L8.51 11.62L6.24 10H9.06L10 6.89ZM10 0L7.58 8H0L6.17 12.41L3.83 20L10 15.31L16.18 20L13.83 12.41L20 8H12.42L10 0Z" [attr.fill]="color"/>
        </svg>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class StarIconComponent implements OnChanges {
    @Input() public color = "#fff";
    @Input() public width = "20";
    @Input() public height = "20";

    viewBox = "0 0 20 20";

    ngOnChanges() {
        this.viewBox = `0 0 ${this.width} ${this.height}`
    }
}