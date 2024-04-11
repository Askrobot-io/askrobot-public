import { OnChanges, ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'filled-star-icon',
    template: `
        <svg [attr.width]="width" [attr.height]="height" [attr.viewBox]="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.43 8L10 0L7.57 8H0L6.18 12.41L3.83 20L10 15.31L16.18 20L13.83 12.41L20 8H12.43Z" [attr.fill]="color"/>
        </svg>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FilledStarIconComponent implements OnChanges {
    @Input() public color = "#fff";
    @Input() public width = "20";
    @Input() public height = "20";

    viewBox = "0 0 20 20";

    ngOnChanges() {
        this.viewBox = `0 0 ${this.width} ${this.height}`
    }
}