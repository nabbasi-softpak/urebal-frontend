import GridColumn = jqwidgets.GridColumn;
import {TradeOverrideComponent} from "./tradeoverride.component";
import {SoftpakGridComponent} from "../../shared/jqwidgets/jqx-grid/softpak-grid.component";
import {appConfig, FirmConfig} from "../../shared/util/config";
import {URebalUtil} from "../../shared/util/URebalUtil";

const roundTradeShareCellRenderer = (parentComponent, gridComponent: SoftpakGridComponent, row, columnfield, value, defaulthtml, columnproperties, rowdata) => {
    let element = $(defaulthtml);
    let securityType = rowdata.securityType;

    if (row != undefined && columnproperties.editable && rowdata.ticker != appConfig.CASH && gridComponent.editable()) {

        if(isMutualFund(securityType)) {
            return element.addClass('editable-input-column-disabled').prop('outerHTML');
        }

        return element.addClass('editable-input-column').prop('outerHTML');
    }
};

const roundTradeDollarCellRenderer = (parentComponent, gridComponent: SoftpakGridComponent, row, columnfield, value, defaulthtml, columnproperties, rowdata) => {
    let element = $(defaulthtml);
    let securityType = rowdata.securityType;

    if (row != undefined && columnproperties.editable && rowdata.ticker != appConfig.CASH && gridComponent.editable()) {

        if(!isMutualFund(securityType)) {
            return element.addClass('editable-input-column-disabled').prop('outerHTML');
        }

        return element.addClass('editable-input-column').prop('outerHTML');
    }
};


const TransformColumns = (column, source) => {
    return column.map((key, index) => {
        let c = column[index];
        const datafield = column[index].datafield;
        let type = source.datafields.find((element) => element.name == datafield);
        type = type ? type.type : 'string';

        c['align'] = 'center';

        if (type == 'number') c['cellsalign'] = 'right';
        if (!c['editable']) c['editable'] = false;
        if (!c['cellclassname']) c['cellclassname'] = cellClassName;

        const originalRenderer = c['cellsrenderer'];
        c['cellsrenderer'] = (row, columnfield, value, defaulthtml, columnproperties, rowdata) => {
            if (row == undefined) {
                return filterAggregateLabels(defaulthtml);
            }

            if (originalRenderer) {
                return originalRenderer.call(this, row, columnfield, value, defaulthtml, columnproperties, rowdata)
            }
        };

        return c;
    });
};

export const securityIdCellRenderer = (row, columnfield, value, defaulthtml, columnproperties, rowdata) => {
    let element = $(defaulthtml);

    if (rowdata.warningMessage) {
        const warningIcon = `<i class="material-icons jqx-grid-cell-warning-icon">error_outline</i>`;
        element = element
        .prop('title', rowdata.warningMessage)
        .prepend(warningIcon);
    } else if (formatFloat(rowdata.roundOptPctWt) < 0) {
        const warningIcon = `<i class="material-icons jqx-grid-cell-error-icon">error_outline</i>`;
        element = element
        .prop('title', "Cash is negative.")
        .prepend(warningIcon);
    }

    return element.prop("outerHTML");
};

