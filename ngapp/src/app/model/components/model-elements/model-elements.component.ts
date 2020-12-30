import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {UrebalGridComponent} from "../../../shared/components/urebal-grid/urebal-grid.component";
import {ModelService} from "../../model.service";
import {UILoader} from "../../../shared/util/UILoader";
import {URebalService} from "../../../services/urebal.service";

@Component({
  selector: 'app-model-elements',
  templateUrl: './model-elements.component.html',
  styleUrls: ['./model-elements.component.css']
})
export class ModelElementsComponent implements OnInit {

  @ViewChildren(UrebalGridComponent) modelGrids : QueryList <UrebalGridComponent>;

  @Output() onComplete : EventEmitter<any> = new EventEmitter();
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  @Output() sleeve = new EventEmitter<any>();
  @Input() model:any;

  public modelSecurities:any;
  public modelSubModels:any[] = [];
  public randomGridID:string = '';

  constructor(private modelService:ModelService,public urebalService:URebalService) {
    this.randomGridID = '-'+Math.floor((Math.random() * 100000) + 1);
  }

  ngOnInit() {}

  loadData(model?) {
    this.model = (model != undefined)?model:this.model;
    if(this.model != undefined) {
      this.modelGrids.forEach(gridObject => {
        gridObject.refreshGrid([{}]);
      });
      //fetch security model elements of model type is 1 and AAM elements(SubModels) if model type is 3
      if (this.model.modelType == 1) {
        UILoader.blockUI.start('Loading Model...'); // Start blocking
        this.modelService.getModelElements(this.model.id)
          .subscribe(result => {
            if (result.code == 200) {
              this.modelSecurities = result.responsedata;
              this.model.modelType = 1;
              this.modelGrids.forEach(gridObject => {
                if (gridObject.gridId === "security-model-grid"+this.randomGridID) {
                  gridObject.refreshGrid(this.modelSecurities);
                }
                this.onComplete.emit();
              });
            } else {
              console.log(result.message);
            }
            UILoader.blockUI.stop();
          });
      } else if (this.model.modelType == 3) {
        UILoader.blockUI.start('Loading Model...'); // Start blocking
        this.modelService.getModelElements(this.model.id)
          .subscribe(result => {
            if (result.code == 200) {
              this.modelSubModels = [];
              for (let model of result.responsedata) {
                if (model.ratio == 0) {
                  continue;
                }
                let sleeve = {
                  id: model.sleeve.id,
                  name: model.sleeve.name.split("_" + this.model.name)[0],
                  ratio: model.ratio
                }
                this.modelSubModels.push(sleeve);

                this.sleeve.emit(sleeve);

              }
              this.modelGrids.forEach(gridObject => {
                if (gridObject.gridId === "attribute-model-grid"+this.randomGridID) {
                  gridObject.refreshGrid(this.modelSubModels);
                }
              });
              this.onComplete.emit();
            } else {
              this.modelSubModels = [];
              console.log(result.message);
            }
            //this.blockUI.stop();
            UILoader.blockUI.stop();
          });
      }
      if (this.model.modelType == 4) {
        UILoader.blockUI.start('Loading Model...'); // Start blocking
        this.modelService.getModelCompDistribution(this.model.id)
          .subscribe(result => {
            if (result.code == 200) {
              this.modelSecurities = result.responsedata;
              this.model.modelType = 4;
              this.modelGrids.forEach(gridObject => {
                if (gridObject.gridId === "security-model-grid"+this.randomGridID) {
                  gridObject.setColumn("ticker","text","Security ID/Model Name");
                  gridObject.refreshGrid(this.modelSecurities);
                }
                this.onComplete.emit();
              });
            } else {
              console.log(result.message);
            }
            UILoader.blockUI.stop();
          });
      }
    }
  }

  closeModal(){
    this.onClose.emit();
  }
}
