import {SoftpakGridHelper} from "../../../../shared/jqwidgets/jqx-grid/softpak-grid.helper";
import {driftGridColsMeta} from "../../../../shared/classes/grid-columns.metadata.container";
import {FirmConfig} from "../../../../shared/util/config";

const driftCellRenderer = (driftService, row, colum, value, defaulthtml, columnproperties, rowdata) => {
    let cell = '<div style="display: flex; height: 100%; justify-content: center; align-items: center;">';
    cell += '<i class="material-icons" aria-hidden="true" style="';

    if (rowdata.initPct < rowdata.modelMinPct) {
      cell += 'transform: rotate(180deg);';
    } else if (rowdata.initPct <= rowdata.modelMaxPct && rowdata.initPct >= rowdata.modelMinPct) {
      cell += 'display: none;';
    }

    cell += 'font-size: 20px; color: #C90303; float: none; margin-top: 0px; width: 24px; height: 24px">north</i>';

    cell += '<span style="margin-left: 4px; width: 35px;">';
    cell += driftService.convertToPercent(value, undefined, 2);//parseFloat(value).toFixed(2);
    cell += '</span>';

    cell += '</div>';

    return cell;
};

export const driftDataColumns = () => {
    return [
        {"name": "impartial", "type": "boolean"},
        {"name": "securityId", "type": "string"},
        {"name": "securityType", "type": "string"},
        {"name": "securityName", "type": "string"},
        {"name": "initPct", "type": "number"},
        {"name": "modelMinPct", "type": "number"},
        {"name": "modelTargetPct", "type": "number"},
        {"name": "modelMaxPct", "type": "number"},
        {"name": "drift", "type": "number"}
    ]
};

export const driftGridColumns = (driftService) => {
    let data =
        [
            {
                "text": "Security ID",
                "align": "center",
                "datafield": "securityId",
                "cellsrenderer": "cellsRenderer"
            },
            {
                "text": "Security Type",
                "align": "center",
                "datafield": "securityType",
                "cellsrenderer": "cellsRenderer"
            },
            {
                "text": "Security Name",
                "align": "center",
                "datafield": "securityName",
                "cellsrenderer": "cellsRenderer"
            },
            {
                "text": "Init %",
                "align": "center",
                "cellsalign": "right",
                "datafield": "initPct",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2"
            },
            {
                "text": "Min %",
                "align": "center",
                "cellsalign": "right",
                "datafield": "modelMinPct",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2"
            },
            {
                "text": "Target %",
                "align": "center",
                "cellsalign": "right",
                "datafield": "modelTargetPct",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2"
            },
            {
                "text": "Max %",
                "align": "center",
                "cellsalign": "right",
                "datafield": "modelMaxPct",
                "cellsrenderer": "cellsRenderer",
                "cellsformat": "d2"
            },
            {
                "text": "Drift %",
                "align": "center",
                "cellsalign": "right",
                "datafield": "drift",
                "cellsrenderer": driftCellRenderer.bind(null, driftService),
                "cellsformat": "d2"
            }
        ]

    SoftpakGridHelper.mergeGridColumnProperties(data, driftGridColsMeta)
    return data;
};

export const driftRowRenderColumns = [
    {"name": "securityId", "value": FirmConfig.cashSymbol, "color": "blue"}
];