export const gridSource = {
    dataType: "json",
    datafields: [
        {"name": "id", "type": "number"},
        {"name": "accountId", "type": "string"},
        {"name": "accountNumber", "type": "string"},
        {"name": "securityName", "type": "string"},
        {"name": "equivalenceName", "type": "string"},
        {"name": "securityType", "type": "string"},
        {"name": "modelTargetPct", "type": "number"},
        {"name": "modelMinPct", "type": "number"},
        {"name": "modelMaxPct", "type": "number"},
        {"name": "targetShares", "type": "number"},
        {"name": "targetValue", "type": "number"},
        {"name": "adjustedTargetValue", "type": "number"},
        {"name": "adjustedTargetShares", "type": "number"},
        {"name": "action", "type": "string"},
        {"name": "comments", "type": "string"},
        {"name": "basisPrice", "type": "number"},
        {"name": "roundGainLossValue", "type": "number"},
        {"name": "initValue", "type": "number"},
        {"name": "initPercent", "type": "number"},
        {"name": "initShares", "type": "number"},
        {"name": "price", "type": "number"},
        {"name": "optValue", "type": "number"},
        {"name": "optPctWt", "type": "number"},
        {"name": "roundOptPctWt", "type": "number"},
        {"name": "proposedShares", "type": "number"},
        {"name": "roundOptShares", "type": "number"},
        {"name": "roundOptValue", "type": "number"},
        {"name": "purchaseDate", "type": "date"},
        {"name": "roundTaxCostValue", "type": "number"},
        {"name": "roundTradeValue", "type": "number"},
        {"name": "roundTradePercent", "type": "number"},
        {"name": "roundTradeShares", "type": "number"},
        {"name": "taxCostValue", "type": "number"},
        {"name": "taxRate", "type": "number"},
        {"name": "ticker", "type": "string"},
        {"name": "tradeValue", "type": "number"},
        {"name": "tradePercent", "type": "number"},
        {"name": "tradeShares", "type": "number"},
        {"name": "adjustedMinPct", "type": "number"},
        {"name": "adjustedMaxPct", "type": "number"},
        {"name": "adjustedTargetPct", "type": "number"},
        {"name": "restrictedMinPct", "type": "number"},
        {"name": "restrictedMaxPct", "type": "number"},
        {"name": "roundTradeValueClone", "type": "number"},
        {"name": "roundTradeSharesClone", "type": "number"},
        {"name": "roundOptPctWtClone", "type": "number"},
        {"name": "roundOptSharesClone", "type": "number"},
        {"name": "shareLotId", "type": "string"},
        {"name": "workflowId", "type": "number"},
        {"name": "children", "type": "array"},
        {"name": "marketValue", "type": "number"},
        {"name": "sl", "type": "string"},
        {"name": "edited", "type": "bool"},
        {"name": "warningMessage", "type": "string"},
    ],
    localdata: []
};

const columnHeaderRenderer = (defaultText, alignment, height) => {
    return `<div style="text-align: center; margin: 1px 0 0 0px;  position: absolute;  top: 50%;  left: 50%;  -ms-transform: translate(-50%, -50%);  transform: translate(-50%, -50%);">${defaultText}</div>`;
};


const columnAccountNumberHeaderRenderer = (defaultText, alignment, height) => {
  return `<div style="text-align: center; margin: 1px 0 0 0px;  position: absolute;  top: 50%;  left: 50%;  -ms-transform: translate(-50%, -50%);  transform: translate(-50%, -50%);">Account No.</div>`;
};

const tradeTypeCellRenderer = (parentComponent, gridComponent, row?: number, columnfield?: string, value?: any, defaulthtml?: string, columnproperties?: any, rowdata?: any) => {
    let val : string = value.replace("Zero Trade", appConfig.DASH_FOR_EMPTY);
    let imgAction = "";
    if(val.toLowerCase() == "buy" || val.toLowerCase() == "sell"){
        //imgAction = `<img src="${parentComponent.appComponentContext}/assets/images/blueleaf/${val.toLowerCase() == 'buy' ? 'icon-arrow-up.svg' : 'icon-arrow-down.svg'}">`
        let icon = (val.toLowerCase() == 'buy') ? 'north' : 'south';
        let iconColor = (val.toLowerCase() == 'buy') ? '#529322' : '#C90303';
        imgAction = `<i class="material-icons " style="font-size: 20px; font-weight: 500; position: absolute; top: 7px;
                        left: 28px; color: ${iconColor}">${icon}</i>`
    }

    return  `<div class="jqx-grid-cell-left-align" style="margin-top: 7.5px; 
                text-align: ${columnproperties.cellsalign}; padding-right: 5px;">
                ${imgAction}
                ${val}
              </div>`;
};
const defaultCellsRenderer = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
    if (!value) {
        return `<div class="jqx-grid-cell-left-align" style="margin-top: 7.5px; text-align: ${columnproperties.cellsalign}; padding-right: 5px;">${appConfig.DASH_FOR_EMPTY}</div>`;
    }
};

