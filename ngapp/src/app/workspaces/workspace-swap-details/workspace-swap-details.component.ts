import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {jqxChartComponent} from "../../../../src/assets/jqwidgets-ts/angular_jqxchart";
import {UILoader} from "../../shared/util/UILoader";
import {WorkspaceService} from "../workspace.service";
import {jqxGridComponent} from "../../../../src/assets/jqwidgets-ts/angular_jqxgrid";
import {DollarFormatterPipe} from "../../shared/pipes/NumericFormatterPipe";
import {columnHeaderRenderer} from "../../shared/jqwidgets/jqx-grid/softpak-grid-renderers";
import {ResponseContentType} from "../../shared/classes/ResponseContentType.class";
import {DialogModalComponent} from "../../shared/components/dialog-modal/dialog-modal.component";


@Component({
    selector: 'workspace-swap-details',
    templateUrl: './workspace-swap-details.component.html'
})
export class WorkspaceSwapDetailsComponent implements OnInit {
    @ViewChild('scatterChartTax') scatterChartTax: jqxChartComponent;
    @ViewChild('scatterSecSwapChart') scatterSecSwapChart: jqxChartComponent;
    @ViewChild('SwapReportGrid') swapReportGrid: jqxGridComponent;
    @ViewChild("errorModalRef") errorModal: DialogModalComponent;
    @Input() portfolioId: number;
    @Input() portfolioName: string;
    @Input() isSupportZipEnabled: boolean = false;

    public errMsg = '';
    public modalErrorMsg = "";
    private securityListMap: Map<string, number[]> = new Map<string, number[]>();
    private trailZero: number = 0;
    private gridData = [];
    public isDataFound = false;
    private min = 0;
    private max = 0;


    constructor(private workspaceService: WorkspaceService,
                private changeDetector: ChangeDetectorRef,
                private dollarFormatter: DollarFormatterPipe
    ) {
    }

    clearAll() {
        this.isDataFound = false;
        this.errMsg = "";
    }

    closeErrorModal() {
        this.modalErrorMsg = "";
        this.errorModal.close();
    }

    ngOnInit() {
    }

    padding: any = {left: 5, top: 5, right: 10, bottom: 5};

    titlePadding: any = {left: 0, top: 5, right: 5, bottom: 10};
    titlePaddingTax: any = {left: 0, top: 5, right: 5, bottom: 10};

    xAxisSec: any = {
        displayText: 'Percentage Weight %',
        valuesOnTicks: false
    };

    valueAxis: any = {
        padding: {left: 0, right: 0},
        title: {text: 'Percentage Weight %<br>'},
        labels: {
            formatSettings: {prefix: '', decimalPlaces: 2},
            horizontalAlignment: 'right',
            logarithmicScale: true,
            logarithmicScaleBase: 10,
            baselineValue: 1
        }
    };

    xAxisTax: any = {
        displayText: 'Gain Loss Value $',
        valuesOnTicks: false,
        rangeSelector: {
            seriesType: 'area',
            size: 60,
            padding: {top: 10, bottom: 0},
            backgroundColor: 'white',
            showGridLines: false
        }
    };

    valueAxisTax: any = {
        padding: {left: 0, right: 0},
        title: {text: 'Gain Loss Value $<br>'},
        labels: {
            formatSettings: {prefix: '', decimalPlaces: 2, thousandsSeparator: ','},
            horizontalAlignment: 'right',
            logarithmicScale: true,
            logarithmicScaleBase: 10,
            baselineValue: 1
        }
    };


    seriesGroupsSec: any[] = [];
    seriesGroupsTax: any[] = [];


    getWorkspaceSwapReport() {

        if (this.isDataFound) {
            return;
        }


        UILoader.blockUI.start('Loading report ...');
        //Loading tax summary

        this.workspaceService.getWorkspaceDetails(this.portfolioId).subscribe(
            result => {
                UILoader.blockUI.stop()
                if (result['code'] == 400 || result['code'] == -100) {
                    this.errMsg = result.message;
                    UILoader.blockUI.stop();
                    this.isDataFound = false;
                    return;
                }
                this.isDataFound = true;
                this.changeDetector.detectChanges();
                this.scatterSecSwapChart.seriesGroups()
                this.errMsg = '';
                let sortedArray = result['responsedata'].sort((a, b) => {
                    // for some reason a < b is not giving the right order
                    // so using a -b instead
                    return (a.iteration - b.iteration);
                });
                this.min = 0;
                this.gridData = sortedArray;
                this.createTaxChart(sortedArray);
                this.createSecuritiesData(sortedArray);
                this.createGridData(sortedArray);
                this.resetZooming();


            });
    }

