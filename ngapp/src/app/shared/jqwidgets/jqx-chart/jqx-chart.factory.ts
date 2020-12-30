import {merge} from 'lodash';

import ChartSeriesGroup = jqwidgets.ChartSeriesGroup;
import {jqxFormatFunction, jqxTooltipFormatFunction} from "./jqx-chart.helper";

export class JqxChartFactory {
    static getChartSeriesGroup(opts?) {
        let chartGroupSeries: ChartSeriesGroup = {
            type: 'pie',
            showLabels: false,
            series: [{
                useGradientColors: false,
                dataField: 'value',
                displayText: 'name',
                radius: 150,
                dataFieldOpen: 'name',
                lineWidth: 2,
                formatFunction: jqxFormatFunction,
                toolTipFormatFunction: jqxTooltipFormatFunction,
            }],
            colorScheme: 'scheme05'
        };

        if (opts !== undefined) {
            chartGroupSeries = merge(chartGroupSeries, opts);
        }

        return [chartGroupSeries]
    }
}
