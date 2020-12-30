import {Component, OnInit, ViewChild} from '@angular/core';
import {DriftService} from "../../../drifts/drift.service";
import {DriftDetailsComponent} from "../../../drifts/drift-details/drift-details.component";


@Component({
  selector: 'app-drift-report',
  templateUrl: './drift-report.component.html',
  styleUrls: ['./drift-report.component.css']
})
export class DriftReportComponent implements OnInit {

  public portfolioList = [];
  public portfolio = {
    portfolioId: undefined
  };
  public errMsg = '';
  public disableBtns = true;

  @ViewChild('driftDetail') drifDetail: DriftDetailsComponent;

  constructor(public driftService: DriftService) { }

  ngOnInit() {

    // true means apply filter which exclude Error and Unassigned from drift
    this.driftService.getDriftsList(true).subscribe(result => {
      this.portfolioList = result.responsedata.items;
    });

  }

  getReport(portfolio) {
    this.portfolio = portfolio;
    $('#printData').removeClass('slds-hide');
    //time out to wait for driftdetail component to be loaded else loadForParent on undefined error logged.
    setTimeout(()=> {
      this.drifDetail.loadForParent(this.portfolio['driftStatus']);
    },100);


  }

  driftDetailRes(flag) {
    if(flag) {
      this.errMsg = '';
      this.disableBtns = false;
    }else{
      this.errMsg = 'No drift reports found';
      this.disableBtns = true;
    }
  }

  printme() {
    this.disableBtns = true;
    $('.filter-options button').click();

    setTimeout(()=>{

      //var chartContent = $('#jqxChart')[0].outerHTML;


      let gridContent = this.drifDetail.gridComponent.jqxGrid.host.jqxGrid('exportdata', 'html');

      let newWindow = window.open('', '', 'width=800, height=500'),
        document = newWindow.document.open(),
        pageContent =
          '<!DOCTYPE html>\n' +
          '<html>\n' +
          '<head>\n' +
          '<meta charset="utf-8" />\n' +
          '<style>\n' +
          '.slds-size--1-of-1 {width: 100%;}\n'+
          '.slds-p-around--large {padding: 1.5rem;}\n' +
          '.slds-grid {display: -ms-flexbox;display: flex; }\n'+
          '.slds-col,[class*="slds-col_padded"],[class*="slds-col--padded"] {-ms-flex: 1 1 auto;flex: 1 1 auto; }\n'+
          '.slds-border--right {border-right: 1px solid #d8dde6;}\n'+
          '.slds-m-horizontal_medium,.slds-m-horizontal--medium {margin-right: 1rem;margin-left: 1rem;}\n'+
          '.text-color-dark--grey{color:#4d5054;fill:#4d5054;}\n'+
          '.slds-text-title--caps {font-size: 0.75rem;line-height: 1.25;color: #54698d;text-transform: uppercase;letter-spacing: 0.0625rem;}\n'+
          '.text-color-green--70b12a{color:#70b12a;fill:#70b12a;}\n'+
          '.slds-truncate {max-width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}\n'+
          '.slds-text-align_right,.slds-text-align--right {text-align: right;}\n'+
          '.text-bold{font-weight:bold;}\n'+
          'table{width: 97%;margin-left:7px}\n'+
          '</style>\n' +
          '</head>\n' +
          '<body>\n' + '<div><h1 style="text-align: center">'+$('.slds-page-header__title').html()+'</h1></div>' + $('#printSummary').html() + gridContent + '\n</body>\n</html>';
      /*document.write(pageContent);
       document.close();
       newWindow.print();*/

      setTimeout(() => {
        try {
          document.write(pageContent);
          document.close();
          newWindow.print();
          newWindow.close();
          this.disableBtns = false;
        }
        catch (error) {
          console.log(error)
        }
      },100);

    },200);
  }

  exportme() {

    $('.filter-options button').click()

    setTimeout(()=>{

      let gridContent = this.drifDetail.gridComponent.jqxGrid.host.jqxGrid('exportdata', 'csv', null);

      let blob = new Blob([this.generateCSV(gridContent)], {type: 'text/plain'});
      saveAs(blob,'Drift-Summary.csv');

    },300);
  }

  generateCSV(gridCSV) {
    let accountSummary = "";

    accountSummary += "Total Market Value,$"+this.drifDetail.totalMktVal.toFixed(2).replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,');
    accountSummary += ",Account Name,"+this.drifDetail.portfolioName+"\n";
    accountSummary += "Model,"+this.drifDetail.driftSummary.modelName;
    accountSummary += ",Total Free Cash Value,$"+this.drifDetail.totalFreeCashVal.toFixed(2).replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,')+"\n";
    accountSummary += "Total Securities Drifted,"+this.drifDetail.totalSecuritiesDrifted;
    accountSummary += ",Drift Last Run,"+this.drifDetail.driftDate;

    return accountSummary +"\n\n"+ gridCSV;
  }
}
