import GridColumn = jqwidgets.GridColumn;
import {DriftreportSummaryWidgetComponent} from "./driftreport-summary-widget.component";
import {LinkRenderer, ImageRenderer} from "../../../shared/jqwidgets/jqx-grid/softpak-grid-renderers";
import {accountDriftWidgetGridColsMeta} from "../../../shared/classes/grid-columns.metadata.container";
import {SoftpakGridHelper} from "../../../shared/jqwidgets/jqx-grid/softpak-grid.helper";

const accountTypeImages = [
    {isHousehold: true, imageName: 'people', imageTitle: 'Household'},
    {isHousehold: false, imageName: 'person', imageTitle: 'Account'}];

export const accountTypeImageRenderer = (row, datafield, value, defaulthtml, columnproperties, rowdata) => {
    let accountTypeImage = accountTypeImages.find((m) => m.isHousehold == rowdata.isHouseHold);
    let accountTypeIconClass = 'softpak-grid-account-type-icon';
    return ImageRenderer.call(this, accountTypeImage.imageName, accountTypeImage.imageTitle,
        accountTypeIconClass, row, datafield, value,
        defaulthtml, columnproperties, rowdata);
}

export const accountNameLinkRenderer = (component: DriftreportSummaryWidgetComponent, linkHandler, row, datafield, value, defaulthtml, columnproperties, rowdata) => {
    let linkURL = component.dashboardService.getAppContext() + `/secure/accounts/${encodeURIComponent(
        rowdata.portfolioId)}/${rowdata.isHouseHold}`
    if (component.urebalPermissions.isAllowed('accountViewData')) {
        return LinkRenderer.call(this, component, linkHandler, linkURL, row, datafield, value, defaulthtml,
            columnproperties,
            rowdata);
    } else {
        return null;
    }
}

export const driftSummaryWidgetGridSource = (): any => {
    return {
        localdata: [],
        datatype: 'array',
        datafields: [
            {name: "portfolioId", type: "number"},
            {name: "accountName", type: "string"},
            {name: "marketValue", type: "number"},
            {name: "sleeveCount", type: "number"},
            {name: "driftStatus", type: "string"},
            {name: "asOfDate", type: "date"},
            {name: "drift", type: "number"},
            {name: "lastRebalanced", type: "date"},
            {name: "isHouseHold", type: "boolean"},
            {name: "accountId", type: "string"},
            {name: "taxStatus", type: "string"},
            {name: "cashDrift", type: "number"},
            {name: "statusDescription", type: "string"},
            {name: "coreCash", type: "number"},
            {name: "modelName", type: "string"}
        ],
    }
};

export const driftSummaryWidgetGridCols = (component: DriftreportSummaryWidgetComponent): GridColumn[] => {
    let data = [
        {
            text: "Type",
            datafield: "isHouseHold",
            width: "8%",
            cellsrenderer: accountTypeImageRenderer,
        },
        {
            text: "Account Name",
            datafield: "accountName",
            width: "20%",
            cellsrenderer: accountNameLinkRenderer.bind(null, component, component.accountNameLinkHandler),
        },
        {
            text: "Model Name",
            datafield: "modelName",
            width: "28%"
        },
        {
            text: "Drift Status",
            datafield: "driftStatus",
            width: "32%"
        },
        {
            text: "Drift %",
            datafield: "drift",
            cellsformat: "d2",
            width: "12%"
        }
    ]

    SoftpakGridHelper.mergeGridColumnProperties(data, accountDriftWidgetGridColsMeta)

    return data;
}
