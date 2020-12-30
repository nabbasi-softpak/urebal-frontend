import {
    ChangeDetectionStrategy, Component,
    ElementRef, forwardRef, Input, OnChanges, OnInit,
} from '@angular/core';
import {jqxComboBoxComponent} from "@jqxSource/angular_jqxcombobox";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => jqxComboBoxComponent),
    multi: true
};

@Component({
    selector: 'softpak-combobox',
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoftpakComboBoxComponent extends jqxComboBoxComponent implements OnChanges, OnInit {

    @Input() comboBoxInputClassName = '';
    @Input() comboBoxContainerDivClassName = '';

    constructor(containerElement: ElementRef) {
        super(containerElement);
        this.attrTheme = 'blueleaf';
        this.attrPopupZIndex = 909090;
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngAfterViewInit() {
        super.ngAfterViewInit();

        let uniqueId = $(this.elementRef.nativeElement).attr('id');
        if(uniqueId){
            $('#' + uniqueId + '  input').addClass(this.comboBoxInputClassName);
            $('#' + uniqueId + ">div[class*='jqx-combobox-blueleaf']").addClass(this.comboBoxContainerDivClassName);
        }
    }
}