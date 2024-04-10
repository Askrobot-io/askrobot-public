import { OnChanges, ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'rating-icon',
    template: `
        <svg [attr.width]="width" [attr.height]="height" [attr.viewBox]="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.74016 2.81331L7.36016 4.73998C7.28016 5.13331 7.38683 5.53998 7.64016 5.84665C7.8935 6.15331 8.26683 6.33331 8.66683 6.33331H12.3335V7.05331L10.6202 11H5.22683C5.10683 11 5.00016 10.8933 5.00016 10.7733V5.54665L7.74016 2.81331ZM8.3335 0.333313L4.06016 4.60665C3.80683 4.85998 3.66683 5.19998 3.66683 5.55331V10.7733C3.66683 11.6333 4.36683 12.3333 5.22683 12.3333H10.6268C11.1002 12.3333 11.5335 12.0866 11.7735 11.6866L13.5535 7.58665C13.6268 7.41998 13.6668 7.23998 13.6668 7.05331V6.33331C13.6668 5.59998 13.0668 4.99998 12.3335 4.99998H8.66683L9.28016 1.89998C9.3135 1.75331 9.2935 1.59331 9.22683 1.45998C9.0735 1.15998 8.88016 0.886646 8.64016 0.646646L8.3335 0.333313ZM1.66683 4.99998H0.333496V12.3333H1.66683C2.0335 12.3333 2.3335 12.0333 2.3335 11.6666V5.66665C2.3335 5.29998 2.0335 4.99998 1.66683 4.99998Z" [attr.fill]="color" />
        </svg>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RatingIconComponent implements OnChanges {
    @Input() public color = "#fff";
    @Input() public width = "14";
    @Input() public height = "13";

    viewBox = "0 0 14 13";

    ngOnChanges() {
        this.viewBox = `0 0 ${this.width} ${this.height}`
    }
}