import {Component, OnInit, ViewChild} from '@angular/core';
import { WorkspaceService } from '../../../workspaces/workspace.service';
import {AccountService} from "../../../account/account.service";
import {AutocompleteComponent} from "../../../shared/components/autocomplete/autocomplete.component";
import {jqxChartComponent} from "../../../../../src/assets/jqwidgets-ts/angular_jqxchart";
import {UrebalGridComponent} from "../../../shared/components/urebal-grid/urebal-grid.component";
import {UILoader} from "../../../shared/util/UILoader";


@Component({
  selector: 'app-trade-cost-curve-report',
  templateUrl: './trade-cost-curve-report.component.html'
})
export class TradeCostCurveReportComponent implements OnInit {
  @ViewChild(AutocompleteComponent) autoComplete:AutocompleteComponent;
  @ViewChild('scatterChart') tradeCostCurveReport: jqxChartComponent;
  @ViewChild('tradeCostCurveReport') tradeCostCurveReportGrid: UrebalGridComponent;

  public portfolioList = [];
  public portfolio = {
    portfolioName: "",
    houseHold: undefined
  };
  public errMsg = '';
  regexStr = '^[0-9]*$';
  constructor(public workspaceService : WorkspaceService, private accountService: AccountService) { }

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
    displayText: 'Portfolio Turnover',
    valuesOnTicks: false
  };

  valueAxis: any = {
    title: { text: 'Portfolio Turnover<br>' },
    labels: {
      formatSettings: { prefix: '', thousandsSeparator: ',' },
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
          `Portfolio Turnover: ` + format.formatnumber(value, 'd2') +
          `<br />Tolerance Band: \u00B1 ` + format.formatnumber(xAxisValue, 'd0') +
          `</div>`;
      },
      series: [
        { dataField: 'totalTurnOver', symbolSize: 10, symbolType: 'circle', displayText: 'Tolerance Band',enableSeriesToggle: false }
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

      UILoader.blockUI.start('Loading report ...');
      this.workspaceService.rebalanceAccount(this.portfolio['portfolioId'],tolerenceband,numberOfsteps).subscribe(
        result => {
          if(result['code'] == 400){
            this.errMsg = result.message;
            UILoader.blockUI.stop();
            return;
          }

          this.resetComponents(true);
          this.errMsg = '';
          let sortedArray = result['responsedata'].taxCurveReport.sort((a,b)=>{
            return a.toleranceDifference - b.toleranceDifference
          });

          let gridSource = JSON.parse(JSON.stringify(sortedArray));
          for(let row of gridSource){
            row['toleranceDifference'] = '\u00B1 ' + row['toleranceDifference'];
          }

          this.tradeCostCurveReport.source(sortedArray);
          this.tradeCostCurveReport.seriesGroups()[0].series[0].symbolType = 'circle';
          this.tradeCostCurveReport.update();
          this.tradeCostCurveReportGrid.refreshGrid(gridSource);
          UILoader.blockUI.stop();
        });
    } else{
      this.errMsg = 'Please enter valid step size and number of steps';
    }
  }

  printChartAndGrid(){
    let newWindow = window.open('', '', "width=800,height=600");
    let document = newWindow.document.open();
    let chartContent = this.tradeCostCurveReport.host[0].outerHTML;
    //let gridContent = this.tradeCostCurveReportGrid.jqxGrid.host.jqxGrid('exportdata','html');
    let grid : UrebalGridComponent = this.tradeCostCurveReportGrid;
    //let gridContent = grid.jqxGrid.host[0].innerHTML;

    grid.jqxGrid.hideloadelement();
    grid.jqxGrid.pageable(false);
    grid.setColumn('toleranceDifference','width','15%');
    grid.setColumn('totalBuyShares','width','15%');
    grid.setColumn('totalSellShares','width','15%');
    grid.setColumn('totalTurnOver','width','15%');

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
    newWindow.document.write('<div style="width: 100%; margin: 5px; display: flex; justify-content: center;"><h2>Trade Cost Curve Report</h2></div>');
    newWindow.document.write('<div style="width: 100%; display: flex; justify-content: center;">');
    newWindow.document.write(chartContent);
    newWindow.document.write('</div>');
    newWindow.document.write('<br>');
    newWindow.document.write('<div style="margin-left: 20px;">');
    newWindow.document.write($('#tradeCostCurveReport').html());
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

    grid.setColumn('toleranceDifference','width','25%');
    grid.setColumn('totalBuyShares','width','25%');
    grid.setColumn('totalSellShares','width','25%');
    grid.setColumn('totalTurnOver','width','25%');
    grid.jqxGrid.pageable(true);
  }

  exportToCsv(){
    let gridContent = this.tradeCostCurveReportGrid.jqxGrid.host.jqxGrid('exportdata','csv');
    let blob = new Blob([gridContent], {type: 'application/csv'});
    saveAs(blob,this.portfolio['portfolioName'] + " - Trade-Curve-Report.csv");
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
