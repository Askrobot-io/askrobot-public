import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'arrowdown-icon',
    template: `
        <svg [attr.width]="width" [attr.height]="height" [attr.viewBox]="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.32364 8.74099C7.86809 9.19655 7.12827 9.19655 6.67272 8.74099L0.841663 2.90994C0.386112 2.45439 0.386112 1.71457 0.841663 1.25902C1.29721 0.80347 2.03703 0.80347 2.49258 1.25902L7.5 6.26644L12.5074 1.26267C12.963 0.807115 13.7028 0.807115 14.1583 1.26267C14.6139 1.71822 14.6139 2.45803 14.1583 2.91358L8.32728 8.74464L8.32364 8.74099Z" [attr.fill]="color" />
        </svg>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ArrowDownIconComponent implements OnChanges {
    @Input() public color = "#fff";
    @Input() public width = "15";
    @Input() public height = "10";

    viewBox = "0 0 15 10";

    ngOnChanges() {
        this.viewBox = `0 0 ${this.width} ${this.height}`
    }
}