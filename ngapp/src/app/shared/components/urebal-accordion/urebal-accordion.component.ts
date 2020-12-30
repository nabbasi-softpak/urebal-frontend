import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    ContentChild,
    AfterContentInit,
    TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import {AccordionLazyLoadedDirective} from "../../directives/AccordionLazyLoaded.directive";

// NOTE: DON'T EXPORT
let urebalAccordionComponentId: number = 1;

export class AccordionAction {
    name: string;
    icon: string;
    action: any;
    classes: string;
    isAllowed: boolean = false;
}

@Component({
    selector: 'urebal-accordion',
    templateUrl: './urebal-accordion.component.html',
    styleUrls: ['./urebal-accordion.component.css'],
    changeDetection: ChangeDetectionStrategy.Default // TODO: use OnPush
})
export class UrebalAccordionComponent implements OnInit, AfterContentInit {
    @Input() id: number;
    @Input() title: string;
    @Input() length: number = null;
    @Input() icon: string;
    @Input() actions: AccordionAction[];
    @Input() active: boolean = false;
    @Input() theme: string = "urebal";
    @Input() cache: boolean = true;
    @Input() titleClasses: string;
    @Input() contentClasses: string;

    @Output() toggleAccordion: EventEmitter<boolean> = new EventEmitter();
    @ContentChild(AccordionLazyLoadedDirective) _lazyContent: AccordionLazyLoadedDirective;

    contentTemplate: TemplateRef<any>;
    loaded: boolean;

    constructor(private ref: ChangeDetectorRef) {
    }

    onClick(event) {
        event.preventDefault();
        this.toggleAccordion.emit(this.active);
        this.loaded = true;
    }

    ngOnInit() {
        if (!this.id) {
            // Assign id, if not assigned by user
            this.id = urebalAccordionComponentId++;
        }
    }

    ngAfterContentInit() {
        if (this._lazyContent) {
            this.contentTemplate = this._lazyContent._template;
        }
    }
}
