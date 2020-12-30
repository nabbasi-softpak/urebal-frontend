import {Component, Input, Inject, OnDestroy} from "@angular/core";
import {CriteriaService} from ".././criteria.service";
import {URebalService} from "../../../../services/urebal.service";

@Component({
  selector: 'app-household-criteria',
  templateUrl: './household-criteria.component.html'
})
export class HouseholdCriteriaComponent{

  @Input() componentIndex:number;
  public isHousehold:boolean = true;

  constructor(public urebalService: URebalService, private criteriaService:CriteriaService) {
    criteriaService.notifyObservable$.subscribe((result) => {
      if(result.value.instance instanceof HouseholdCriteriaComponent && result.value.instance.componentIndex == this.componentIndex){
        let household = {
          ref: result.value,
          index: this.componentIndex
        }

        if(criteriaService.componentReferences.findIndex(value =>  value.index == household.index ) == -1 )
        {
          criteriaService.componentReferences.push(household);
        }


        if(result.hasOwnProperty('token')){
          if(result.token.value == 'true'){
            this.isHousehold = true;
          }else{
            this.isHousehold = false;
          }
        }else{
          this.onClick();
        }


      }
    });
  }

  onClick(value?){
    if(value != null){
      this.isHousehold = value;
    }
    let token = "Household = "+this.isHousehold;
    let data = {ref:this.criteriaService.componentRefByIndex(this.componentIndex),token:token,index:this.componentIndex};
    this.criteriaService.notifyParentData(data);
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
