import {
    ChangeDetectionStrategy, Component,
    ElementRef, forwardRef, OnChanges, OnInit,
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {jqxDropDownListComponent} from '@jqxSource/angular_jqxdropdownlist';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SoftpakDropdownComponent),
    multi: true,
};

@Component({
    selector: 'softpak-dropdown',
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class SoftpakDropdownComponent extends jqxDropDownListComponent implements OnChanges, OnInit {
        constructor(containerElement: ElementRef) {
        super(containerElement);
        this.attrTheme = 'blueleaf';
        this.attrPlaceHolder = 'Please Choose:'
        this.attrPopupZIndex = 909090;
    }

    ngOnInit() {
        super.ngOnInit();
    }
}