    createSecuritiesData(sortedArray) {
        this.securityListMap = new Map<string, number[]>();
        for (let value of sortedArray) {
            // intentionally array with fixed length is used
            // because chart requires all field to have
            // equal values on x-axis
            let secListBuy: number[] = null;
            if (this.securityListMap.has(value.buySecurityID))
                secListBuy = this.securityListMap.get(value.buySecurityID);
            else
                secListBuy = new Array(sortedArray.length);

            let secListSell: number[] = null;
            if (this.securityListMap.has(value.sellSecurityID))
                secListSell = this.securityListMap.get(value.sellSecurityID);
            else
                secListSell = new Array(sortedArray.length);

            secListBuy[value.iteration] = value.buyOptPctWt;
            secListSell[value.iteration] = value.sellOptPctWt;
            this.securityListMap.set(value.buySecurityID, secListBuy);
            this.securityListMap.set(value.sellSecurityID, secListSell);
        }

        var count = 0;
        this.seriesGroupsSec = [];
        for (let key of Array.from(this.securityListMap.keys())) {
            this.seriesGroupsSec.push(
                {
                    type: 'line',
                    source: this.securityListMap.get(key),
                    useGradient: false, // disable gradient for the entire group
                    toolTipFormatFunction: (value, itemIndex, series, group, xAxisValue, xAxis) => {
                        this.scatterChartTax.showToolTip(0, 0, itemIndex, 10, 5000);
                        let format = jqx.dataFormat;

                        let toolTip = `<div class="toolTipDiv" style="text-align:left">`;
                        toolTip += `Security : ` + key +
                            `<br/>Weight : ` + format.formatnumber(value, 'd2') + ` % ` +
                            `<br/><br/>`;
                        for (let newKey of Array.from(this.securityListMap.keys())) {
                            if (this.securityListMap.get(newKey)[xAxisValue] != null &&
                                newKey != key) {
                                toolTip += `Security : ` + newKey +
                                    `<br/>Weight : ` + format.formatnumber(this.securityListMap.get(newKey)[xAxisValue],
                                        'd2') + ` %<br/> `;
                                break;
                            }
                        }
                        toolTip += `<br/>Iteration : ` + format.formatnumber(xAxisValue, 'd0') +
                            `</div>`;
                        return toolTip;
                    },
                    series: [
                        {}
                    ]
                }
            );
            this.seriesGroupsSec[count].series[0] =
                {emptyPointsDisplay: 'skip', displayText: key, enableSeriesToggle: false};

            ++count;
        }
        this.scatterSecSwapChart.widgetObject.getInstance()._selectorRange = [];
        this.valueAxis.padding.left = this.trailZero * 7;
        this.scatterSecSwapChart.toolTipShowDelay(10);
        this.scatterSecSwapChart.update();

    }

    createTaxChart(sortedArray) {
        let maxGain = 0;
        let maxLoss = 0;
        let maxGainLoss = 0;
        let taxList = [];

        for (let value of sortedArray) {
            taxList.push(value.harvestGainLossValue.toFixed(0));
            maxGain = (maxGain < value.harvestGainLossValue) ? value.harvestGainLossValue : maxGain;
            maxLoss = (maxLoss > value.harvestGainLossValue) ? value.harvestGainLossValue : maxLoss;
        }
        this.max = taxList.length;
        maxGainLoss = (maxGain < Math.abs(maxLoss)) ? Math.abs(maxLoss) : maxGain;
        var dZerovalue = (Math.ceil(maxGainLoss)).toString();
        this.trailZero = (dZerovalue.length > 2) ? (dZerovalue.length - 1) : 0;
        this.seriesGroupsTax = [];
        this.seriesGroupsTax.push(
            {
                type: 'line',
                source: taxList,
                useGradient: false, // disable gradient for the entire group
                toolTipFormatFunction: (value, itemIndex, series, group, xAxisValue, xAxis) => {
                    let format = jqx.dataFormat;
                    return `<div class="toolTipDiv" style="text-align:left">` +
                        `Gain Loss Value : $` + format.formatnumber(value, 'd0') +
                        `<br />Iteration: ` + format.formatnumber(xAxisValue, 'd0') +
                        `</div>`;
                },
                series: [
                    {}
                ]
            }
        );
        this.seriesGroupsTax[0].series[0] =
            {
                emptyPointsDisplay: 'skip',
                displayText: 'Gain Loss Value',
                lineWidth: 3,
                color: '#00BFFF',
                enableSeriesToggle: false
            }


        this.scatterChartTax.widgetObject.getInstance()._selectorRange = [];
        this.scatterChartTax.toolTipShowDelay(10);
        this.scatterChartTax.update();

    }

