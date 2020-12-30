import {Component, ElementRef} from '@angular/core';
import {jqxPanelComponent} from '@jqxSource/angular_jqxpanel';

@Component({
    selector: 'softpak-panel',
    template: '<div><ng-content></ng-content></div>',
})
export class SoftpakPanelComponent extends jqxPanelComponent {

    constructor(containerElement: ElementRef) {
        super(containerElement);
        this.attrTheme = 'softpak';
    }

}