const formatFloat = (value) => {
    if (isNaN(parseFloat(value))) return NaN;
    return parseFloat(parseFloat(value).toFixed(6));
};

const cellClassName = (row: number, columnfield: any, value: number, rowdata) => {
    const classNames = [];

    if (parseFloat(rowdata.roundTradeShares) != parseFloat(rowdata.roundTradeSharesClone)) {
        classNames.push('edited-row');

        // When trade set to zero
        if (formatFloat(rowdata.roundTradeValue) == 0) {
            classNames.push('delete-trade-row');
        }
    }
    if (formatFloat(rowdata.roundOptPctWt) < 0) {
        // Cash is negative error
        classNames.push('delete-trade-row');
    }

    // cell value color
    if (formatFloat(value) < 0) {
        classNames.push('jqx-grid-cell-red-color');
    }
    if (rowdata.ticker == appConfig.CASH) {
        classNames.push('cash-row');
    }

    return classNames.join(" ");
};

const filterAggregateLabels = (defaulthtml) => {
    return defaulthtml.replace(/(Min|Max|Sum|Trade Type):/gi, '')
};

const numberCellRenderer = (row, columnfield, value, defaulthtml, columnproperties, rowdata) => {
    if (row == undefined) {
        return filterAggregateLabels(defaulthtml);
    }

    let modifyValue;
    const numericValue = parseFloat(value);

    if (numericValue >= 0)
        modifyValue = jqx.dataFormat.formatnumber(numericValue, columnproperties.cellsformat);
    else if (numericValue < 0) {
        let formatValue = jqx.dataFormat.formatnumber(Math.abs(numericValue), columnproperties.cellsformat);
        if (columnproperties.cellsformat.charAt(0) == 'c') // process currency cell
        {
            // Assumption: Currency will be first character.
            const currencySign = formatValue.charAt(0);
            const currencyValue = parseFloat(formatValue.substr(1));
            modifyValue = currencySign + "(" + currencyValue + ")";
        } else {
            modifyValue = "(" + formatValue + ")";
        }
    } else
        modifyValue = appConfig.DASH_FOR_EMPTY;

    return $(defaulthtml).html(modifyValue).prop('outerHTML');
};

