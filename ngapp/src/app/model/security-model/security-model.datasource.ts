import {SecurityModelComponent} from "./security-model.component";
import {SoftpakGridComponent} from "../../shared/jqwidgets/jqx-grid/softpak-grid.component";
import GridColumn = jqwidgets.GridColumn;

import {
    cellClassName,
    cellEndEdit,
    securityIdCellRenderer,
    targetAggregateRenderer
} from "../model.datasource";
import {SoftpakGridHelper} from "../../shared/jqwidgets/jqx-grid/softpak-grid.helper";
import {securityModelEditGridColsMeta} from "../../shared/classes/grid-columns.metadata.container";

export const addEditableGridColumnClass = (row, columnfield, value, defaulthtml, columnproperties, rowdata) => {
    return $(defaulthtml).addClass('editable-input-column').prop("outerHTML");
};


export const columnsModelEdit = (parentComponent: SecurityModelComponent, gridComponent: SoftpakGridComponent): GridColumn => {
    let data = [
        {
            text: 'Security ID',
            datafield: 'securityId',
            width: '10%',
            editable: false,
            cellsrenderer: securityIdCellRenderer,
            align: 'center',
            cellclassname: cellClassName()
        }, {
            text: 'Security Name',
            datafield: 'tickerName',
            width: '32%',
            editable: false,
            align: 'center',
            cellclassname: cellClassName()
        }, {
            text: 'Type',
            datafield: 'securityType',
            width: '10%',
            editable: false,
            align: 'center',
            cellclassname: cellClassName()
        }, {
            text: 'PAC',
            datafield: 'primaryAssetClass',
            width: '15%',
            editable: false,
            align: 'center',
            cellclassname: cellClassName()
        }, {
            text: 'Min %',
            datafield: 'min',
            width: '9%',
            editable: true,
            cellsrenderer: addEditableGridColumnClass,
            cellsformat: 'F3',
            align: 'center',
            cellclassname: cellClassName(["floating-number-three-decimals"]),
            cellendedit: cellEndEdit.bind(null, gridComponent, parentComponent),
            aggregatesrenderer: targetAggregateRenderer.bind(null, gridComponent)
        }, {
            text: 'Target %',
            datafield: 'target',
            width: '9%',
            editable: true,
            aggregates: ['sum'],
            cellsrenderer: addEditableGridColumnClass,
            cellsformat: 'F3',
            align: 'center',
            cellclassname: cellClassName(["floating-number-three-decimals"]),
            cellendedit: cellEndEdit.bind(null, gridComponent, parentComponent),
        }, {
            text: 'Max %',
            datafield: 'max',
            editable: true,
            width: "9%",
            cellsrenderer: addEditableGridColumnClass,
            cellsformat: 'F3',
            align: 'center',
            cellclassname: cellClassName(["floating-number-three-decimals"]),
            cellendedit: cellEndEdit.bind(null, gridComponent, parentComponent)
        }, {
            text: '',
            editable: false,
            width: "6%",
            align: 'center',
            columntype: 'button',
            cellclassname: cellClassName(),
            cellsrenderer: function() {
                return 'Remove';
            },
            buttonclick: (rowidx) => {
                parentComponent.deleteSecurity(rowidx);
            }
        }, {
            text: 'Invalid',
            datafield: 'invalid',
            hidden: true,
        }, {
            text: 'Validation Message',
            datafield: 'validationMessage',
            hidden: true,
        }
    ];

    SoftpakGridHelper.mergeGridColumnProperties(data, securityModelEditGridColsMeta);
    return data;
};
