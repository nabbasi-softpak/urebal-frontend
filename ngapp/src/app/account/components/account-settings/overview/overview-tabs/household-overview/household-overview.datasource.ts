import {jqxFormatFunction} from "../../overview.datasource";
import {jqxTooltipFormatFunction} from "../../../../../../shared/jqwidgets/jqx-chart/jqx-chart.helper";

export const assetAllocationSeriesGroups: any[] = [
    {
        type: 'pie',
        showLabels: false,
        useGradient: false, // disable gradient for the entire group
        series: [
            {
                useGradient: false,
                dataField: 'value',
                displayText: 'name',
                radius: 150,
                dataFieldOpen: 'name',
                lineWidth: 2,
                formatFunction: jqxFormatFunction,
                toolTipFormatFunction: jqxTooltipFormatFunction,
            },
        ]
    }
];