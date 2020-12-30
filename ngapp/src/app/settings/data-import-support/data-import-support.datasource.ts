import {SoftpakGridComponent} from "../../shared/jqwidgets/jqx-grid/softpak-grid.component";

import GridColumn = jqwidgets.GridColumn;
import {DataImportSupportComponent} from "./data-import-support.component";
import {dateTimeCellsRenderer} from "../../shared/util/HelperUtils";

export const sourceSupportImport: any = {
    datatype: 'array',
    datafields: [
        {name: 'metaId', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'rebalanceDate', type: 'date'},
        {name: 'asOfDate', type: 'date'},
        {name: 'resolved', type: 'bool'}
    ],
    localdata: []
};

export const columnsSupportImport = (parentComponent: DataImportSupportComponent, gridComponent: SoftpakGridComponent): GridColumn => {
    let data = [
        {
            text: 'Meta ID',
            datafield: 'metaId',
            width: '10%',
            align: 'center',
        }, {
            text: 'Rebalance Name',
            datafield: 'name',
            width: '20%',
            align: 'center',
        }, {
            text: 'Account Name',
            datafield: 'description',
            width: '20%',
            align: 'center',
        }, {
            text: 'Rebalance Date',
            datafield: 'rebalanceDate',
            width: '15%',
            align: 'center',
            cellsrenderer: dateTimeCellsRenderer,
            cellsformat: 'dd-MMMM-yyyy',
        }, {
            text: 'Import Date',
            datafield: 'asOfDate',
            width: '15%',
            align: 'center',
            cellsrenderer: dateTimeCellsRenderer,
            cellsformat: 'dd-MMMM-yyyy',
        },  {
            text: 'Resolved',
            datafield: 'resolved',
            width: '20%',
            align: 'center',
            type: 'bool',
            cellsrenderer: (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
                console.log(rowdata);
                if (rowdata.resolved == true) {
                    return '<p style="margin-top: 5px; color: green; font-weight: bold;">Resolved</p>';
                } else {
                    return '<input style="margin-top: 3px;" type="button"  value="Mark as Resolved" (click)="clickGridMarkAsResolved($event)"/>';
                }

            },
        }
    ];

    return data;
};