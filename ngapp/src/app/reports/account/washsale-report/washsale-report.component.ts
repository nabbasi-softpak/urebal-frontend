import {Component, OnInit, ViewChild} from '@angular/core';
import {AccountService} from "../../../account/account.service";
import {AutocompleteComponent} from "../../../shared/components/autocomplete/autocomplete.component";
import {UrebalGridComponent} from "../../../shared/components/urebal-grid/urebal-grid.component";
import {AccountSummaryComponent} from "../../../shared/components/account-summary/account-summary.component";
import {BlockUI, NgBlockUI} from "ng-block-ui";


@Component({
  selector: 'app-washsale-report',
  templateUrl: './washsale-report.component.html',
  styleUrls: ['./washsale-report.component.css']
})
export class WashsaleReportComponent implements OnInit {

  @ViewChild(AutocompleteComponent) autoComplete:AutocompleteComponent;
  @ViewChild(UrebalGridComponent) washSaleGrid: UrebalGridComponent;
  @ViewChild(AccountSummaryComponent) accountSummary: AccountSummaryComponent;

  public portfolioList = [];
  public accountWashsales: any;
  public errMsg: string = '';
  public disableBtns: boolean = true;

  loadingMsg : string = '';

  @BlockUI('loaderDiv') blockUI: NgBlockUI;

  constructor(public accountService: AccountService) {  }

  ngOnInit() {
     //this.startLoader();
      this.accountService.getPortfoliosList().subscribe(result => {
        this.portfolioList = result.responsedata;
        //this.stopLoader();
      });
  }

  getReport(portfolio) {
    $('#washSaleReportData').removeClass('slds-hide');
    this.accountSummary.loadSummary(portfolio.portfolioId);
    this.accountService.getWashSales(portfolio.portfolioId)
      .subscribe((result) => {
        if(result.code == 200){
          this.accountWashsales = result.responsedata;
          this.washSaleGrid.refreshGrid(this.accountWashsales);
          this.disableBtns = false;
          this.errMsg = '';

        }else {
          this.washSaleGrid.jqxGrid.clear();
          this.washSaleGrid.jqxGrid.showemptyrow(true);
          this.errMsg = result.message;
          this.disableBtns = true;
          this.accountWashsales = [];
        }
        this.autoComplete.item = '';
      });
  }

