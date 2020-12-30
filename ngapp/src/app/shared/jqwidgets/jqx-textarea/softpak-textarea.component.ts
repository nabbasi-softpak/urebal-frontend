import {ChangeDetectionStrategy, Component, ElementRef, Input} from '@angular/core';
import {jqxTextAreaComponent} from "@jqxSource/angular_jqxtextarea";

@Component({
    selector: 'softpak-textarea',
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoftpakTextareaComponent extends jqxTextAreaComponent {

    constructor(containerElement: ElementRef) {
        super(containerElement);
        this.attrTheme = 'softpak';
    }

}
