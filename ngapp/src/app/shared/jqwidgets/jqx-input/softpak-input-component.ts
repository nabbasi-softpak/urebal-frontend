import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    OnInit,
    Output,
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {jqxInputComponent} from '@jqxSource/angular_jqxinput';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SoftpakInputComponent),
    multi: true,
};

@Component({
    selector: 'softpak-input',
    template: '<input type="text" [(ngModel)]="ngValue">',
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoftpakInputComponent extends jqxInputComponent implements OnInit {

    @Output() onUserChange = new EventEmitter();

    constructor(containerElement: ElementRef) {
        super(containerElement);
        this.attrTheme = 'blueleaf';
    }

    moveClasses(parentEl: HTMLElement, childEl: HTMLElement) {
        const parentSelector = $(parentEl);
        const childSelector = $(childEl);

        const parentClasses = parentSelector.attr('class');
        parentSelector.attr('class', '');

        childSelector.addClass(parentClasses);

    }
}
