import {ChangeDetectionStrategy, Component, ElementRef, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {jqxCheckBoxComponent} from "../../../../assets/jqwidgets-ts/angular_jqxcheckbox";

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SoftpakCheckboxComponent),
    multi: true,
};

@Component({
    selector: 'softpak-checkbox',
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class SoftpakCheckboxComponent extends jqxCheckBoxComponent {

    initialLoad = true;

    constructor(containerElement: ElementRef) {
        super(containerElement);
        this.attrTheme = 'softpak';
    }

    writeValue(value: any): void {
        if (this.widgetObject && value !== null) {

            if (!value)
                value = false;

            if (this.initialLoad) {
                setTimeout(() => this.host.jqxCheckBox('val', value));
                this.initialLoad = false;
            }
            this.host.jqxCheckBox('val', value);
        }
    }

}
