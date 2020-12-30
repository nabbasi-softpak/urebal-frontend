import {Component, OnInit, ViewChild} from '@angular/core';
import { WorkspaceService } from '../../../workspaces/workspace.service';
import {AccountService} from "../../../account/account.service";
import {AutocompleteComponent} from "../../../shared/components/autocomplete/autocomplete.component";
import {jqxChartComponent} from "../../../../../src/assets/jqwidgets-ts/angular_jqxchart";
import {UrebalGridComponent} from "../../../shared/components/urebal-grid/urebal-grid.component";
import {DollarFormatterPipe, PercentFormatterPipe} from "../../../shared/pipes/NumericFormatterPipe";
import {UILoader} from "../../../shared/util/UILoader";


@Component({
  selector: 'app-tax-cost-curve-report',
  templateUrl: './tax-cost-curve-report.component.html'
})
export class TaxCostCurveReportComponent implements OnInit {
  @ViewChild(AutocompleteComponent) autoComplete:AutocompleteComponent;
  @ViewChild('scatterChart') taxCostCurveReport: jqxChartComponent;
  @ViewChild('taxCostCurveReport') taxCostCurveReportGrid: UrebalGridComponent;

  public portfolioList = [];
  public portfolio = {
    portfolioName: undefined,
    houseHold: undefined
  };
  public errMsg = '';
  private taxSummary : any;
  private taxShowIn : String = "Dollar";
  public selectedAccountTax : any;
  private shortTermTaxCost : number;
  private longTermTaxCost : number;
  private totalShortLongTermCost : number;
  regexStr = '^[0-9]*$';

  constructor(public workspaceService : WorkspaceService, private accountService: AccountService,
              private dollarFormatter : DollarFormatterPipe,
              private percentFormatter: PercentFormatterPipe) {}

  ngOnInit() {
    this.accountService.getPortfoliosList().subscribe(result => {
      this.portfolioList = result.responsedata;
    });
  }

  getReport(portfolio) {
    this.portfolio = portfolio;
    $('#tolerenceBand').val('');
    $('#numberOfSteps').val('');
    this.errMsg = '';
    this.resetComponents(false);
    $('#printData').removeClass('slds-hide');
  }

  padding: any = { left: 5, top: 5, right: 5, bottom: 5 };

  titlePadding: any = { left: 90, top: 0, right: 0, bottom: 10 };

  xAxis: any = {
    dataField: 'toleranceDifference',
    displayText: 'Tax Cost $ USD',
    valuesOnTicks: false,
    labels: {
      formatSettings: {prefix: '', decimalPlaces: 2}
    }
  };

  valueAxis: any = {
    title: { text: 'Tax Cost $ USD<br>' },
    labels: {
      formatSettings: { prefix: '', thousandsSeparator: ','},
      horizontalAlignment: 'right'
    }
  };

  seriesGroups: any[] = [
    {
      type: 'line',
      useGradient: false, // disable gradient for the entire group
      toolTipFormatFunction:  (value, itemIndex, series, group, xAxisValue, xAxis)=> {
        let format = jqx.dataFormat;
        return `<div style="text-align:left">`+
          `Tax Cost: $` + format.formatnumber(value, 'd2') +
          `<br />Tolerance Band: \u00B1 ` + format.formatnumber(xAxisValue, 'd2') +
          `</div>`;
      },
      series: [
        { dataField: 'taxCostDuringRebalance', symbolSize: 10, symbolType: 'circle', displayText: 'Tolerance Band',enableSeriesToggle: false  }
      ]
    }
  ];

  symbolsList: string[] = ['circle', 'diamond', 'square', 'triangle_up', 'triangle_down', 'triangle_left', 'triangle_right'];

