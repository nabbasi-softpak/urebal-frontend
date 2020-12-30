import {jqxFormatFunction} from "../../overview.datasource";
import {jqxTooltipFormatFunction} from "../../../../../../shared/jqwidgets/jqx-chart/jqx-chart.helper";

export const accountDistributionSeriesGroups: any[] = [
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

export const accountRestrictionDistributionSeriesGroups: any[] = [
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


export const cytoscapeCenterNode = (householdName: string) => {
    return {
        data: {
            id: 'household',
            label: householdName,
            faveColor: '#A9A9A9',
            faveShape: "roundrectangle",
            borderColor: '#b5bbbd',
            color: '#ffffff',
            width: "160px",
            height: "70px",
            pie1: 0, pie2: 0, pie3: 0, pie4: 0,
            pie5: 0, pie6: 0, pie7: 0, pie8: 0,
            pie9: 0, pie10: 0, pie16: 0
        },
        position: {x: 250, y: 250},
        locked: true,
        grabbable: false
    }
};

export const cytoscapeNode = (id, label) => {
    return {
        data: {
            id: id,
            label: label,
            faveColor: '#E3EAED', //'#dcf2fa',
            faveShape: "ellipse",
            borderColor: '#b5bbbd', //'#BFE9F9',
            color: '#111111',
            width: "100px",
            height: "100px",
            pie1: 0, pie2: 0, pie3: 0, pie4: 0,
            pie5: 0, pie6: 0, pie7: 0, pie8: 0,
            pie9: 0, pie10: 0, pie16: 0
        },
        grabbable: false
    }
};

export const cytoscapeEdge = (id, id_edge) => {
    return {
        data: {
            id: id_edge,
            source: id,
            target: 'household',
            color: '#777777'
        }
    }
};
