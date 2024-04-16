import { OnChanges, ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'filled-star-icon',
    template: `
        <svg [attr.width]="width" [attr.height]="height" [attr.viewBox]="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24.8308 9.65372L17.8882 8.64474L14.7847 2.35294C14.6999 2.18067 14.5604 2.04122 14.3882 1.95646C13.9561 1.74317 13.4311 1.92091 13.2151 2.35294L10.1116 8.64474L3.16904 9.65372C2.97763 9.68107 2.80263 9.7713 2.66865 9.90802C2.50667 10.0745 2.41741 10.2985 2.42049 10.5308C2.42356 10.763 2.51872 10.9846 2.68505 11.1467L7.7081 16.044L6.52138 22.9592C6.49355 23.1201 6.51135 23.2855 6.57277 23.4368C6.63418 23.588 6.73675 23.719 6.86884 23.815C7.00093 23.9109 7.15725 23.9679 7.32009 23.9795C7.48293 23.9911 7.64577 23.9569 7.79013 23.8807L13.9999 20.6158L20.2097 23.8807C20.3792 23.9709 20.5761 24.001 20.7647 23.9682C21.2405 23.8861 21.5604 23.435 21.4784 22.9592L20.2917 16.044L25.3147 11.1467C25.4515 11.0127 25.5417 10.8377 25.569 10.6463C25.6429 10.1678 25.3093 9.72482 24.8308 9.65372Z" [attr.fill]="color"/>
        </svg>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FilledStarIconComponent implements OnChanges {
    @Input() public color = "#fff";
    @Input() public width = "28";
    @Input() public height = "28";

    viewBox = "0 0 28 28";

    ngOnChanges() {
        this.viewBox = `0 0 ${this.width} ${this.height}`
    }
}