  rebalanceAccount(tolerenceBand,numberOfSteps,event?) {
    let tolerenceband : number = parseFloat(tolerenceBand === "" ? 0 : tolerenceBand);
    let numberOfsteps : number = parseInt(numberOfSteps === "" ? 0 : numberOfSteps);

    this.resetComponents(false);

    let regEx =  new RegExp(this.regexStr);
    if(!regEx.test(numberOfsteps.toString())){
      this.errMsg = "Number of steps should only be in numeric";
      return;
    }

    if( tolerenceband > 0 && tolerenceband <= 10 && numberOfsteps >= 2 && numberOfsteps <= 10){
      if(this.portfolio['taxable'] === "No") {
        this.errMsg = 'This report can only be generated for taxable account.';
        return;
      }

      UILoader.blockUI.start('Loading report ...');
      //Loading tax summary
      this.workspaceService.get("portfolios/"+this.portfolio['portfolioId']+"/reports/tax-summary").subscribe(result=> {
        if(result.code == 200){
          this.taxSummary = result.responsedata;
          for (let summary of result.responsedata) {
            if (summary.account_id === "HOUSEHOLD") {
              this.taxSummary = summary;
              this.loadTaxData();
              break;
            }
          }
        }else{
          this.taxSummary = null;
        }
      });

      this.workspaceService.rebalanceAccount(this.portfolio['portfolioId'],tolerenceband,numberOfsteps).subscribe(
        result => {
          if(result['code'] == 400){
            this.errMsg = result.message;
            UILoader.blockUI.stop();
            return;
          }

          this.errMsg = '';
          this.resetComponents(true);
          let sortedArray = result['responsedata'].taxCurveReport.sort((a,b)=>{
            return a.toleranceDifference - b.toleranceDifference
          });

          let gridSource = JSON.parse(JSON.stringify(sortedArray));
          for(let row of gridSource){
            row['toleranceDifference'] = '\u00B1 ' + row['toleranceDifference'];
          }

          this.taxCostCurveReport.source(sortedArray);
          this.taxCostCurveReport.seriesGroups()[0].series[0].symbolType = 'circle';
          this.taxCostCurveReport.update();

          this.taxCostCurveReportGrid.refreshGrid(gridSource);
          UILoader.blockUI.stop()
        });
    } else {
      this.errMsg = 'Please enter valid step size and number of steps';
    }
  }

  printChartAndGrid(){
    let chartContent = this.taxCostCurveReport.host[0].outerHTML;
    //let gridContent = this.taxCostCurveReportGrid.jqxGrid.host.jqxGrid('exportdata','html');
    let grid : UrebalGridComponent = this.taxCostCurveReportGrid;
    //let gridContent = grid.jqxGrid.host[0].innerHTML;

    grid.jqxGrid.hideloadelement();
    grid.jqxGrid.pageable(false);
    grid.setColumn('toleranceDifference','width','10%');
    grid.setColumn('shorttermRoundedLoss','width','10%');
    grid.setColumn('shorttermRoundedGain','width','10%');
    grid.setColumn('longtermRoundedLoss','width','10%');
    grid.setColumn('longtermRoundedGain','width','10%');
    grid.setColumn('taxCostDuringRebalance','width','10%');


    let newWindow = window.open('', '', "width=800,height=600");
    let protocol = window.location.protocol + '//';
    let host = window.location.host;
    let pageContent =`<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <link rel="stylesheet" type="text/css" href=` + protocol + host + `/${this.workspaceService.getAppContext()}/assets/jqwidgets/styles/jqx.base.css />
            <link rel="stylesheet" type="text/css" href=` + protocol + host + `/${this.workspaceService.getAppContext()}/assets/styles/jqx.urebal.css />
            <link rel="stylesheet" type="text/css" href=` + protocol + host + `/${this.workspaceService.getAppContext()}/assets/css_framework/assets/styles/salesforce-lightning-design-system.css />
        </head>
        <style>
            @page {
                size: A4 Landscape;
                margin: 2mm 0 5mm 0;
            }
        </style>        
        `;

    newWindow.document.write(pageContent);
    newWindow.document.write('<body>');
    newWindow.document.write('<div style="width: 100%; margin: 5px; display: flex; justify-content: center;"><h3>Tax Cost Curve Report</h3></div>');
    newWindow.document.write($('#reportSummary').clone().html());
    newWindow.document.write('<br>');
    newWindow.document.write('<div style="width: 100%; display: flex; justify-content: center;">');
    newWindow.document.write(chartContent);
    newWindow.document.write('</div>');
    newWindow.document.write('<br><br><br><br><br>');
    newWindow.document.write('<div style="margin-left: 20px;">');
    newWindow.document.write($('#taxCostCurveReport').html());
    newWindow.document.write('</div>');
    newWindow.document.write('</body></html>');

    try{
        setTimeout(()=>{
          newWindow.print();
          newWindow.close();
          },3000);
      }
      catch (error) {
        console.log(error)
      }

    grid.setColumn('toleranceDifference','width','16.5%');
    grid.setColumn('shorttermRoundedLoss','width','16.5%');
    grid.setColumn('shorttermRoundedGain','width','16.5%');
    grid.setColumn('longtermRoundedLoss','width','16.5%');
    grid.setColumn('longtermRoundedGain','width','16.5%');
    grid.setColumn('taxCostDuringRebalance','width','17.5%');
    grid.jqxGrid.pageable(true);
  }

