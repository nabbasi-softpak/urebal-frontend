import {Component, OnInit, ViewChild} from '@angular/core';
import {UrebalGridComponent} from "../../shared/components/urebal-grid/urebal-grid.component";
import {AccountService} from "../../account/account.service";
import {UILoader} from "../../shared/util/UILoader";


@Component({
  selector: 'app-accounts-report',
  templateUrl: './accounts-report.component.html',
  styleUrls: ['./accounts-report.component.css']
})
export class AccountsReportComponent implements OnInit {

  @ViewChild(UrebalGridComponent) singleAccountsGrid :UrebalGridComponent;
  singleAccounts : number = 0;
  public disableBtns: boolean = false;


  constructor(public accountService:AccountService) { }

  ngOnInit() {
  }

  ngAfterViewInit()
  {
    /*** Make sure grid binding is completed to get Total number of single Accounts ***/
    this.singleAccountsGrid.jqxGrid.onBindingcomplete.subscribe( grid =>
      {
        this.singleAccounts  = this.singleAccountsGrid.getRows().length;
      }
    );

  }

  printReport(){
    // let newWindow = window.open('', '', 'top=0,left=0');
    // let gridContent = this.singleAccountsGrid.jqxGrid.host.jqxGrid('exportdata','html');
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
    //   '<title>Accounts Report</title>' +
    //   '</head>';
    //
    //
    //
    // newWindow.document.write(pageContent);
    // newWindow.document.write('<body>');
    // newWindow.document.write($('#printSummary').clone().html());
    // newWindow.document.write('<br>');
    // newWindow.document.write(gridContent);
    // newWindow.document.write('</body></html>');
    //
    //
    // try{
    //   setTimeout(()=>{
    //     newWindow.print();
    //     newWindow.close();
    //   },500);
    // }
    // catch (error) {
    //   console.log(error);
    // }


    // let rows = Object.assign([],this.singleAccountsGrid.getRows());

    // for(let count=0; count<rows.length; count++) {
    //
    //   if(rows[count].roundGainLossValue < 0)
    //   {
    //     let customValue = '('+rows[count].roundGainLossValue+')';
    //     rows[count].roundGainLossValue = customValue.replace('-','$');
    //   }
    // }

    this.disableBtns = true;
    let gridContent = this.singleAccountsGrid.jqxGrid.host.jqxGrid('exportdata', 'html', null);

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
        this.singleAccountsGrid.refreshGrid();
      }
      catch (error) {
        console.log(error)
      }
    },100);

  }

  downloadReport() {

    let csv =
      '"Number of Accounts:",' + this.singleAccounts +
      '\n\n' +
      this.singleAccountsGrid.jqxGrid.host.jqxGrid('exportdata', 'csv', null);
    let blob = new Blob([csv], {type: 'application/csv'});
    saveAs(blob,'SingleAccounts-Report.csv');
    this.singleAccountsGrid.refreshGrid();
  }
}
