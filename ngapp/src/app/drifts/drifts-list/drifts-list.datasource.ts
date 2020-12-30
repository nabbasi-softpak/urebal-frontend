import { DriftsListComponent } from "./drifts.list.component";
import {columnHeaderRenderer, LinkRenderer} from "../../shared/jqwidgets/jqx-grid/softpak-grid-renderers";
import {modelTypePermissions} from "../../model/model.datasource";
import {accountListGridColsMeta} from "../../shared/classes/grid-columns.metadata.container";
import {SoftpakGridHelper} from "../../shared/jqwidgets/jqx-grid/softpak-grid.helper";
import {URebalUtil} from "../../shared/util/URebalUtil";

export const driftStatues = ['All', 'Out of tolerance', 'Out of tolerance, Cash In', 'Model Unassigned', 'No Drift', 'Error', 'New Account', 'No Market Value'];
export const taxableItems = ['Taxable', 'Non-Taxable'];
export const accountTypes = ['Individual', 'Household'];

export const driftListGridColumns = (component: DriftsListComponent) => {
    let data = [
        {
            text: "Type",
            align: "center",
            cellsalign: "right",
            datafield: "isHouseHold",
            filtertype: 'list',
            filteritems: component.accounTypes,
            "width": "3%",
            cellsrenderer: component.accountTypeRenderer,
            filterable: true,
            renderer: columnHeaderRenderer
        },
        {
            text: "Account Number",
            align: "center",
            cellsalign: "left",
            datafield: "accountNumber",
            "width": "9%",
            columntype: 'link',
            cellsrenderer: linkRendererWithPermissions.bind(null, component, component.accountNumberLinkHandler),//accountNumberLinkHandler
            renderer: columnHeaderRenderer
        },
        {
            text: "Account Name",
            align: "center",
            cellsalign: "left",
            datafield: "portfolioName",
            "width": "9%",
            cellsrenderer: component.emptyStringCellsRenderer,
            renderer: columnHeaderRenderer
        },
        {
            text: "Rebalance Name",
            align: "center",
            cellsalign: "left",
            datafield: "workspaceName",
            "width": "9%",
            cellsrenderer: component.emptyStringCellsRenderer,
            renderer: columnHeaderRenderer
        },
        {
            text: "Tax Status",
            align: "center",
            cellsalign: "left",
            datafield: "taxStatus",
            "width": "6%",
            filtertype: 'list',
            filteritems: component.taxableItems,
            cellsrenderer: component.emptyStringCellsRenderer,
            renderer: columnHeaderRenderer
        },
        {
            text: "Drift Status",
            align: "center",
            cellsalign: "left",
            datafield: "driftStatus",
            "width": "15%",
            filtertype: 'list',
            filteritems: component.driftStatues,
            cellsrenderer: component.emptyStringCellsRenderer,
            renderer: columnHeaderRenderer
        },
        {
            text: "Drift %",
            align: "center",
            cellsalign: "right",
            datafield: "drift",
            cellsformat: "d2",
            filterable: true,
            filtertype: 'number',
            width: "5%",
            cellsrenderer: component.percentCellsRenderer,
            renderer: columnHeaderRenderer
        },
        {
            text: "Model Name",
            align: "center",
            cellsalign: "left",
            datafield: "modelName",
            "width": "8%",
            cellsrenderer: linkRendererWithPermissions.bind(null, component, component.modelNameLinkHandler),//accountNumberLinkHandler
            renderer: columnHeaderRenderer
        },
        {
            text: "Market Value",
            align: "center",
            cellsalign: "right",
            datafield: "marketValue",
            filtertype: 'number',
            cellsformat: "c0",
            "width": "8%",
            cellsrenderer: component.dollarCellsRenderer,
            renderer: columnHeaderRenderer
        },
        {
            text: "Available Cash",
            align: "center",
            cellsalign: "right",
            datafield: "coreCash",
            filtertype: 'number',
            cellsformat: "c0",
            "width": "8%",
            cellsrenderer: component.dollarCellsRenderer,
            renderer: columnHeaderRenderer
        },
        {
            text: "Cash Drift",
            align: "center",
            cellsalign: "right",
            datafield: "cashDrift",
            cellsformat: "d2",
            "width": "6%",
            filterable: false,
            renderer: columnHeaderRenderer
        },
        {
            text: "Last Rebalanced",
            align: "center",
            cellsalign: "center",
            datafield: "lastRebalanced",
            "width": "11%",
            filtertype: 'range',
            cellsrenderer: component.dateTimeCellsRenderer,
            cellsformat: 'dd-MMMM-yyyy',
            filterable: true,
            renderer: columnHeaderRenderer,
            enabletooltips: false
        }
    ];

    SoftpakGridHelper.mergeGridColumnProperties(data, accountListGridColsMeta);

    return data;
};



const modelNameLinkRenderer = (component: DriftsListComponent, linkHandler, row, datafield, value, defaulthtml, columnproperties, rowdata) => {
    let linkURL = component.accountService.getAppContext() + `/secure/model/detail/${rowdata.modelId}`;
    let modelTypePermission = modelTypePermissions.find((m) => m.modelType == rowdata.modelType);
    if (modelTypePermission && component.urebalPermissions.isAllowed(modelTypePermission.permissionName)) {
        return LinkRenderer.call(this, component, linkHandler, linkURL, row, datafield, value, defaulthtml,
            columnproperties,
            rowdata);
    } else {
        return null;
    }
};

const linkRendererWithPermissions = (component: DriftsListComponent, linkHandler, row, datafield, value, defaulthtml, columnproperties, rowdata) => {
  if(datafield==='modelName'){

    let linkURL = component.accountService.getAppContext() + `/secure/model/detail/${rowdata.modelId}`;
    let modelTypePermission = modelTypePermissions.find((m) => m.modelType == rowdata.modelType);
    if (modelTypePermission && component.urebalPermissions.isAllowed(modelTypePermission.permissionName)) {
      return LinkRenderer.call(this, component, linkHandler, linkURL, row, datafield, value, defaulthtml,
        columnproperties,
        rowdata);
    } else if(rowdata.modelType && rowdata.modelId){ /** Show Model Name as plain text (i.e. without link navigation) **/
        return defaulthtml;
    }
    else {
      return $(defaulthtml).html(`--`).prop('outerHTML');
    }
  }else if(datafield=='accountNumber'){
    if(component.urebalPermissions.isAllowed('accountViewData')){
     let linkURL = component.accountService.getAppContext() + `/secure/accounts/${encodeURIComponent(
        rowdata.portfolioId)}/${rowdata.isHouseHold}`;
   /*   let linkURL=component.accountService.getAppContext() +
        `/secure/accounts/${encodeURIComponent(rowdata.portfolioId)}/${rowdata.isHouseHold}`;*/
      return LinkRenderer.call(this, component, linkHandler, linkURL, row, datafield, value, defaulthtml,
        columnproperties,
        rowdata);
    }
  }else {
    return null;
  }
};
