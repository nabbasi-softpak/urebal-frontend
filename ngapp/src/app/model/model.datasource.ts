import {CompositeModelComponent} from "./composite-model/composite-model.component";
import {MMItemType} from "./model.data-types";
import {SoftpakGridComponent} from "../shared/jqwidgets/jqx-grid/softpak-grid.component";
import {formatNumberOrNull} from "../shared/util/HelperUtils";
import {SecurityModelComponent} from "./security-model/security-model.component";
import {ModelType} from "../shared/enums/ModelType.enum";

const warningIcon = `<i class="material-icons text-color-red" style="position: absolute; top:5px; right: 5px;">warning</i>`;

export const modelTypeImages = [
    {modelType: ModelType.Security_Model, imageName: 'pie_chart'},
    {modelType: ModelType.Asset_Allocation_Model, imageName: 'table_chart'},
    {modelType: ModelType.Model_Of_Model, imageName: 'group_work'}
];

export const modelTypePermissions = [
    { modelType: ModelType.Security_Model, permissionName: 'modelViewSecurityModel' },
    { modelType: ModelType.Asset_Allocation_Model, permissionName: 'modelViewAssetModel' },
    { modelType: ModelType.Model_Of_Model, permissionName: 'modelViewModelOfModel' }
];

export const targetAggregateRenderer = (gridComponent: SoftpakGridComponent, aggregates) => {
    // Note: Override min aggregate with target aggregates
    aggregates = gridComponent.getcolumnaggregateddata('target', ['sum']);

    let assign = 0;
    let remain = 100;
    let remainingColor = "";
    let targetColor = "";

    if (aggregates.sum) {
        assign = parseFloat(aggregates.sum || 0);
        remain = 100 - assign;
    }

    if (assign == 100) {
        remainingColor = '';
    } else {
        remainingColor = 'red';
    }

    if (assign < 0 || assign > 100) {
        targetColor = 'red';
    }

    return `<div class="slds-m-right--medium slds-m-top--small">
                <span style="color: ${targetColor}" class="slds-m-right--large">Total Target %: <b>${assign.toFixed(3)}</b></span>
                <span style="color: ${remainingColor}">Remaining Target %: <b>${remain.toFixed(3)}</b></span>
            </div>`;
};


export const cellClassName = (customClass?:any[]) => {
    return (row: number, columnfield: any, value: number, rowdata) => {
        let classNames = [];

        if (customClass !== undefined && customClass.length > 0) {
            classNames = classNames.concat(customClass)
        }

        if (rowdata.invalid) {
            classNames.push('warning-row');
        }

        return classNames.join(" ");
    }
};

export const securityValidation = (rowData) => {
    const targetValue = parseFloat(rowData['target']);
    const minValue = parseFloat(rowData['min']);
    const maxValue = parseFloat(rowData['max']);

    if (targetValue < 0 || minValue < 0 || maxValue < 0) {
        return {message: 'Value cannot be less than 0%', valid: false};
    } else if (targetValue > 100 || minValue > 100 || maxValue > 100) {
        return {message: 'Value cannot be greater than 100%', valid: false};
    } else if (rowData.type == MMItemType.MODEL) {
        // if row type is model instead of security then ignore other validations.
    } else if (targetValue < minValue || targetValue > maxValue) {
        return {message: 'Target (%) cannot be less than Min (%) or greater than Max (%)', valid: false};
    } else if (minValue > targetValue || minValue > maxValue) {
        return {message: 'Min (%) cannot be greater than Target (%) or Max (%)', valid: false};
    } else if (maxValue < targetValue || maxValue < minValue) {
        return {message: 'Max (%) cannot be less than Target (%) or Min (%)', valid: false};
    }

    return {valid: true}
};

export const createDeleteBtnWidget = (parentComponent, row: number, column: any, value: string, htmlElement: HTMLElement) => {
    let container = document.createElement('div');
    htmlElement.appendChild(container);

    const btnHtml = `<div style="width: 100%; height: 100%; text-align: center">
                        <button title="Remove" 
                            class="slds-button slds-button--icon-border urebal-grid-button">
                                <i class="material-icons">remove</i>
                        </button></div>`;
    let btn = $(btnHtml);

    btn.on("click", (event) => {
        parentComponent.deleteSecurity(row['boundindex'])
    });

    $(container).append(btn);
};

export const initWidget = (row: number, column: any, value: any, htmlElement: HTMLElement): void => {
};