    changeSecuritiesChart(minValue, maxValue) {
        this.scatterSecSwapChart.widgetObject.getInstance()._selectorRange = [];
        for (let i = 0; i < this.scatterSecSwapChart.attrSeriesGroups.length; i++) {
            this.scatterSecSwapChart.widgetObject.getInstance()._selectorRange.push(
                {
                    min: minValue,
                    max: maxValue
                }
            );
        }
        this.scatterSecSwapChart.update();
    }

    changeCharts(event: any) {
        let line;
        if (event.args) {
            let args = event.args;


            if (event.type.indexOf('rangeSelection') != -1) {

                this.changeSecuritiesChart(args.minValue, args.maxValue);
                this.swapReportGrid.clearfilters();
                let filterMin = new jqx.filter();
                let filter_and_operator = 0;
                let filtervalue = args.minValue;
                let filtercondition = 'greater_than_or_equal';
                let filterMin1 = filterMin.createfilter('numericfilter', filtervalue, filtercondition);
                filtervalue = args.maxValue;
                filtercondition = 'less_than_or_equal';
                let filterMin2 = filterMin.createfilter('numericfilter', filtervalue, filtercondition);


                filterMin.addfilter(filter_and_operator, filterMin1);
                filterMin.addfilter(filter_and_operator, filterMin2);
                // add the filters.
                this.swapReportGrid.addfilter("startIteration", filterMin);
                // apply the filters.
                this.swapReportGrid.applyfilters();
            }

        }
    }

    createGridData(sortedArray) {
        let gridData = [] as Array<gridData>
        let buyId = "";
        let sellId = "";
        let accountNumber = "";
        let LastGainLossValue = 0;
        let totalGainLoss = 0;

        for (let value of sortedArray) {
            if (!(
                buyId.toUpperCase() == value.buySecurityID.toUpperCase() &&
                sellId.toUpperCase() == value.sellSecurityID.toUpperCase() &&
                accountNumber.toUpperCase() == value.accountNumber.toUpperCase()
            )
            ) {
                let data = {} as gridData;
                buyId = value.buySecurityID;
                sellId = value.sellSecurityID;
                accountNumber = value.accountNumber;
                LastGainLossValue = totalGainLoss;
                totalGainLoss = value.harvestGainLossValue;
                data.startIteration = value.iteration;
                data.stopIteration = value.iteration;
                data.accountNumber = value.accountNumber;
                data.swapSize = value.swapSize;
                data.harvestGainLossValue = totalGainLoss - LastGainLossValue;
                data.buySecurityID = value.buySecurityID;
                data.buyChangePctWt = value.buyChangePctWt;
                data.buyInitPctWt = value.buyInitPctWt;
                data.buyStartOptPctWt = value.buyOptPctWt - value.swapSize;
                data.buyEndOptPctWt = value.buyOptPctWt;
                data.sellSecurityID = value.sellSecurityID;
                data.sellChangePctWt = value.sellChangePctWt;
                data.sellInitPctWt = value.sellInitPctWt;
                data.sellStartOptPctWt = value.sellOptPctWt + value.swapSize;
                data.sellEndOptPctWt = value.sellOptPctWt;

                data.buyModelMaxAdjPctWt = value.buyModelMaxAdjPctWt;
                data.buyModelMinAdjPctWt = value.buyModelMinAdjPctWt;
                data.buyModelTargetAdjPctWt = value.buyModelTargetAdjPctWt;

                data.sellModelMaxAdjPctWt = value.sellModelMaxAdjPctWt;
                data.sellModelMinAdjPctWt = value.sellModelMinAdjPctWt;
                data.sellModelTargetAdjPctWt = value.sellModelTargetAdjPctWt;


                gridData.push(data);

            } else {
                totalGainLoss = value.harvestGainLossValue;
                gridData[gridData.length - 1].stopIteration = value.iteration;
                gridData[gridData.length - 1].buyEndOptPctWt = value.buyOptPctWt;
                gridData[gridData.length - 1].sellEndOptPctWt = value.sellOptPctWt;
                gridData[gridData.length - 1].swapSize = gridData[gridData.length - 1].swapSize + value.swapSize;
                gridData[gridData.length - 1].harvestGainLossValue = (totalGainLoss - LastGainLossValue);
            }

        }

        if (gridData.length > 0)
            this.isDataFound = true;
        else
            this.isDataFound = false;

        this.source.localdata = gridData;
        this.swapReportGrid.updatebounddata();
    }

