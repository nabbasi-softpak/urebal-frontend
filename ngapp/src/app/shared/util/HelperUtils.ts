import {appConfig} from "./config";
import {AppConfig} from "../../../app.config";

export const formatNumberOrNull = (value) => {
    if (isNumeric(value)) {
        return value.toFixed(3);
    }
    return '';
};

export const isNumeric = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

export const sortByKey = (data, key) => {
    return data.sort((a, b) => {
        const valueA = a[key].toLowerCase();
        const valueB = b[key].toLowerCase();

        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
    });
};


export const sortBySystemPACOrder = (data, key) => {
    // Sort array according to PAC_SORT_ORDER, then sort remaining in ascending order and concat them at end.
    let pacOrder: any[] = appConfig.PAC_SORT_ORDER.map((item) => item.toLowerCase());

    return data.filter(item => pacOrder.indexOf(item[key].toLowerCase()) > -1).sort((a, b) => {
        const indexA = pacOrder.indexOf(a[key].toLowerCase());
        const indexB = pacOrder.indexOf(b[key].toLowerCase());

        return indexA - indexB;
    }).concat(
        sortByKey(data.filter(item => pacOrder.indexOf(item[key].toLowerCase()) == -1), 'name')
    );
};

export const dateTimeCellsRenderer = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
    //Handling for empty string that cause "Invalid Date" exception if empty string passes into Date().
    if (value === "") {
        return `<div class="jqx-grid-cell-left-align" style="margin-top: 7.5px; text-align: ${columnproperties.cellsalign}">${this.DASH_FOR_EMPTY}</div>`;
    }

    let date = new Date(value);
    let fomattedDate = jqx.dataFormat.formatdate(date, AppConfig.DATETIME_FORMAT);
    return `<div title="${fomattedDate}" style="overflow: hidden; height: 100%; padding-top: 10px;  padding-right: 5px; text-overflow: ellipsis; white-space: nowrap; text-align: ${columnproperties.cellsalign}">${fomattedDate}</div>`;
};