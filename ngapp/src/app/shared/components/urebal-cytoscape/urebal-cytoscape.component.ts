import {
    ChangeDetectionStrategy,
    Component, ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy, OnInit,
    Output
} from '@angular/core';
import {cyEdgeCSS, cyNodeCSS} from "./urebal-cytoscape.datasource";

declare var cytoscape: any;

@Component({
    selector: 'app-urebal-cytoscape',
    template: '<div class="cy-default"></div>',
    styles: [`.cy-default {
        margin: 0 auto;
        height: 500px;
        width: 500px;
        display: block;
        position: relative;
        left: 0;
        top: 0;
    }`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UrebalCytoscapeComponent implements OnChanges, OnDestroy, OnInit {
    @Output() nodeTap = new EventEmitter();
    @Input() public elements: any;
    @Input() public style: any;
    @Input() public layout: any;
    @Input() public zoom: any;
    public cy: any;
    private cyElem;

    public constructor(private el: ElementRef) {
        this.layout = this.layout || {
            name: 'concentric',
            padding: 3,
            fit: true,
        };

        this.zoom = this.zoom || {
            min: 1,
            max: 1
        };

        // http://js.cytoscape.org/#style
        this.style = this.style || cytoscape.stylesheet()
            .selector('node')
            .css(cyNodeCSS)
            .selector('edge')
            .css(cyEdgeCSS);
    }

    ngOnInit() {
        this.cyElem = this.el.nativeElement.children[0];
    }

    public render() {
        if (!this.cy) {
            this.cy = cytoscape({
                container: this.cyElem,
                layout: this.layout,
                boxSelectionEnabled: false,
                zoom: 1,
                minZoom: this.zoom.min,
                maxZoom: this.zoom.max,
                style: this.style,
                elements: this.elements,
                zoomingEnabled: true,
                userPanningEnabled: false
            });
            this.attachTapEvent();
        } else {
            this.cy.layout = this.layout;
            this.cy.nodes().remove();
            this.cy.add(this.elements);
        }
    }

    public attachTapEvent() {
        this.cy.on('tap', 'node', (event) => {
            this.nodeTap.emit(event);
            //console.log(event);
        });

        this.cy.on('mouseover', 'node', (event) => {
            //console.log(event);
        });

        this.cy.on('mouseout', 'node', (event) => {
            //console.log(event);
        });

        this.cy.on('cxttap', function(e){
            //console.log("right click!"); // just to check that it works, look at the console
            // add here your code...
            // ....
        })
    }

    ngOnChanges() {
        this.render();
    }

    destroy() {
        if (this.cy) this.cy.destroy();
    }

    ngOnDestroy() {
        this.destroy();
    }
}
