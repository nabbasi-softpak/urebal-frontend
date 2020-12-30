import {SoftpakGridComponent} from "../../shared/jqwidgets/jqx-grid/softpak-grid.component";
import GridColumn = jqwidgets.GridColumn;
import {MMItemType} from "../model.data-types";
import {
    cellClassName, cellEndEdit,
    createDeleteBtnWidget,
    initWidget, securityIdCellRenderer, securityNameCellRenderer,
    targetAggregateRenderer
} from "../model.datasource";
import {CompositeModelComponent} from "./composite-model.component";
import {URebalUtil} from "../../shared/util/URebalUtil";
import {SoftpakGridHelper} from "../../shared/jqwidgets/jqx-grid/softpak-grid.helper";
import {
    compositeModelEditGridColsMeta,
    compositeModelSubModelGridColsMeta
} from "../../shared/classes/grid-columns.metadata.container";

export const addEditableGridColumnClass = (row, columnfield, value, defaulthtml, columnproperties, rowdata) => {
    if (rowdata.type == MMItemType.SECURITY || columnfield == 'target') {
        return $(defaulthtml).addClass('editable-input-column').prop("outerHTML");
    } else {
        return $(defaulthtml).addClass('').prop("outerHTML");
    }
};

export const showModelDetailColumns = (): GridColumn => {
    let data = [{
        text: 'Security ID',
        datafield: 'securityId',
        width: '10%',
        align: 'center'
    }, {
        text: 'Security Name',
        datafield: 'tickerName',
        width: '35%',
        align: 'center'
    }, {
        text: 'Type',
        datafield: 'securityType',
        width: '10%',
        editable: false,
        align: 'center'
    }, {
        text: 'PAC',
        datafield: 'primaryAssetClass',
        width: '15%',
        editable: false,
        align: 'center'
    }, {
        text: 'Target %',
        datafield: 'target',
        width: '10%',
        cellsformat: 'F3',
        align: 'center'
    }, {
        text: 'Min %',
        datafield: 'min',
        width: '10%',
        cellsformat: 'F3',
        align: 'center'
    }, {
        text: 'Max %',
        datafield: 'max',
        editable: true,
        width: "10%",
        cellsformat: 'F3',
        align: 'center'
    }];

    SoftpakGridHelper.mergeGridColumnProperties(data, compositeModelSubModelGridColsMeta);
    return data;
};

export const columnsModelEdit = (parentComponent: CompositeModelComponent, gridComponent: SoftpakGridComponent): GridColumn => {
    let data = [
        {
            text: '',
            datafield: 'type',
            width: '4%',
            editable: false,
            cellsrenderer: securityIdCellRenderer,
            cellclassname: cellClassName(),
            align: 'center'
        }, {
            text: 'Name',
            datafield: 'name',
            width: '23%',
            editable: false,
            cellsrenderer: securityNameCellRenderer,
            cellclassname: cellClassName(),
            align: 'center'
        },
        {
            text: 'Security ID',
            datafield: 'securityId',
            width: '10%',
            editable: false,
            cellclassname: cellClassName(),
            align: 'center'
        },
        {
            text: 'Security Type',
            datafield: 'securityType',
            width: '15%',
            editable: false,
            cellclassname: cellClassName(),
            align: 'center'
        },
        {
            text: 'PAC',
            datafield: 'primaryAssetClass',
            width: '15%',
            editable: false,
            cellclassname: cellClassName(),
            align: 'center'
        }, {
            text: 'Target %',
            datafield: 'target',
            width: '9%',
            editable: true,
            aggregates: ['sum'],
            cellsrenderer: addEditableGridColumnClass,
            aggregatesrenderer: targetAggregateRenderer.bind(null, gridComponent),
            cellsformat: 'F3',
            cellclassname: URebalUtil.addJqxGridClassCellName("floating-number-three-decimals"),
            cellendedit: cellEndEdit.bind(null, gridComponent, parentComponent),
            align: 'center'
        }, {
            text: 'Min %',
            datafield: 'min',
            width: '9%',
            editable: true,
            cellbeginedit: isEditable.bind(null, gridComponent),
            cellsrenderer: addEditableGridColumnClass,
            cellsformat: 'F3',
            cellclassname: URebalUtil.addJqxGridClassCellName("floating-number-three-decimals"),
            cellendedit: cellEndEdit.bind(null, gridComponent, parentComponent),
            align: 'center'
        }, {
            text: 'Max %',
            datafield: 'max',
            editable: true,
            width: "9%",
            cellbeginedit: isEditable.bind(null, gridComponent),
            cellsrenderer: addEditableGridColumnClass,
            cellsformat: 'F3',
            cellclassname: URebalUtil.addJqxGridClassCellName("floating-number-three-decimals"),
            cellendedit: cellEndEdit.bind(null, gridComponent, parentComponent),
            align: 'center'
        }, {
            text: '',
            editable: false,
            width: "6%",
            resizable: true,
            align: 'center',
            columntype: 'button',
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

    SoftpakGridHelper.mergeGridColumnProperties(data, compositeModelEditGridColsMeta);

    return data;
};

const isEditable = (gridComponent: SoftpakGridComponent, row) => {
    const cell = gridComponent.getrowdata(row);
    return cell.type == MMItemType.SECURITY;
};
