import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {jqxValidatorComponent} from '@jqxSource/angular_jqxvalidator';

@Component({
    selector: 'softpak-validator',
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoftpakValidatorComponent extends jqxValidatorComponent implements OnDestroy, OnInit {

    constructor(containerElement: ElementRef) {
        super(containerElement);
    }
    validate() {
        return this.host.jqxValidator('validate')
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy(): void {

        if (this.host) {
            this.hide();
        }

    }

}
