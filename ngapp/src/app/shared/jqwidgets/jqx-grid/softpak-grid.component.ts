import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {jqxGridComponent} from '@jqxSource/angular_jqxgrid';
import {columnHeaderRenderer, defaultCellRenderer} from './softpak-grid-renderers';
import {GridUtils} from "../../util/GridUtils";
import {SoftpakGridHelper} from "./softpak-grid.helper";

@Component({
    selector: 'softpak-grid',
    template: '<div><ng-content></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoftpakGridComponent extends jqxGridComponent implements OnChanges {
    @Output() gridRef = new EventEmitter();

    constructor(containerElement: ElementRef) {
        super(containerElement);
        this.setPreInitConfig();
    }

    ngOnInit() {
        this.gridRef.emit(this);
        this.setDefaultCellRenderer();
        SoftpakGridHelper.rearrangeGridColumns(this.attrColumns);

        // grid refresh method call is needed as after logout and login again, if the screen loaded has grid that has some custom rendering defined will not be rendered
        // properly and that's why this refresh grid method is required to call.
        //this.refresh();
    }

    hidevalidationpopups() {
        this.host.jqxGrid('hidevalidationpopups');
    }

    private setPreInitConfig() {
        this.attrColumnsmenu = false;
        this.attrTheme = 'blueleaf';
        this.attrAltrows = true;
        this.attrColumnsresize = true;
        this.attrWidth = '100%';
        this.attrColumnsresize = false;
        this.attrEnabletooltips = true;
        this.attrSortable = true;
        this.attrSelectionmode = 'none';
        this.attrColumnsheight = 46;
    }

    private setDefaultCellRenderer() {
        this.attrColumns.forEach((c) => {

            if (c.align == undefined)
                c.align = "center"; // set Header alignment to Center by default

            if (c.cellsrenderer == undefined) {
                let datafield = this.attrSource['_source'].datafields.find((field) => {
                    return field.name === c.datafield;
                });
                c.cellsrenderer = (datafield) ? defaultCellRenderer.bind(null, datafield.type) : c.cellsrenderer;
            }

            if (c.renderer == undefined)
            {
                c.renderer = columnHeaderRenderer;
            }
        });
    }
}
