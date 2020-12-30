import {Component, ElementRef} from '@angular/core';
import {jqxMenuComponent} from '@jqxSource/angular_jqxmenu';

@Component({
    selector: 'softpak-menu',
    template: '<div><ng-content></ng-content></div>',
})

export class SoftpakMenuComponent extends jqxMenuComponent {

    constructor(containerElement: ElementRef) {
        super(containerElement);
        this.attrTheme = 'softpak';
    }
}
