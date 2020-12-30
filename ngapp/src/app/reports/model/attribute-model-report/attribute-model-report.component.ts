import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {UrebalGridComponent} from "../../../shared/components/urebal-grid/urebal-grid.component";
import {ModelService} from "../../../model/model.service";


@Component({
  selector: 'app-attribute-model-report',
  templateUrl: './attribute-model-report.component.html'
})
export class AttributeModelReportComponent implements OnInit {
  @ViewChild(UrebalGridComponent) modelsList: UrebalGridComponent;
  public allModel=[];
  public attributeModels=[];
  public model;
  public totalModels=0;
  public totalAssigned=0;
  public totalUnAssigned=0;
  public disableBtns: boolean = false;
  ngOnInit(){
  }

  constructor(public modelService:ModelService, router:Router) {

    modelService.get("models")
      .subscribe(
        result => {
          if (result.code == 200) {
            this.allModel = result.responsedata;
            for (let model of this.allModel) {
              if (model.modelTypeNum != "1") {
                this.attributeModels.push(model);
                ++this.totalModels;

                if(model.assignedAccountsCount>0) {
                  this.totalAssigned = this.totalAssigned + 1;
                }else{
                  this.totalUnAssigned = this.totalUnAssigned + 1;
                }
              }
            }
            this.modelsList.refreshGrid(this.attributeModels);
          }
        }
      );

  }

  selectModel(event:any) {
    if (event != null) {
      this.model = event;

    }
  }

  printReport() {
    this.disableBtns = true;
    let gridContent = this.modelsList.jqxGrid.host.jqxGrid('exportdata', 'html');

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
        this.disableBtns = true;
      }
      catch (error) {
        console.log(error)
      }
    },1000);

  }

  exportReport() {
    this.modelsList.exportData('csv', 'Attribute-Model-Report');
  }
}
