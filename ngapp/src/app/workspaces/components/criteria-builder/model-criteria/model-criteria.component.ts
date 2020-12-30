import {Component, Input, Inject, ViewChild} from "@angular/core";
import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';
import {ModelService} from "../../../../model/model.service";
import {CriteriaService} from ".././criteria.service";
import {UILoader} from "../../../../shared/util/UILoader";
import {URebalService} from "../../../../services/urebal.service";

@Component({
  selector: 'app-model-criteria',
  templateUrl: './model-criteria.component.html'
})
export class ModelCriteriaComponent{

  @Input() componentIndex:number;
  public modelName:string = '';
  public modelOperator:string = 'Equal';
  public modelList: any;

  @ViewChild(AutocompleteComponent) autoComplete: AutocompleteComponent;

  constructor(public urebalService: URebalService, private criteriaService:CriteriaService, private modelService: ModelService) {
    UILoader.blockUI.start();
    criteriaService.notifyObservable$.subscribe((result) => {
      if(result.value.instance instanceof ModelCriteriaComponent && result.value.instance.componentIndex == this.componentIndex){
        let model = {
          ref: result.value,
          index: this.componentIndex
        }

        if(criteriaService.componentReferences.findIndex(value =>  value.index == model.index ) == -1 )
        {
          criteriaService.componentReferences.push(model);
        }


        if(result.hasOwnProperty('token')){
          this.modelOperator = criteriaService.convertOperator(result.token.operator);
          if (this.modelOperator == 'Contains') {
            this.modelName =  result.token.value.split('%')[1];
          } else {
            this.modelName = result.token.value.replace(/'/g,"");
          }
        }
      }
    });

    this.modelService.getModelsList().subscribe((result)=>{
      this.modelList = result.responsedata;
      UILoader.blockUI.stop();
    });

  }

  modelNameChange(e?){
    if(typeof e != 'undefined'){
        this.modelName = e;
    }

    if(this.modelName) {
      let token;
      if(this.modelOperator=="Contains"){
        token = "Model " + this.criteriaService.convertOperator(this.modelOperator) + " '%" + this.modelName + "%'";
      }else{
        token = "Model " + this.criteriaService.convertOperator(this.modelOperator) + " '" + this.modelName + "'";
      }
      let data = {
        ref: this.criteriaService.componentRefByIndex(this.componentIndex),
        token: token,
        index: this.componentIndex
      };
      this.criteriaService.notifyParentData(data);
    }
  }

  removeParameter(){
    let compRef = this.criteriaService.componentReferences;

    for(let reference of compRef){
      if(reference.index == this.componentIndex){
        reference.ref.destroy();
        let data = {ref:this.criteriaService.componentRefByIndex(this.componentIndex),isDelete:true,index:this.componentIndex};
        compRef.splice(compRef.indexOf(reference), 1);
        this.criteriaService.notifyParentData(data);
      }
    }
  }
}
