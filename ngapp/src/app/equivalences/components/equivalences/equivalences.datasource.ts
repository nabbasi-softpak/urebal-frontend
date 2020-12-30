import GridColumn = jqwidgets.GridColumn;
import {EquivalencesComponent} from "./equivalences.component";

export const equivalencesGridDataSource = (): any => {
    return {
        localdata: [],
        datatype: 'array',
        datafields: [
            {name: "equivalenceName", type: "string"},
            {name: "ticker", type: "string"},
        ],
    }
};

export const equivalencesGridCols = (component: EquivalencesComponent): GridColumn[] => {
    let data = [
        {
            text: "Equivalence Name",
            datafield: "equivalenceName",
            cellsalign: "left",
            cellsRenderer: cellsRenderer,
            width: "50%"
        },
        {
            text: "Ticker",
            datafield: "ticker",
            cellsalign: "left",
            cellsRenderer: cellsRenderer,
            width: "50%",
            cellalign: "right",
            aggregates: [{
                'equivalence-count': ((component: EquivalencesComponent, aggregatedValue: number, currentValue: number, column: any, record: any): number => {
                    return component.getEquivalenceCount();
                }).bind(null, component)
            }],
            aggregatesrenderer: (aggregates: any, column: any, element: any): string => {
                let renderstring = `<div style="float: right; margin: 4px; overflow: hidden; padding-right: 10px;"><b>Equivalences Applied:</b> ${aggregates['equivalence-count'] || 0}</div>`;
                return renderstring;
            }
        }
    ];

    return data;
};

export const cellsRenderer = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
    return `<div style="margin-top: 8px;" class="blueleaf-text">${value}</div>`;
};
