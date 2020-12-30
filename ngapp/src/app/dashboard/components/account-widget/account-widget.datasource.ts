import GridColumn = jqwidgets.GridColumn;
import {
    ImageRenderer,
    LinkRenderer,
} from "../../../shared/jqwidgets/jqx-grid/softpak-grid-renderers";
import {AccountWidgetComponent} from "./account-widget.component";
import {accountWidgetGridColsMeta} from "../../../shared/classes/grid-columns.metadata.container";
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

export const accountNameLinkRenderer = (component: AccountWidgetComponent, linkHandler, row, datafield, value, defaulthtml, columnproperties, rowdata) => {
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

export const accountWidgetGridDataSource = (): any => {
    return {
        localdata: [],
        datatype: 'array',
        datafields: [
            {name: 'accountId', type: 'string'},
            {name: 'accountNumber', type: 'string'},
            {name: 'portfolioId', type: 'number'},
            {name: 'accountName', type: 'string'},
            {name: 'modelName', type: 'string'},
            {name: 'marketValue', type: 'number'},
            {name: 'noOfHoldings', type: 'number'},
            {name: 'firmId', type: 'number'},
            {name: 'isHouseHold', type: 'boolean'}
        ],
    }
};

export const accountWidgetGridCols = (component: AccountWidgetComponent): GridColumn[] => {
    let data = [
        {
            text: "Type",
            datafield: "isHouseHold",
            width: "8%",
            cellsrenderer: accountTypeImageRenderer,
        },
        {
            text: "Account Number",
            datafield: "accountNumber",
            width: "20%",
        },
        {
            text: "Account Name",
            datafield: "accountName",
            width: "22%",
            cellsrenderer: accountNameLinkRenderer.bind(null, component, component.accountNameLinkHandler),
        },
        {
            text: "Assigned Model",
            datafield: "modelName",
            width: "18%"
        },
        {
            text: "No. of Holdings",
            datafield: "noOfHoldings",
            width: "14%"
        },
        {
            text: "Market Value (USD)",
            datafield: "marketValue",
            cellsformat: "d0",
            width: "18%"
        }
    ];

    SoftpakGridHelper.mergeGridColumnProperties(data, accountWidgetGridColsMeta);

    return data;
}
