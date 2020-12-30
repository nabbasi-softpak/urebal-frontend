import {ChangeDetectionStrategy, Component, ElementRef, Input} from '@angular/core';
import {jqxButtonComponent} from "@jqxSource/angular_jqxbuttons";

@Component({
    selector: 'softpak-button',
    template: '<button><ng-content></ng-content></button>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoftpakButtonComponent extends jqxButtonComponent {

    constructor(containerElement: ElementRef) {
        super(containerElement);
        this.attrTheme = 'softpak';
    }

    moveClasses(parentEl: HTMLElement, childEl: HTMLElement) {
       const parentSelector = $(parentEl);
       const childSelector = $(childEl);

       const parentClasses = parentSelector.attr('class');
       parentSelector.attr('class', '');

       childSelector.addClass(parentClasses);

    }

}
