import {jqxTooltipFormatFunction} from "../../../../shared/jqwidgets/jqx-chart/jqx-chart.helper";

export const OVERVIEW_DEFAULT_MODEL = "Primary Asset Class";
export const OVERVIEW_DEFAULT_OTHERS = "OTHERS";

export const jqxFormatFunction = (value) => {
    if (value[""] == 0) return '';
    else return value["open"] + ': ' + parseFloat(value[""]).toFixed(2) + '%';
};

export const objectToString = (obj) => {
    let s: string = "";
    for (let value of obj) {
        s += value;
    }
    return s;
};

export const padding: any = {left: 0, top: 5, right: 5, bottom: 5};
export const legendLayout: any = {
    left: 650,
    top: 30,
    width: 300,
    height: 200,
    flow: 'vertical'
};

export const accountModelSeriesGroups: any[] = [
    {
        type: 'donut',
        showLabels: false,
        useGradient: false, // disable gradient for the entire group
        series: [
            {
                useGradient: false,
                dataField: 'value',
                displayText: 'name',
                radius: 150,
                innerRadius: 75,
                dataFieldOpen: 'name',
                lineWidth: 2,
                formatFunction: jqxFormatFunction,
                toolTipFormatFunction: jqxTooltipFormatFunction,
            },
        ]
    }
];