  exportToCsv() {
    let header = "Total,Short Term,Long Term,Total Gain/Loss,Tax Cost\n" +
      "Unrealized gain,\""+this.dollarFormatter.transform(this.taxSummary['beforeShortTermGain'+this.taxShowIn])+"\",\""+this.dollarFormatter.transform(this.taxSummary['beforeLongTermGain'+this.taxShowIn])+"\",\""+this.dollarFormatter.transform(this.taxSummary['beforeLongTermGain'+this.taxShowIn] + this.taxSummary['beforeShortTermGain'+this.taxShowIn])+"\",\""+this.dollarFormatter.transform(this.longTermTaxCost.toString())+"\"\n" +
      "Unrealized loss,\""+this.dollarFormatter.transform(this.taxSummary['beforeShortTermLoss'+this.taxShowIn])+"\",\""+this.dollarFormatter.transform(this.taxSummary['beforeLongTermLoss'+this.taxShowIn])+"\",\""+this.dollarFormatter.transform(this.taxSummary['beforeLongTermLoss'+this.taxShowIn] + this.taxSummary['beforeShortTermLoss'+this.taxShowIn])+"\",\""+this.dollarFormatter.transform(this.shortTermTaxCost.toString())+"\"\n" +
      "Total unrealized gain/loss,\""+this.dollarFormatter.transform(this.taxSummary['beforeShortTermGain'+this.taxShowIn] + this.taxSummary['beforeShortTermLoss'+this.taxShowIn])+"\",\""+this.dollarFormatter.transform(this.taxSummary['beforeLongTermGain'+this.taxShowIn] + this.taxSummary['beforeLongTermLoss'+this.taxShowIn])+"\",\""+this.dollarFormatter.transform((this.taxSummary['beforeLongTermGain'+this.taxShowIn] + this.taxSummary['beforeShortTermGain'+this.taxShowIn]) + (this.taxSummary['beforeLongTermLoss'+this.taxShowIn] + this.taxSummary['beforeShortTermLoss'+this.taxShowIn]))+"\",\""+this.dollarFormatter.transform(this.totalShortLongTermCost.toString())+"\"\n\n\n";

    let gridContent = this.taxCostCurveReportGrid.jqxGrid.host.jqxGrid('exportdata', 'csv');
    let completeData = header + gridContent;
    let blob = new Blob([completeData], {type: 'application/csv'});
    saveAs(blob, this.portfolio['portfolioName'] + " - Tax-Curve-Report.csv");
  }

  private loadTaxData() : void {
    this.selectedAccountTax = this.taxMapToEntity(this.taxSummary);
    this.shortTermTaxCost = 0;
    this.longTermTaxCost =  this.taxSummary['totalTaxCost'];;
    this.totalShortLongTermCost = this.taxSummary['totalTaxCost'];
    return;
  }

