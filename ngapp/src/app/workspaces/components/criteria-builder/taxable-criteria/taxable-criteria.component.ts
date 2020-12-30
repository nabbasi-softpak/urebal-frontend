import {Component, Input, Inject} from "@angular/core";
import {CriteriaService} from ".././criteria.service";
import {URebalService} from "../../../../services/urebal.service";

@Component({
  selector: 'app-taxable-criteria',
  templateUrl: './taxable-criteria.component.html'
})
export class TaxableCriteriaComponent{

  @Input() componentIndex:number;
  public isTaxable:boolean = true;

  constructor(public urebalService: URebalService, private criteriaService:CriteriaService) {
    criteriaService.notifyObservable$.subscribe((result) => {
      if(result.value.instance instanceof TaxableCriteriaComponent && result.value.instance.componentIndex == this.componentIndex){
        let taxable = {
          ref: result.value,
          index: this.componentIndex
        }

        if(criteriaService.componentReferences.findIndex(value =>  value.index == taxable.index ) == -1 )
        {
          criteriaService.componentReferences.push(taxable);
        }


        if(result.hasOwnProperty('token')){
          if(result.token.value == 'true'){
            this.isTaxable = true;
          }else{
            this.isTaxable = false;
          }
        }else{
          this.onClick();
        }
      }
    });
  }

  onClick(value?){
    if(value != null) {
      this.isTaxable = value;
    }
    let token = "Taxable = "+this.isTaxable;
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