export const gridColumns = (parentComponent, gridComponent): GridColumn[] => {
    let data = TransformColumns([
        {
            text: 'Ticker',
            minWidth: '100',
            pinned: true,
            datafield: 'ticker',
            cellsrenderer: securityIdCellRenderer,
            renderer: columnHeaderRenderer,
        },
        {
            text: 'Action',
            minWidth: '120',
            datafield: 'action',
            cellsrenderer: tradeTypeCellRenderer.bind(null, parentComponent, gridComponent),
            renderer: columnHeaderRenderer,
        },
        {
            text: 'Round Trade<br> Shares',
            editable: true,
            minWidth: '120',
            maxWidth: '150',
            cellsformat: 'd2',
            datafield: 'roundTradeShares',
            cellbeginedit: tradeSharesCellBeginEdit.bind(null, parentComponent, gridComponent),
            cellendedit: tradeSharesCellEndEdit.bind(null, parentComponent, gridComponent),
            validation: tradeSharesValidation.bind(null, parentComponent, gridComponent),
            cellsrenderer: roundTradeShareCellRenderer.bind(null, parentComponent, gridComponent),
            cellclassname: URebalUtil.addJqxGridClassCellName("floating-number-two-decimals"),
            aggregates: ['sum'],
            cellvaluechanging: tradeSharesValueChanging.bind(null, parentComponent, gridComponent),
            renderer: columnHeaderRenderer,
        },
        {
            text: 'Round<br>Trade $',
            minWidth: '120',
            maxWidth: '150',
            cellsformat: 'd2',
            datafield: 'roundTradeValue',
            renderer: columnHeaderRenderer,
            aggregates: ['sum'],
            editable: true,
            cellbeginedit: tradeSharesDollarCellBeginEdit.bind(null, parentComponent, gridComponent),
            cellendedit: tradeSharesCellEndEdit.bind(null, parentComponent, gridComponent),
            validation: tradeDollarValidation.bind(null, parentComponent, gridComponent),
            cellsrenderer: roundTradeDollarCellRenderer.bind(null, parentComponent, gridComponent),
            cellclassname: URebalUtil.addJqxGridClassCellName("floating-number-two-decimals"),
            cellvaluechanging: tradeSharesValueChanging.bind(null, parentComponent, gridComponent),
        },
        {
            text: 'Actual %',
            minWidth: '145',
            align: 'center',
            cellsformat: 'd2',
            datafield: 'initPercent',
            aggregates: ['sum'],
            renderer: columnHeaderRenderer,
            hidden: true
        },
        {
            text: 'Proposed %',
            minWidth: '145',
            align: 'center',
            cellsformat: 'd2',
            datafield: 'optPctWt',
            cellsrenderer: numberCellRenderer,
            aggregates: ['sum'],
            hidden: true
        },
        {
            text: "Target %",
            datafield: "modelTargetPct",
            cellsformat: "d2",
            minWidth: "145",
            renderer: columnHeaderRenderer,
            hidden: true
        },
        {
          text: 'Comments',
          minWidth: '120',
          datafield: 'comments',
          cellsrenderer: defaultCellsRenderer,
          renderer: columnHeaderRenderer,
          hidden: true
        },
        {
            text: 'Round<br>Proposed $',
            minWidth: '120',
            cellsformat: 'd2',
            datafield: 'roundOptValue',
            renderer: columnHeaderRenderer,
            cellsrenderer: numberCellRenderer,
            aggregates: ['sum'],
            hidden: true
        },
        {
            text: 'Actual<br>Shares',
            minWidth: '120',
            cellsformat: 'd2',
            datafield: 'initShares',
            renderer: columnHeaderRenderer,
            cellsrenderer: numberCellRenderer,
            aggregates: ['sum'],
            hidden: true
        },
        {
            text: 'Round<br>Proposed %',
            minWidth: '120',
            cellsformat: 'd2',
            datafield: 'roundOptPctWt',
            renderer: columnHeaderRenderer,
            cellsrenderer: numberCellRenderer,
            aggregates: ['sum'],
            hidden: true
        },
        {
            text: 'Round Proposed<br>Shares',
            minWidth: '140',
            cellsformat: 'd2',
            datafield: 'roundOptShares',
            renderer: columnHeaderRenderer,
            cellsrenderer: numberCellRenderer,
            aggregates: ['sum'],
            hidden: true
        },
        {
            text: 'Target Shares',
            minWidth: '120',
            cellsformat: 'd2',
            datafield: 'targetShares',
            renderer: columnHeaderRenderer,
            cellsrenderer: numberCellRenderer,
            aggregates: ['sum'],
            hidden: true
        },
        {
            text: 'Proposed Shares',
            minWidth: '140',
            cellsformat: 'd2',
            datafield: 'proposedShares',
            renderer: columnHeaderRenderer,
            cellsrenderer: numberCellRenderer,
            aggregates: ['sum'],
            hidden: true
        },
        {
            text: 'Adjusted Min %',
            minWidth: '140',
            cellsformat: 'd2',
            datafield: 'adjustedMinPct',
            renderer: columnHeaderRenderer,
            aggregates: ['max'],
            hidden: true
        },
        {
            text: 'Adjusted Target %',
            minWidth: '145',
            cellsformat: 'd2',
            datafield: 'adjustedTargetPct',
            hidden: true,
            renderer: columnHeaderRenderer,
            aggregates: ['max'],
        },
        {
            text: 'Adjusted Max %',
            minWidth: '140',
            cellsformat: 'd2',
            datafield: 'adjustedMaxPct',
            renderer: columnHeaderRenderer,
            aggregates: ['max'],
            hidden: true
        },
        {
            text: 'Trade Shares',
            editable: false,
            minWidth: '120',
            cellsformat: 'd2',
            datafield: 'tradeShares',
            renderer: columnHeaderRenderer,
            cellsrenderer: numberCellRenderer,
            aggregates: ['sum'],
            hidden: true
        },
        {
            text: 'Trade $',
            minWidth: '120',
            cellsformat: 'd2',
            datafield: 'tradeValue',
            hidden: true,
            renderer: columnHeaderRenderer,
            cellsrenderer: numberCellRenderer,
            aggregates: ['sum'],
        },
        {
            text: 'Trade %',
            minWidth: '100',
            align: 'center',
            cellsformat: 'd2',
            datafield: 'tradePercent',
            cellsrenderer: numberCellRenderer,
            aggregates: ['sum'],
            hidden: true
        },
        {
            text: 'Actual $',
            minWidth: '120',
            cellsformat: 'd2',
            datafield: 'initValue',
            hidden: true,
            renderer: columnHeaderRenderer,
            cellsrenderer: numberCellRenderer,
            aggregates: ['sum'],
        },
        {
            text: 'Target $',
            minWidth: '120',
            cellsformat: 'd2',
            datafield: 'targetValue',
            hidden: true,
            renderer: columnHeaderRenderer,
            cellsrenderer: numberCellRenderer,
            aggregates: ['sum'],
        },
        {
            text: 'Proposed $',
            minWidth: '140',
            cellsformat: 'd2',
            datafield: 'optValue',
            hidden: true,
            renderer: columnHeaderRenderer,
            cellsrenderer: numberCellRenderer,
            aggregates: ['sum'],
        },
        {
            text: 'Round Trade %',
            minWidth: '140',
            cellsformat: 'd2',
            datafield: 'roundTradePercent',
            renderer: columnHeaderRenderer,
            cellsrenderer: numberCellRenderer,
            aggregates: ['sum'],
            hidden: true
        },
        {
            text: 'Restricted Min %',
            minWidth: '140',
            cellsformat: 'd2',
            datafield: 'restrictedMinPct',
            hidden: true,
            renderer: columnHeaderRenderer,
            aggregates: ['max'],
        },
        {
            text: 'Restricted Max %',
            minWidth: '140',
            cellsformat: 'd2',
            datafield: 'restrictedMaxPct',
            hidden: true,
            renderer: columnHeaderRenderer,
            aggregates: ['max'],
        },
        {
            text: "Min %",
            datafield: "modelMinPct",
            cellsformat: "d2",
            minWidth: "100",
            hidden: true,
            renderer: columnHeaderRenderer,
        },
        {
            text: "Max %",
            datafield: "modelMaxPct",
            cellsformat: "d2",
            minWidth: "100",
            hidden: true,
            renderer: columnHeaderRenderer,
        },
        {
            text: "Adjusted Target<br>Shares",
            datafield: "adjustedTargetShares",
            cellsformat: "d2",
            minWidth: "140",
            hidden: true,
            renderer: columnHeaderRenderer,
        },
        {
            text: "Adjusted<br>Target $",
            datafield: "adjustedTargetValue",
            cellsformat: "d2",
            minWidth: "140",
            hidden: true,
            renderer: columnHeaderRenderer,
        }
    ], gridSource);

    //console.log(data);
    //SoftpakGridHelper.mergeGridColumnProperties(data, editTradeGridColsMeta);

    return data;
};

