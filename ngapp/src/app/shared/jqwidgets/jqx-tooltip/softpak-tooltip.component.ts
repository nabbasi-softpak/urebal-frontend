import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {jqxTooltipComponent} from "@jqxSource/angular_jqxtooltip";

@Component({
    selector: 'softpak-tooltip',
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoftpakTooltipComponent extends jqxTooltipComponent implements OnDestroy, OnInit {

    constructor(containerElement: ElementRef) {
        super(containerElement);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy(): void {
    }

}