  private taxMapToEntity(taxSummary : any) {
    let mapTempTax = {
      beforeLongTermGain:   this.formatValue(taxSummary['beforeLongTermGain'+this.taxShowIn]),
      beforeLongTermLoss:   this.formatValue(taxSummary['beforeLongTermLoss'+this.taxShowIn]),
      beforeShortTermGain:  this.formatValue(taxSummary['beforeShortTermGain'+this.taxShowIn]),
      beforeShortTermLoss:  this.formatValue(taxSummary['beforeShortTermLoss'+this.taxShowIn]),
      beforeShortTermNet:   this.formatValue(taxSummary['beforeShortTermGain'+this.taxShowIn] + taxSummary['beforeShortTermLoss'+this.taxShowIn]),
      beforeLongTermNet:    this.formatValue(taxSummary['beforeLongTermGain'+this.taxShowIn] + taxSummary['beforeLongTermLoss'+this.taxShowIn]),
      beforeTotalGain:      this.formatValue(taxSummary['beforeLongTermGain'+this.taxShowIn] + taxSummary['beforeShortTermGain'+this.taxShowIn]),
      beforeTotalLoss:      this.formatValue(taxSummary['beforeLongTermLoss'+this.taxShowIn] + taxSummary['beforeShortTermLoss'+this.taxShowIn]),
      beforeTotalNet:       this.formatValue((taxSummary['beforeLongTermGain'+this.taxShowIn] + taxSummary['beforeShortTermGain'+this.taxShowIn]) + (taxSummary['beforeLongTermLoss'+this.taxShowIn] + taxSummary['beforeShortTermLoss'+this.taxShowIn])),
      afterLongTermGain:    this.formatValue(taxSummary['afterLongTermGain'+this.taxShowIn]),
      afterLongTermLoss:    this.formatValue(taxSummary['afterLongTermLoss'+this.taxShowIn]),
      afterShortTermGain:   this.formatValue(taxSummary['afterShortTermGain'+this.taxShowIn]),
      afterShortTermLoss:   this.formatValue(taxSummary['afterShortTermLoss'+this.taxShowIn]),
      afterShortTermNet:    this.formatValue(taxSummary['afterShortTermGain'+this.taxShowIn] + taxSummary['afterShortTermLoss'+this.taxShowIn]),
      afterLongTermNet:     this.formatValue(taxSummary['afterLongTermGain'+this.taxShowIn] + taxSummary['afterLongTermLoss'+this.taxShowIn]),
      afterTotalGain:       this.formatValue(taxSummary['afterLongTermGain'+this.taxShowIn] + taxSummary['afterShortTermGain'+this.taxShowIn]),
      afterTotalLoss:       this.formatValue(taxSummary['afterLongTermLoss'+this.taxShowIn] + taxSummary['afterShortTermLoss'+this.taxShowIn]),
      afterTotalNet:        this.formatValue((taxSummary['afterLongTermGain'+this.taxShowIn] + taxSummary['afterShortTermGain'+this.taxShowIn]) + (taxSummary['afterLongTermLoss'+this.taxShowIn] + taxSummary['afterShortTermLoss'+this.taxShowIn])),
      changeLongTermGain:   this.formatValue(taxSummary['changeLongTermGain'+this.taxShowIn]),
      changeLongTermLoss:   this.formatValue(taxSummary['changeLongTermLoss'+this.taxShowIn]),
      changeShortTermGain:  this.formatValue(taxSummary['changeShortTermGain'+this.taxShowIn]),
      changeShortTermLoss:  this.formatValue(taxSummary['changeShortTermLoss'+this.taxShowIn]),
      changeShortTermNet:   this.formatValue(taxSummary['changeShortTermGain'+this.taxShowIn] + taxSummary['changeShortTermLoss'+this.taxShowIn]),
      changeLongTermNet:    this.formatValue(taxSummary['changeLongTermGain'+this.taxShowIn] + taxSummary['changeLongTermLoss'+this.taxShowIn]),
      changeTotalGain:      this.formatValue(taxSummary['changeLongTermGain'+this.taxShowIn] + taxSummary['changeShortTermGain'+this.taxShowIn]),
      changeTotalLoss:      this.formatValue(taxSummary['changeLongTermLoss'+this.taxShowIn] + taxSummary['changeShortTermLoss'+this.taxShowIn]),
      changeTotalNet:       this.formatValue((taxSummary['changeLongTermGain'+this.taxShowIn] + taxSummary['changeShortTermGain'+this.taxShowIn]) + (taxSummary['changeLongTermLoss'+this.taxShowIn] + taxSummary['changeShortTermLoss'+this.taxShowIn])),
    };

    return mapTempTax;
  }

  private formatValue(value){
    let args: any[] = [];
    args['html'] = true;
    if(this.taxShowIn == "Dollar"){
      return this.dollarFormatter.transform(value,args);
    } else {
      return this.percentFormatter.transform(value,args);
    }
  }

  private resetComponents(show){
    if(show){
      $('#printControls').removeClass('slds-hide');
      $('#reportSummary').removeClass('slds-hide');
      $('#reportSection').removeClass('slds-hide');
    } else {
      $('#printControls').addClass('slds-hide');
      $('#reportSummary').addClass('slds-hide');
      $('#reportSection').addClass('slds-hide');
    }
  }
}
