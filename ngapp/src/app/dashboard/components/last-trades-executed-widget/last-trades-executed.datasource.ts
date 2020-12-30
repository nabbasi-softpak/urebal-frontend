import GridColumn = jqwidgets.GridColumn;
import {LastTradesExecutedComponent} from "./last-trades-executed.component";
import {LinkRenderer} from "../../../shared/jqwidgets/jqx-grid/softpak-grid-renderers";
import {URebalUtil} from "../../../shared/util/URebalUtil";
import {lastTradesExecutedWidgetGridColsMeta} from "../../../shared/classes/grid-columns.metadata.container";
import {SoftpakGridHelper} from "../../../shared/jqwidgets/jqx-grid/softpak-grid.helper";

export const rebalanceNameLinkRenderer = (component: LastTradesExecutedComponent, linkHandler, row, datafield, value, defaulthtml, columnproperties, rowdata) => {
    let linkURL = component.dashboardService.getAppContext() + `/secure/rebalances/executeRebalance/${encodeURIComponent(
        URebalUtil.encodeparams(rowdata.workspaceName))}`
    if (component.urebalPermissions.isAllowed('workspaceView')) {
        return LinkRenderer.call(this, component, linkHandler, linkURL, row, datafield, value, defaulthtml,
            columnproperties,
            rowdata);
    } else {
        return null;
    }
}

export const lastTradesWidgetGridDataSource = (): any => {
    return {
        localdata: [],
        datatype: 'array',
        datafields: [
            {name: "portfolioId", type: "number"},
            {name: "portfolioName", type: "link"},
            {name: "marketValue", type: "number"},
            {name: "isApproved", type: "number"},
            {name: "isApprovedValue", type: "string"},
            {name: "workspaceName", type: "string"},
            {name: "approvedTime", type: "date"}
        ],
    }
};


export const lastTradesWidgetGridCols = (component: LastTradesExecutedComponent): GridColumn[] => {
    let data = [
        {
            text: "Date",
            cellsalign: "center",
            datafield: "approvedTime",
            cellsformat: "MMM dd, yyyy hh:mm tt",
            width: "28%"
        },
        {
            text: "Rebalance Name",
            datafield: "workspaceName",
            width: "40%",
            cellsrenderer: rebalanceNameLinkRenderer.bind(null, component, component.rebalanceNameLinkHandler),
        },
        {
            text: "Status",
            datafield: "isApprovedValue",
            width: "14%"
        },
        {
            text: "Volume (USD)",
            datafield: "marketValue",
            width: "18%",
            cellsformat: "C0"
        }
    ]

    SoftpakGridHelper.mergeGridColumnProperties(data, lastTradesExecutedWidgetGridColsMeta)

    return data;
}