export const filterData: any[] = [
    {
        name: "Show All Rows",
        rule: ["ticker", "!=", ""] // Show all
    }, {
        name: "Actual",
        rule: ["initShares", ">", 0]
    }, {
        name: "Final",
        rule: ["optValue", ">", 0]
    }, {
        name: "Trades Only",
        rule: ["roundTradeShares", ">", 0]
    }, {
        name: "Buys Only",
        rule: ["action", "==", "Buy"]
    }, {
        name: "Sells Only",
        rule: ["action", "==", "Sell"]
    }, {
        name: "Sells at Gains",
        rule: ["roundGainLossValue", ">", 0]
    }, {
        name: "Sells at Losses",
        rule: ["roundGainLossValue", "<", 0]
    }, {
        name: "Show Edited",
        rule: ["edited", "==", "true"]
    }
];

export const groupByData = [{
    name: 'None',
    datafield: []
}, {
    name: 'Account Number',
    datafield: ['accountNumber']
}, {
    name: 'Ticker',
    datafield: ['ticker']
}];


export const tradeFileFormatList = [
    // {display: 'Apex Financial', value: '<ENTER_VALUE_HERE>', code: 'Apex Financial'},
    // {display: 'Assetmark', value: '<ENTER_VALUE_HERE>', code: 'Assetmark'},
    {display: 'Charles Schwab', value: '130', code: 'Charles Schwab -Direct'},//XML format based implementation of the format
    {display: 'Fidelity', value: '100', code: 'Fidelity WealthCentral (Investment)'},
    // {display: 'First Clearing', value: '<ENTER_VALUE_HERE>', code: 'First Clearing'},
    // {display: 'Foliofn', value: '<ENTER_VALUE_HERE>', code: 'Foliofn Investments Advisor (Investment)'},
    // {display: 'Hilltop Securities', value: '<ENTER_VALUE_HERE>', code: 'Hilltop Securities'},
    // {display: 'Interactive Brokers', value: '<ENTER_VALUE_HERE>', code: 'Interactive Brokers (Investment)'},
    // {display: 'NFS (Streetscape)', value: '<ENTER_VALUE_HERE>', code: 'National Financial Services (Streetscape)'},
     {display: 'Pershing', value: '110', code: 'Pershing InfoDirect'},
    // Note: value:'120' is reserved for pershing_mf called internally when pershing is selected
    // {display: 'Raymond James', value: '<ENTER_VALUE_HERE>', code: 'Raymond James'},
    // {display: 'SEI', value: '<ENTER_VALUE_HERE>', code: 'SEI Business Builder'},
    // {display: 'TCAccess', value: '<ENTER_VALUE_HERE>', code: 'Trust Company of America TCAccess'},
    {display: 'TD Ameritrade', value: '20', code: 'TD Ameritrade Institutional Services'}

];