    initrowdetails = (index: any, parentElement: any, gridElement: any, datarecord: any): void => {
        let tabsdiv = parentElement.children[0];
        let notes = tabsdiv.children[0];
        let args: any[] = [];
        if (tabsdiv != null) {
            let transformedGainLoss = this.dollarFormatter.transform(datarecord.harvestGainLossValue, args);
            if (datarecord.harvestGainLossValue < 0)
                transformedGainLoss = '<span style="color: red;">' + transformedGainLoss + '</span>';

            const log = ' <table class="slds-table blueleaf-text"> <thead> ' +
                '<tr bgcolor="#e8ecef" class="slds-border--bottom title">' +
                ' <th scope="col" style="border: 1px solid #d8dde6;">' +
                '<div class="slds-truncate slds-p-horizontal--medium1" style="text-align: center;">Sell Security</div> ' +
                '</th> ' +
                ' <th scope="col" style="border: 1px solid #d8dde6;">' +
                '<div class="slds-truncate slds-p-horizontal--medium1" style="text-align: center;">Sell Min %</div> ' +
                '</th> ' +
                '<th scope="col" style="border: 1px solid #d8dde6;"> ' +
                '<div class="slds-truncate slds-p-horizontal--medium1" style="text-align: center;">Sell Target %</div> ' +
                '</th> ' +
                '<th scope="col" style="border: 1px solid #d8dde6;"> ' +
                '<div class="slds-truncate slds-p-horizontal--medium1" style="text-align: center;">Sell Max %</div> ' +
                '</th> ' +
                '<th scope="col" style="border: 1px solid #d8dde6; display: none"> ' +
                '<div class="slds-truncate slds-p-horizontal--medium1" style="text-align: center;">Realized G/L</div> ' +
                '</th> ' +
                ' <th scope="col" style="border: 1px solid #d8dde6;">' +
                '<div class="slds-truncate slds-p-horizontal--medium1" style="text-align: center;">Buy Security</div> ' +
                '</th> ' +
                ' <th scope="col" style="border: 1px solid #d8dde6;"> ' +
                '<div class="slds-truncate slds-p-horizontal--medium1" style="text-align: center;">Buy Min %</div> ' +
                '</th> ' +
                ' <th scope="col" style="border: 1px solid #d8dde6;"> ' +
                '<div class="slds-truncate slds-p-horizontal--medium1" style="text-align: center;">Buy Target %</div> ' +
                '</th> ' +
                ' <th scope="col" style="border: 1px solid #d8dde6;"> ' +
                '<div class="slds-truncate slds-p-horizontal--medium1" style="text-align: center;">Buy Max %</div> ' +
                '</th> ' +
                '</tr> ' +
                '</thead> ' +
                '<tbody > ' +
                '<td scope="row" style="border: 1px solid #d8dde6;"> ' +
                `<div class="swap-report-text-truncate" title="${datarecord.sellSecurityID}" style="text-align: center;" >` +
                datarecord.sellSecurityID + '</div> ' +
                '</td> ' +
                '<td scope="row"style="border: 1px solid #d8dde6;"> ' +
                '<div class="slds-truncate "style="text-align: center;">'
                + datarecord.sellModelMinAdjPctWt.toFixed(2) + '</div> ' +
                '</td> ' +
                '<td scope="row"style="border: 1px solid #d8dde6;"> ' +
                '<div class="slds-truncate "style="text-align: center;">'
                + datarecord.sellModelTargetAdjPctWt.toFixed(2) + '</div> ' +
                '</td> ' +
                '<td scope="row"style="border: 1px solid #d8dde6;"> ' +
                '<div class="slds-truncate"style="text-align: center;">'
                + datarecord.sellModelMaxAdjPctWt.toFixed(2) + '</div> ' +
                '</td> ' +
                '<td scope="row"style="border: 1px solid #d8dde6; display: none"> ' +
                '<div class="slds-truncate"style="text-align: center;">'
                + transformedGainLoss + '</div> ' +
                '</td> ' +
                '<td scope="row"style="border: 1px solid #d8dde6;"> ' +
                `<div class="swap-report-text-truncate" title="${datarecord.buySecurityID}" style="text-align: center;">`
                + datarecord.buySecurityID + '</div> ' +
                '</td> ' +
                '<td scope="row"style="border: 1px solid #d8dde6;"> ' +
                '<div class="slds-truncate"style="text-align: center;">' +
                datarecord.buyModelMinAdjPctWt.toFixed(2) + '</div> ' +
                '</td> ' +
                '<td scope="row"style="border: 1px solid #d8dde6;"> ' +
                '<div class="slds-truncate"style="text-align: center;">' +
                datarecord.buyModelTargetAdjPctWt.toFixed(2) + '</div> ' +
                '</td> ' +
                '<td scope="row"style="border: 1px solid #d8dde6;"> ' +
                '<div class="slds-truncate"style="text-align: center;">' +
                datarecord.buyModelMaxAdjPctWt.toFixed(2) + '</div> ' +
                '</td> ' +
                '</tr> ' +
                '</tbody> ' +
                '</table>'


            let notesContainer = document.createElement('div');
            notesContainer.innerHTML = log;
            notes.appendChild(notesContainer);

        }
    }

