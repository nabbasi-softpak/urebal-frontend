import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {UrebalGridComponent} from '../../../shared/components/urebal-grid/urebal-grid.component';
import {Router } from '@angular/router';
import {WorkspaceService} from "../../../workspaces/workspace.service";
import {saveAs} from "file-saver";


@Component({
  selector: 'workspace-summary-report',
  templateUrl: './workspace-summary-report.component.html',
  styleUrls: ['./workspace-summary-report.component.css']
})
export class WorkspaceSummaryReportComponent implements OnInit, AfterViewInit {

  public workspaceId : number;
  public workspaceName : string;
  public marketValue : number;
  public totalHouseholds : number;
  public totalAccounts : number;
  public rebalanceStatus : string;
  public disableBtns: boolean = false;

  constructor(protected router: Router, public workflowService: WorkspaceService) { }

  @ViewChild('workspacelist') workspacelist: UrebalGridComponent;

  ngOnInit() {

  }

  ngAfterViewInit()
    {
      /*** Make sure grid binding is completed and first row is selected which eventually will fire
          grid OnRowSelect method ***/
      this.workspacelist.jqxGrid.onBindingcomplete.subscribe( grid =>
        {
          this.workspacelist.jqxGrid.selectedrowindex(0);
        }
      );
  }

  gridOnRowSelect(rowData)
  {
    var workspace = rowData;

    this.workspaceId = workspace.workflowId;
    this.workspaceName = workspace.name;
    this.marketValue = workspace.totalMktVal;
    this.totalHouseholds = workspace.totalHouseholds;
    this.totalAccounts = workspace.totalAccounts;
    this.rebalanceStatus = workspace.rebalanceStatus;

    console.log('workspaceName: ' + workspace.name);
  }

  printReport() {
    this.disableBtns = true;
        let gridContent = this.workspacelist.jqxGrid.host.jqxGrid('exportdata', 'html');

        let newWindow = window.open('', '', 'width=800, height=500'),
          document = newWindow.document.open(),
          pageContent =
            '<!DOCTYPE html>\n' +
            '<html>\n' +
            '<head>\n' +
            '<meta charset="utf-8" />\n' +
            '</head>\n' +
            '<body>\n' + '<div><h1 style="text-align: center">'+$('.slds-page-header__title').html()+'</h1></div>' + gridContent + '\n</body>\n</html>';

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
      },1000);

  }

  exportReport() {
    let csv = " , , Workspace Summary Report\n";
      csv = csv + this.workspacelist.jqxGrid.host.jqxGrid('exportdata', 'csv');

    let blob = new Blob([csv], {type: 'text/plain'});
    saveAs(blob, 'Workspace-Summary-Report.csv')
  }


}