export const tradeSharesValidation = (parentComponent, gridComponent, datafield, value) => {
    let rowData = gridComponent.getrowdata(datafield.row);
    const cellValue = parseFloat(value);
    let returnData: any = null;


    if (cellValue < 0) {
        returnData = {message: 'Trade Shares cannot be less than 0', result: false};
    } else if (cellValue > parseFloat(rowData.initShares.toFixed(2)) && rowData.initShares != 0 && ['Sell',
        'Zero Trade'].indexOf(rowData.action) != -1) {
        returnData = {message: 'Trade Shares cannot be greater than Initial Shares', result: false};
    } else if (rowData.action == 'Zero Trade' && cellValue > 0) {
        const accountName = rowData.ticker;
        const accountSecurities = parentComponent.gridData.keepOriginalData.filter((item) => {
            return item.accountId == rowData.accountId && item.ticker == rowData.ticker && item.action != 'Zero Trade';
        });

        let accountSecurityAction = 'Zero Trade';
        if (accountSecurities.length > 0) {
            accountSecurityAction = accountSecurities[0].action;

            if (rowData.initShares > 0 && accountSecurityAction == 'Buy') {
                returnData = {message: `Security ${accountName} has "Buy" trades.`, result: false};
            } else if (rowData.initShares == 0 && accountSecurityAction == 'Sell') {
                returnData = {message: `Security ${accountName} has "Sell" trades.`, result: false};
            }
        }
    }

    if (returnData) {
        parentComponent.isValidForm = false;
    } else {
        parentComponent.isValidForm = true;
        returnData = parentComponent.isValidForm;
    }

    parentComponent.ref.detectChanges(); // Enable disable save button
    return returnData;
};