    hideToolTip(e) {
        if (e.target) {
            let text = /(toolTipDiv)|(jqx-rc-all)/;
            if (e.target.id == "arrowInnerDiv")
                return;

            if (e.target.className.length != 0 && e.target.className.match(text))
                return;
        }
        this.scatterSecSwapChart.hideToolTip(1);
        this.scatterChartTax.hideToolTip(1);
    }

    source: any =
        {
            dataType: "json",
            dataFields: [
                {"name": "startIteration", "type": "number"},
                {"name": "stopIteration", "type": "number"},
                {"name": "sleeveID", "type": "string"},
                {"name": "accountNumber", "type": "string"},
                {"name": "sellSecurityID", "type": "string"},
                {"name": "sellStartOptPctWt", "type": "number"},
                {"name": "sellEndOptPctWt", "type": "number"},
                {"name": "harvestGainLossValue", "type": "number"},
                {"name": "swapSize", "type": "number"},
                {"name": "buySecurityID", "type": "string"},
                {"name": "buyStartOptPctWt", "type": "number"},
                {"name": "buyEndOptPctWt", "type": "number"},
                {"name": "buyModelMaxAdjPctWt", "type": "number"},
                {"name": "buyModelTargetAdjPctWt", "type": "number"},
                {"name": "buyModelMinAdjPctWt", "type": "number"},
                {"name": "sellModelMaxAdjPctWt", "type": "number"},
                {"name": "sellModelTargetAdjPctWt", "type": "number"},
                {"name": "sellModelMinAdjPctWt", "type": "number"},

            ],
            localdata: null
        };
    dataAdapter: any = new jqx.dataAdapter(this.source);

    rowdetailstemplate: any = {
        rowdetails: "<div class='gradient-background' style='border: 1px solid #d8dde6;'>" +
            "<div class='notes'></div></div>", rowdetailsheight: 70
    };


