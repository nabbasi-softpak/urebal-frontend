import GridColumn = jqwidgets.GridColumn;
import {ImageRenderer, LinkRenderer} from "../../../shared/jqwidgets/jqx-grid/softpak-grid-renderers";
import {ModelWidgetComponent} from "./model-widget.component";
import {modelTypeImages, modelTypePermissions} from "../../../model/model.datasource";
import {modelWidgetGridColsMeta} from "../../../shared/classes/grid-columns.metadata.container";
import {SoftpakGridHelper} from "../../../shared/jqwidgets/jqx-grid/softpak-grid.helper";

export const modelTypeImageRenderer = (row, datafield, value, defaulthtml, columnproperties, rowdata) => {
    let modelTypeImage = modelTypeImages.find((m) => m.modelType == rowdata.modelType);
    let modelTypeIconClass = 'softpak-grid-model-type-icon';
    return ImageRenderer.call(this, modelTypeImage.imageName, rowdata.modelTypeName, modelTypeIconClass, row,
        datafield, value, defaulthtml, columnproperties, rowdata);
}

export const modelNameLinkRenderer = (component: ModelWidgetComponent, linkHandler, row, datafield, value, defaulthtml, columnproperties, rowdata) => {
    let linkURL = component.dashboardService.getAppContext() + `/secure/model/detail/${rowdata.modelId}`;
    let modelTypePermission = modelTypePermissions.find((m) => m.modelType == rowdata.modelType);
    if (component.urebalPermissions.isAllowed(modelTypePermission.permissionName)) {
        return LinkRenderer.call(this, component, linkHandler, linkURL, row, datafield, value, defaulthtml,
            columnproperties,
            rowdata);
    } else {
        return null;
    }
}

export const modelWidgetGridDataSource = (): any => {
    return {
        localdata: [],
        datatype: 'array',
        datafields: [
            {name: "modelId", type: "number"},
            {name: "modelName", type: "string"},
            {name: "modelType", type: "number"},
            {name: "modelTypeName", type: "string"},
            {name: "modelAttributeType", type: "string"},
            {name: "marketValue", type: "number"},
            {name: "accountCount", type: "number"},
            {name: "holdingCount", type: "number"},
            {name: "cashTGT", type: "number"},
            {name: "firmId", type: "number"},
        ],
    }
};

export const modelWidgetGridCols = (component: ModelWidgetComponent): GridColumn[] => {
    let data = [
        {
            text: "Type",
            datafield: "modelType",
            width: "8%",
            cellsrenderer: modelTypeImageRenderer,
        },
        {
            text: "Model Name",
            datafield: "modelName",
            width: "24%",
            cellsrenderer: modelNameLinkRenderer.bind(null, component, component.modelNameLinkHandler),
        },
        {
            text: "Assigned Accounts",
            datafield: "accountCount",
            width: "18%"
        },
        {
            text: "Securities",
            datafield: "holdingCount",
            width: "18%"
        },
        {
            text: "Cash Target %",
            cellsformat: "F2",
            datafield: "cashTGT",
            width: "14%",
        },
        {
            text: "Market Value (USD)",
            datafield: "marketValue",
            cellsformat: "d0",
            width: "18%"
        }
    ]

    SoftpakGridHelper.mergeGridColumnProperties(data, modelWidgetGridColsMeta)

    return data;
}