export const tradeDollarValidation = (parentComponent, gridComponent, datafield, value) => {
    let rowData = gridComponent.getrowdata(datafield.row);
    const cellValue = parseFloat(value);
    let returnData: any = null;


    if (cellValue < 0) {
        returnData = {message: 'Trade $ cannot be less than 0', result: false};
    } else if (cellValue > parseFloat(rowData.initValue.toFixed(2)) && rowData.initValue != 0 && ['Sell',
        'Zero Trade'].indexOf(rowData.action) != -1) {
        returnData = {message: 'Trade $ cannot be greater than Actual $', result: false};
    } else if (rowData.action == 'Zero Trade' && cellValue > 0) {
        const accountName = rowData.ticker;
        const accountSecurities = parentComponent.gridData.keepOriginalData.filter((item) => {
            return item.accountId == rowData.accountId && item.ticker == rowData.ticker && item.action != 'Zero Trade';
        });

        let accountSecurityAction = 'Zero Trade';
        if (accountSecurities.length > 0) {
            accountSecurityAction = accountSecurities[0].action;

            if (rowData.initValue > 0 && accountSecurityAction == 'Buy') {
                returnData = {message: `Security ${accountName} has "Buy" trades.`, result: false};
            } else if (rowData.initValue == 0 && accountSecurityAction == 'Sell') {
                returnData = {message: `Security ${accountName} has "Sell" trades.`, result: false};
            }
        }
    }

    if (returnData) {
        parentComponent.isValidForm = false;
    } else {
        parentComponent.isValidForm = true;
        returnData = parentComponent.isValidForm;
    }

    parentComponent.ref.detectChanges(); // Enable disable save button
    return returnData;
};

const isMutualFund = (securityType) => {
    securityType = securityType.trim();
    const mutualFunds = ["Mutual Fund", "Mutual Funds", "mutualFund", "mutualFunds"];

    for (let idx in mutualFunds) {
        if (securityType.toUpperCase() == mutualFunds[idx].toUpperCase())
            return true;
    }

    return false;
};

export const tradeSharesCellBeginEdit = (parentComponent, gridComponent, row, datafield, columntype, oldvalue, newvalue) => {
    const rowData = gridComponent.getrowdata(row);
    let securityType = rowData.securityType;

    // Cash and Mutual Funds row should not be editable
    return rowData.ticker != appConfig.CASH && !isMutualFund(securityType);
};

export const tradeSharesDollarCellBeginEdit = (parentComponent, gridComponent, row, datafield, columntype, oldvalue, newvalue) => {
    const rowData = gridComponent.getrowdata(row);
    let securityType = rowData.securityType;

    // Cash should not be editable. Only Mutual funds should be editable
    return rowData.ticker != appConfig.CASH && isMutualFund(securityType);
};

export const tradeSharesCellEndEdit = (parentComponent: TradeOverrideComponent, gridComponent: SoftpakGridComponent, row, datafield, columntype, oldvalue, newvalue) => {
    const rowData = gridComponent.getrowdata(row);

    if (newvalue != oldvalue) {
        parentComponent.editTrades({
            row: row,
            rowData: rowData,
            changeValue: newvalue - oldvalue
        }, datafield);
    }

    return true;
};

export const tradeSharesValueChanging = (parentComponent: TradeOverrideComponent, gridComponent: SoftpakGridComponent, row: number, datafield: string, columntype: any, oldvalue: any, newvalue: any) => {
    const rowData = gridComponent.getrowdata(row);
    if (isNaN(parseFloat(newvalue))) {
        let cloneValue = parseFloat(rowData[datafield + 'Clone']).toString();
        return cloneValue;
    }
};
