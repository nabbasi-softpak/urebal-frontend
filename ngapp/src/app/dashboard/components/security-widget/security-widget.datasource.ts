import GridColumn = jqwidgets.GridColumn;
import {securityWidgetGridColsMeta} from "../../../shared/classes/grid-columns.metadata.container";
import {SoftpakGridHelper} from "../../../shared/jqwidgets/jqx-grid/softpak-grid.helper";

export const securityWidgetGridDataSource = (): any => {
    return {
        localdata: [],
        datatype: 'array',
        datafields: [
            {name: "securityId", type: "string"},
            {name: "securityName", type: "string"},
            {name: "price", type: "number"},
            {name: "shares", type: "number"},
            {name: "marketValue", type: "number"},
            {name: "secType", type: "string"},
            {name: "firmId", type: "number"}
        ],
    }
};

export const securityWidgetGridCols = (): GridColumn[] => {
    let data = [
        {
            text: "Sec. ID",
            datafield: "securityId",
            cellsalign: "left",
            width: "12%"
        },
        {
            text: "Security Name",
            datafield: "securityName",
            cellsalign: "left",
            width: "28%"
        },
        {
            text: "Type",
            cellsalign: "left",
            datafield: "secType",
            width: "22%"
        },
        {
            text: "Price (USD)",
            datafield: "price",
            cellsalign: "right",
            width: "11%",
            cellsformat: "d2"
        },
        {
            text: "Shares",
            cellsalign: "right",
            datafield: "shares",
            width: "11%",
            cellsformat: "F0",
        },
        {
            text: "Market Value (USD)",
            cellsalign: "right",
            datafield: "marketValue",
            width: "16%",
            cellsformat: "d0"
        }
    ]

    SoftpakGridHelper.mergeGridColumnProperties(data, securityWidgetGridColsMeta);

    return data;
}