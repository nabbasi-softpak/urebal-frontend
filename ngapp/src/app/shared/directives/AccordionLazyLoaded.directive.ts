import {Directive, TemplateRef} from '@angular/core';

@Directive({
    selector: 'ng-template[AccordionLazyLoadedDirective]'
})
export class AccordionLazyLoadedDirective {
    constructor(public _template: TemplateRef<any>) {}
}