  printReport(){
    // let newWindow = window.open('', '', 'top=0,left=0');
    // let gridContent = this.washSaleGrid.jqxGrid.host.jqxGrid('exportdata','html');
    //
    // let pageContent =
    //   '<!DOCTYPE html>' +
    //   '<html>' +
    //   '<head>' +
    //   '<meta charset="utf-8" />' +
    //   '<link rel="stylesheet" href="/app/assets/css_framework/assets/styles/salesforce-lightning-design-system.css" media="all" />' +
    //   '<link rel="stylesheet" type="text/css" href=` + protocol + host + `/app/assets/jqwidgets/styles/jqx.base.css />' +
    //   '<link rel="stylesheet" type="text/css" href=` + protocol + host + `/app/assets/styles/jqx.urebal.css />' +
    //   '<link rel="stylesheet" type="text/css" href=` + protocol + host + `/app/assets/css_framework/assets/styles/salesforce-lightning-design-system.css />' +
    //   '<link rel="stylesheet" type="text/css" href=` + protocol + host + `/app/assets/css/default.css />' +
    //   '<title>Washsale Report</title>' +
    //   '</head>';
    //
    // newWindow.document.write(pageContent);
    // newWindow.document.write('<body>');
    // newWindow.document.write($('#printSummary').clone().html());
    // newWindow.document.write('<br>');
    // newWindow.document.write(gridContent);
    // newWindow.document.write('</body></html>');
    //
    // try{
    //   setTimeout(()=>{
    //     newWindow.print();
    //     newWindow.close();
    //   },100);
    // }
    // catch (error) {
    //   console.log(error);
    // }

    this.disableBtns = true;
    let gridContent = this.washSaleGrid.jqxGrid.host.jqxGrid('exportdata', 'html', null);

    let newWindow = window.open('', '', 'top=0,left=0'),
      document = newWindow.document.open(),
      pageContent =
        '<!DOCTYPE html>\n' +
        '<html>\n' +
        '<head>\n' +
        '<meta charset="utf-8" />\n' +
        '<style>\n' +
        '.slds-size--1-of-1 {width: 100%;}\n'+
        '.slds-align--absolute-center {display: -ms-flexbox;display: flex;-ms-flex-pack: center;justify-content: center;-ms-flex-line-pack: center;align-content: center;-ms-flex-align: center;align-items: center;margin: auto; }</script>\n' +
        '.color-white{background:#fff;}\n'+
        '.slds-grid {display: -ms-flexbox;display: flex; }\n'+
        '.slds-wrap {-ms-flex-wrap: wrap;flex-wrap: wrap;-ms-flex-align: start;align-items: flex-start; }\n'+
        '.slds-col,[class*="slds-col_padded"],[class*="slds-col--padded"] {-ms-flex: 1 1 auto;flex: 1 1 auto; }\n'+
        '.slds-size_1-of-2,.slds-size--1-of-2 {width: 50%; }\n'+
        '.slds-p-around_medium,.slds-p-around--medium {padding: 1rem; }\n'+
        '.text-color-grey--c4c6c7{color:#c4c6c7;fill:#c4c6c7;  }\n'+
        '.slds-size_2-of-2,.slds-size--2-of-2 {width: 100%;}\n'+
        '.slds-size_1-of-3,.slds-size--1-of-3 {width: 33.3333333333%; }\n'+
        '.slds-border_top,.slds-border--top {border-top: 1px solid #d8dde6; }\n'+
        '.text-color-price{color:#4caf50;fill:#4caf50;}\n'+
        'table{width: 97%;margin-left:7px}\n'+
        '</style>\n' +
        '</head>\n' +
        '<body>\n' + '<div><h1 style="text-align: center">'+$('.slds-page-header__title').html()+'</h1></div>' + $('#printSummary').html() + gridContent + '\n</body>\n</html>';

    setTimeout(() => {
      try {
        document.write(pageContent);
        document.close();
        newWindow.print();
        newWindow.close();
        this.disableBtns = false;
        this.washSaleGrid.refreshGrid();
      }
      catch (error) {
        console.log(error)
      }
    },100);
  }

  downloadReport() {

    let type = (typeof $('#account-type').html() !== 'undefined')?'"Type","'+$('#account-type').html()+'","","",':'';
    let tax = (typeof $('#account-tax').html() !== 'undefined')?'"Taxable","'+$('#account-tax').html()+'"\n':'\n';
    let freecash = (typeof $('#account-freecash').html() !== 'undefined')?'"Free Cash","'+$('#account-freecash').html():'';
    let corecash = (typeof $('#account-corecash').html() !== 'undefined')?'","","","Core Cash","'+$('#account-corecash').html()+'"\n':'';

    let csv = '"Account Name","'+$('#account-title').html()+
      '","","","Account ID","'+$('#account-id').html()+'"\n'+
      type + tax +
      '"Market Value","'+$('#account-mkv').html()+
      '","","","No. of holdings","'+$('#account-holdings').html()+'"\n'+
      freecash+
      corecash+ '\n\n' +
      this.washSaleGrid.jqxGrid.host.jqxGrid('exportdata', 'csv', null);
    let blob = new Blob([csv], {type: 'application/csv'});
    saveAs(blob,'Washsale-Report.csv');
    this.washSaleGrid.refreshGrid();
  }

  private startLoader() {
    this.loadingMsg = 'Loading account names please wait...';
    this.blockUI.start();
    this.autoComplete.disableCondition = "true";
  }

  private stopLoader(){
    this.loadingMsg = '';
    this.blockUI.stop();
    this.autoComplete.disableCondition = "";
  }
}
