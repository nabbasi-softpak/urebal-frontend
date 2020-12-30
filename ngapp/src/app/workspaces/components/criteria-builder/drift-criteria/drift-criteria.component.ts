import {Component, Input} from '@angular/core';
import {CriteriaService} from ".././criteria.service";
import {URebalService} from "../../../../services/urebal.service";

@Component({
  selector: 'app-drift-criteria',
  templateUrl: './drift-criteria.component.html'
})
export class DriftCriteriaComponent {

  @Input() componentIndex:number;
  public drift1:number = null;
  public drift2:number = null;
  public driftValOperator:string = 'Equal';
  public showRange: boolean = false;

  constructor(public urebalService: URebalService, private criteriaService:CriteriaService) {
    criteriaService.notifyObservable$.subscribe((result) => {
      if(result.value.instance instanceof DriftCriteriaComponent && result.value.instance.componentIndex == this.componentIndex){
        let driftToken = {
          ref: result.value,
          index: this.componentIndex
        };

        if(criteriaService.componentReferences.findIndex(value =>  value.index == driftToken.index ) == -1 )
        {
          criteriaService.componentReferences.push(driftToken);
        }

        if(result.hasOwnProperty('token')){
          this.driftValOperator = criteriaService.convertOperator(result.token.operator);
          if (this.driftValOperator.toLowerCase() == 'between') {
            let drifts = result.token.value.split('AND');
            this.drift1 = parseInt(drifts[0]);
            this.drift2 = parseInt(drifts[1]);

            this.showRange = true;
          } else {
            this.drift1 = parseInt(result.token.value);
          }
        }
      }
    });
  }

  onDriftChange(){
    if(this.drift1 != null || this.drift2 != null) {
      let data;
      if (this.driftValOperator != "Between") {
        let token = "Drift " + this.criteriaService.convertOperator(this.driftValOperator) + " " + this.drift1;
        data = {ref: this.criteriaService.componentRefByIndex(this.componentIndex), token: token,index: this.componentIndex};
        this.criteriaService.notifyParentData(data);
      } else if (this.drift1 != null && this.drift2 != null) {
        let token = "Drift " + this.criteriaService.convertOperator(this.driftValOperator) + " " + this.drift1 + " AND " + this.drift2;
        data = {
          ref: this.criteriaService.componentRefByIndex(this.componentIndex),
          token: token,
          index: this.componentIndex
        };
        this.criteriaService.notifyParentData(data);
      }
    }

  }

  onOperatorChange(operatorValue){
    if(operatorValue == "Between"){
      this.showRange = true;
    }else{
      this.showRange = false;
    }

    this.onDriftChange()
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