export const handleGridKeyboardNavigation = (parentComponent: CompositeModelComponent, gridComponent: SoftpakGridComponent, event) => {
    // PURPOSE: This method handle keyboard navigation on grid initially written for Security Model Edit Grid.
    // WORKING: When user press tab it should be moved to next editable datafield in same row or next row. If user
    //          press shift tab it should be moved to previous editable datafield in same row or previous row.
    // NOTE: This implementation is jqxgrid specific.

    let firstDatafield = 'min'; // when shift tab is pressed on this datafield move to previous row.
    let lastDatafield = 'max';  // when tab is press on this datafield, move to next.

    let key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
    if (key == 13) { // enter
        let cell = gridComponent.getselectedcell();
        if (!cell) return true; // no selected cell

        gridComponent.endcelledit(cell.rowindex, cell.datafield, false);
        gridComponent.clearselection();

    } else if (key == 9) { // tab
        let cell = gridComponent.getselectedcell();
        let {rowindex, datafield} = cell;
        const rowData = gridComponent.getrowdata(rowindex);
        const totalGridRows = gridComponent.getrows().length - 1;

        let prevRowData = null;
        if (rowindex > 0) {
            prevRowData = gridComponent.getrowdata(rowindex - 1);
        } else {
            prevRowData = gridComponent.getrowdata(totalGridRows);
        }

        if (event.shiftKey) {
            // Tab + Shift = Move in reverse order
            if (datafield == firstDatafield) {

                const dataField = prevRowData.type == MMItemType.MODEL ? firstDatafield : lastDatafield;

                if (rowindex > 0) { // select target of next row
                    gridComponent.selectcell(rowindex - 1, dataField);
                } else { // select target of first row
                    gridComponent.selectcell(totalGridRows, dataField);
                }
            } else {
                const currentColumnIndex = gridComponent.getcolumnindex(datafield);
                const nextColumnDataField = gridComponent.getcolumnat(currentColumnIndex - 1).datafield;

                gridComponent.selectcell(rowindex, nextColumnDataField);
            }
        } else {
            // Tab = Move forward
            if (datafield == lastDatafield || (datafield == firstDatafield && rowData.type == MMItemType.MODEL)) {
                if (rowindex < totalGridRows) { // select target of next row
                    gridComponent.selectcell(rowindex + 1, firstDatafield);
                } else { // select target of first row
                    gridComponent.selectcell(0, firstDatafield);
                }
            } else {
                const currentColumnIndex = gridComponent.getcolumnindex(datafield);
                const nextColumnDataField = gridComponent.getcolumnat(currentColumnIndex + 1).datafield;

                gridComponent.selectcell(rowindex, nextColumnDataField);
            }
        }

        return true;
    }
};

export const calculateTotalTarget = (gridComponent) => {
    let securities = gridComponent.getrows();
    let totalTarget = 0;
    for (let security of securities) {
        totalTarget += parseFloat(formatNumberOrNull(security.target) || 0);
    }

    return totalTarget;
};


export const sourceModelEdit: any = {
    datatype: 'array',
    datafields: [
        {name: 'min', type: 'number'},
        {name: 'target', type: 'number'},
        {name: 'max', type: 'number'},
        {name: 'securityId', type: 'string'},
        {name: 'tickerName', type: 'string'},
        {name: 'securityType', type: 'string'},
        {name: 'primaryAssetClass', type: 'string'},
        {name: '', type: 'string'},
        {name: 'invalid', type: 'string'},
        {name: 'validationMessage', type: 'string'},
    ],
    localdata: []
};

// This applies to Security and MM Grid
export const securityIdCellRenderer = (row, datafield, value, defaulthtml, columnproperties, rowdata) => {
    let element = $(defaulthtml);

    if (rowdata.type == MMItemType.MODEL) {
        element = element
            .prop('title', 'Model')
            .html(`<i class="material-icons softpak-grid-material-icon">pie_chart</i>`)
    } else if (rowdata.type == MMItemType.SECURITY) {
        element = element
            .prop('title', 'Security')
            .html(`<i class="material-icons softpak-grid-material-icon">monetization_on</i>`)
    } else if (rowdata.invalid) {
        const title = rowdata.validationMessage;
        element = element
            .prop('title', title)
            .prepend(warningIcon)
    } else if (rowdata.isPriceMiss) {
        const title = "Price is missing";
        element = element
            .prop('title', title)
            .prepend(warningIcon)
    } else if (rowdata.error) {
        const title = rowdata.error;
        element = element
            .prop('title', title)
            .prepend(warningIcon)
    }

    return element.prop("outerHTML");
};

export const securityNameCellRenderer = (row, columnfield, value, defaulthtml, columnproperties, rowdata) => {
    let element = $(defaulthtml);
    if (rowdata.type == MMItemType.MODEL) {
        element = element
            .html(`<a>${value}</a>`)
    }

    if (rowdata.invalid) {
        const title = rowdata.validationMessage;
        element = element
            .prop('title', title)
            .prepend(warningIcon)
    }

    return element.prop("outerHTML");
};

export const cellEndEdit = (gridComponent: SoftpakGridComponent, parentComponent: SecurityModelComponent, row: number, datafield: string, columntype: string, oldvalue: any, newvalue: any) => {
    // Call when Max/Min/Target edited
    const rowData = Object.assign({}, gridComponent.getrowdata(row)); // make deep copy, so value not affect grid's actual value
    rowData[datafield] = newvalue; // Note: Adding new value here for `securityValidation()` comparision.
    const validation = securityValidation(rowData);

    gridComponent.hidevalidationpopups();

    if (rowData.invalid == false && validation.valid == false) { // Show error for row once only.
        gridComponent.setcellvalue(row, 'validationMessage', validation.message);
        rowData.validationMessage = validation.message;
        gridComponent.showvalidationpopup(row, datafield, validation.message);
    } else if (rowData.valid) {
        gridComponent.setcellvalue(row, 'validationMessage', '');
    }

    gridComponent.setcellvalue(row, 'invalid', !validation.valid);
};
