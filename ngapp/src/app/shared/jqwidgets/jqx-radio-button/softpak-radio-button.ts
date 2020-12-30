import {ChangeDetectionStrategy, Component, ElementRef, forwardRef} from '@angular/core';
import {jqxRadioButtonComponent} from '@jqxSource/angular_jqxradiobutton';
import {NG_VALUE_ACCESSOR} from "@angular/forms";

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SoftpakRadioButton),
    multi: true
}

@Component({
    selector: 'softpak-radio-button',
    template: '<div><ng-content></ng-content></div>',
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoftpakRadioButton extends jqxRadioButtonComponent {

    constructor(containerElement: ElementRef) {
        super(containerElement);
        this.attrTheme = 'softpak';
    }

}