    columns: any[] = [
        {
            text: "Start<br/> Iteration",
            datafield: "startIteration",
            width: "9%",
            align: "center",
            cellsalign: "right",
            renderer: columnHeaderRenderer,
        },
        {
            text: "End<br/> Iteration",
            datafield: "stopIteration",
            width: "9%",
            align: "center",
            cellsalign: "right",
            renderer: columnHeaderRenderer,
        },
        {
            text: "Account<br/> Number",
            datafield: "accountNumber",
            width: "14%",
            cellsformat: "d0",
            align: "center",
            cellsalign: "left",
            renderer: columnHeaderRenderer,
        },
        {
            text: "Sell<br/> Security",
            datafield: "sellSecurityID",
            width: "11%",
            align: "center",
            cellsalign: "left",
            renderer: columnHeaderRenderer,
        },
        {
            text: "Start %",
            datafield: "sellStartOptPctWt",
            width: "9%",
            align: "center",
            cellsalign: "right",
            "cellsformat": "d2",
            renderer: columnHeaderRenderer,
        },
        {
            text: "End %",
            datafield: "sellEndOptPctWt",
            width: "9%",
            align: "center",
            cellsalign: "right",
            "cellsformat": "d2",
            renderer: columnHeaderRenderer,
        },
        {
            text: "Change %",
            datafield: "swapSize",
            width: "10%",
            align: "center",
            cellsalign: "right",
            "cellsformat": "d2",
            renderer: columnHeaderRenderer,
        }
        ,
        {
            text: "Buy<br/> Security",
            datafield: "buySecurityID",
            width: "11%",
            align: "center",
            cellsalign: "left",
            renderer: columnHeaderRenderer,
        }
        ,
        {
            text: "Start %",
            datafield: "buyStartOptPctWt",
            width: "9%",
            align: "center",
            cellsalign: "right",
            "cellsformat": "d2",
            renderer: columnHeaderRenderer,
        }
        ,
        {
            text: "End %",
            datafield: "buyEndOptPctWt",
            width: "9%",
            align: "center",
            cellsalign: "right",
            "cellsformat": "d2",
            renderer: columnHeaderRenderer,
        }
    ];


    myGridOnRowSelect(event: any): void {

        this.scatterChartTax.widgetObject.getInstance()._selectorRange = [
            {
                min: event.args.row.startIteration,
                max: event.args.row.stopIteration
            }
        ]
        this.scatterChartTax.update();
        this.changeSecuritiesChart(event.args.row.startIteration, event.args.row.stopIteration);

    };

    resetZooming(): void {
        this.scatterChartTax.widgetObject.getInstance()._selectorRange = [
            {
                min: this.min,
                max: this.max
            }
        ]
        this.scatterChartTax.update();

        this.scatterSecSwapChart.widgetObject.getInstance()._selectorRange = [];

        this.scatterSecSwapChart.update();

        let filter = this.swapReportGrid.getfilterinformation();
        if (filter.length > 0)
            this.swapReportGrid.clearfilters();
        this.swapReportGrid.clearselection();
    }

    generateSupportZipInputs() {
        const supportZipURL = this.workspaceService.generateSupportZipInputs(this.portfolioId);

        UILoader.blockUI.start("Generating Support Zip");
        this.workspaceService.downloadFile(supportZipURL, ResponseContentType.ArrayBuffer).subscribe(result => {
            this.modalErrorMsg = "";
        }, (error) => {
            UILoader.blockUI.stop();

            this.modalErrorMsg = "Rebalance input data not found.";
            this.errorModal.open();
        }, () => {
            UILoader.blockUI.stop();
        });
    }
}


interface gridData {
    startIteration: number;
    stopIteration: number;
    sleeveID: string;
    accountNumber: string;
    swapSize: number;
    harvestGainLossValue: number;

    buySecurityID: string;
    buyChangePctWt: number;
    buyInitPctWt: number;

    buyStartOptPctWt: number;
    buyEndOptPctWt: number;

    sellSecurityID: string;
    sellChangePctWt: number;
    sellInitPctWt: number;

    sellStartOptPctWt: number;
    sellEndOptPctWt: number;
    buyModelMaxAdjPctWt: number;
    buyModelMinAdjPctWt: number;
    buyModelTargetAdjPctWt: number;

    sellModelMaxAdjPctWt: number;
    sellModelMinAdjPctWt: number;
    sellModelTargetAdjPctWt: number;

}

