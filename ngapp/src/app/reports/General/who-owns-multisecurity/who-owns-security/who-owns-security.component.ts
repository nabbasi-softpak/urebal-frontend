import {AfterViewInit, Component, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';

import {UrebalGridComponent} from "../../../../shared/components/urebal-grid/urebal-grid.component";
import {ReportsService} from "../../../reports.service";
import {TickerInfo} from "../who-owns-multisecurity.component";


@Component({
  selector: 'app-who-owns-security',
  templateUrl: './who-owns-security.component.html',
  styleUrls: ['./who-owns-security.component.css']
})
export class WhoOwnsSecurityComponent implements AfterViewInit {

  private reportsArr = [];

  private selectedTicker: string;
  private MktPrice = 0;
  private totalShares = 0;
  private totalMktValue = 0;
  private errMsg: string = '';
  private disableBtns: boolean = true;

  public securityID : string;
  public securityName : string;
  public visible;

  @Input() uniqueID : string;
  @Input() showPageDivider : boolean;

  @Output() bindingCompleted = new EventEmitter();

  @ViewChild(UrebalGridComponent) whoOwnsMultiSecurityGrid:  UrebalGridComponent;

  constructor(public service: ReportsService) {}

  ngAfterViewInit() {

    //=== fixing css of grid left/right padding ===//
    $('#whoOwnsMultiSecurityGrid'+this.uniqueID).parents('.myContainer').eq(0).css("padding-left", "1rem").css("padding-right", "1rem")
      .removeClass("slds-p-around--medium").addClass("slds-p-around--small");
  }

  bindReportData(ticker: TickerInfo) {

    //=== enabling print buttons for all security grids if print dialog is closed. ====//
    $("[id ^=printButton]").attr("disabled","false");
    $("[id ^=printButton]").attr("title", "Print View");
    $("[id ^=exportButton]").attr("disabled","false");
    $("[id ^=exportButton]").attr("title", "Export");

    let grid : UrebalGridComponent = this.whoOwnsMultiSecurityGrid;

    this.selectedTicker = ticker.ticker;
    this.securityID = ticker.ticker;
    this.securityName = ticker.tickerName;
    this.MktPrice = ticker.tickerPrice;

    //==== if ticker is empty remove that Security Grid ====//
    if(!ticker || 0 === ticker.ticker.length) {
      //$('#printData'+this.uniqueID).addClass('slds-hide');
      //return;
    }

    //UILoader.blockUI.start();
    this.service.getTickerReport(ticker.ticker).subscribe(response => {
      if (response.code == 200) {
        this.errMsg = '';
        this.disableBtns = false;
        this.reportsArr = response.responsedata;

       /* if(this.reportsArr.length > 0) {
          this.securityID = this.reportsArr[0].securityId;
          this.securityName = this.reportsArr[0].securityName;
        }*/

        grid.refreshGrid(this.reportsArr);
        $('#printData'+this.uniqueID).removeClass('slds-hide');

        if(this.showPageDivider) {
          $('#pageDivider' + this.uniqueID).removeClass('slds-hide');
        }

        for (let i=0; i<this.reportsArr.length; i++) {
          //this.MktPrice = this.reportsArr[0].marketPrice;
          this.totalShares = this.totalShares + this.reportsArr[i].shares;
          this.totalMktValue = this.totalMktValue + this.reportsArr[i].marketValue;
        }

        this.bindingCompleted.emit(true);
      }
      else
      {
       /* this.securityID = ticker;
        this.securityName = ticker;*/

        grid.jqxGrid.clear();
        grid.jqxGrid.showemptyrow(true);
        this.errMsg = response.message;
        this.disableBtns = true;
        this.reportsArr = [];
        $('#printData'+this.uniqueID).removeClass('slds-hide');
        $('#pageDivider' + this.uniqueID).removeClass('slds-hide');
        //$('#printData'+this.uniqueID).addClass('slds-hide');
        //$('#pageDivider'+this.uniqueID).addClass('slds-hide');

        //this.errMsg = response.message;
        this.disableBtns = true;
        this.reportsArr = [];

        this.bindingCompleted.emit(true);
      }
      //UILoader.blockUI.stop();
    });

  }

  printReport() {

    let printContents, popupWin, printHeaderText;

    this.setGridtobePrintable();

    //Make a separate window to open the print contents.
    popupWin = window.open('', '', 'top=0,left=0');
    printHeaderText = 'Report - Who Owns (Multi Security)';
    printContents = document.getElementById("printData" + +this.uniqueID).innerHTML;

    //Open the Document
    popupWin.document.open();
    console.log('open');

    popupWin.addEventListener("unload", function(){
      console.log('print dialog unload event called!')

      //=== enabling print buttons for all security grids if print dialog is closed. ====//
      $("[id ^=printButton]").attr("disabled","false");
      $("[id ^=printButton]").attr("title", "Print View");
      $("[id ^=exportButton]").attr("disabled","false");
      $("[id ^=exportButton]").attr("title", "Export");
    }, false);

    this.setGridAtDefaultState();

    let protocol = window.location.protocol + '//';
    let host = window.location.host;

    console.log('write');
    popupWin.document.write(`
      <html>
      <head>
        <link rel="stylesheet" type="text/css" href=` + protocol + host + `/${this.service.getAppContext()}/assets/jqwidgets/styles/jqx.base.css />
        <link rel="stylesheet" type="text/css" href=` + protocol + host + `/${this.service.getAppContext()}/assets/styles/jqx.urebal.css />
        <link rel="stylesheet" type="text/css" href=` + protocol + host + `/${this.service.getAppContext()}/assets/css_framework/assets/styles/salesforce-lightning-design-system.css />
        <link rel="stylesheet" type="text/css" href=` + protocol + host + `/${this.service.getAppContext()}/assets/css/default.css />
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
      </head>
      <style>

     .myContainer{
     background-color: white;
     display: block!important;
     }

     .headerContainer {
     width: 150%;
     }

     @page {
     size: A4 Landscape;
     margin: 2mm 0 5mm 0;
     }

     @media print{
     .slds-item--label
     {
        width: 20% !important;
     }
     .slds-item--detail
     {
        width: 10% !important;
     }
     .no-print, .no-print *
     {
        display: none !important;
     }
     
     }
     
     </style>
     <body><h1 class="slds-page-header__title slds-align--absolute-center slds-m-around--xx-large">${printHeaderText}</h1>${printContents}</body>
    
      <script type="text/javascript">
      
      $(window).bind("load", function() {
          window.print();
          window.close();

      });
     
      </script>
      </html>`
    );

    popupWin.document.close();
    console.log('close')
  }

  setGridtobePrintable() {
    let grid : UrebalGridComponent = this.whoOwnsMultiSecurityGrid;

    //change grid column width so that it can resize into the print popup preview.
    grid.setColumn('accountId','width','15%');
    grid.setColumn('accountName','width','15%');
    grid.setColumn('portfolioPercentWeight','width','5%');
    grid.setColumn('shares','width','5%');
    grid.setColumn('marketValue','width','9%');
    grid.setColumn('unrealizedGainLoss','width','9%');

    grid.jqxGrid.hideloadelement();
    grid.jqxGrid.pageable(false);

    //=== disabling print buttons for all security grids if print dialog is opened. ====//
    $("[id ^=printButton]").attr("disabled","true");
    $("[id ^=printButton]").attr("title", "Please close the print window/dialog first.");
    $("[id ^=exportButton]").attr("disabled","true");
    $("[id ^=exportButton]").attr("title", "Please close the print window/dialog first.");

  }

  setGridAtDefaultState() {
    let grid : UrebalGridComponent = this.whoOwnsMultiSecurityGrid;
    //change the grid column width back to its normal state.
    grid.jqxGrid.pageable(true);
    grid.setColumn('accountId','width','22.5%');
    grid.setColumn('accountName','width','22.5%');
    grid.setColumn('portfolioPercentWeight','width','12.5%');
    grid.setColumn('shares','width','12.5%');
    grid.setColumn('marketValue','width','15%');
    grid.setColumn('unrealizedGainLoss','width','15%');
  }

  downloadReport() {
    if (typeof this.selectedTicker != 'undefined') {
      this.service.downloadReport(this.selectedTicker).subscribe(
        data => {},
        error => {}
        );
      // this.service.printReport(this.selectedTicker).subscribe(response => {
      //   saveAs(response,this.selectedTicker+".csv");
      //   let fileURL = URL.createObjectURL(response);
      //   window.open(fileURL);
      // })
    } else {
      alert('nothing to download.')
    }
  }

}
