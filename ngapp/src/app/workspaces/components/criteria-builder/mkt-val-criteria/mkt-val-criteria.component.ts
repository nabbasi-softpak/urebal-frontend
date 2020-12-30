import {Component, Input, Inject} from "@angular/core";

import {CriteriaService} from ".././criteria.service";
import {URebalService} from "../../../../services/urebal.service";

@Component({
  selector: 'app-mkt-val-criteria',
  templateUrl: './mkt-val-criteria.component.html'
})
export class MarketValueCriteriaComponent {

  @Input() componentIndex:number;
  public marketValue1:number = null;
  public marketValue2:number = null;
  public marketValOperator:string = 'Equal';
  public showRange: boolean = false;

  constructor(public urebalService: URebalService, private criteriaService:CriteriaService) {
    criteriaService.notifyObservable$.subscribe((result) => {
      if(result.value.instance instanceof MarketValueCriteriaComponent && result.value.instance.componentIndex == this.componentIndex){
        let marketValueToken = {
          ref: result.value,
          index: this.componentIndex
        };

        if(criteriaService.componentReferences.findIndex(value =>  value.index == marketValueToken.index ) == -1 )
        {
          criteriaService.componentReferences.push(marketValueToken);
        }


        if(result.hasOwnProperty('token')){
          this. marketValOperator= this.criteriaService.convertOperator(result.token.operator);
          if (this.marketValOperator.toLowerCase() == 'between') {
            let marketValues = result.token.value.split('AND');
            this.marketValue1 = parseInt(marketValues[0]);
            this.marketValue2 = parseInt(marketValues[1]);

            this.showRange = true;
          } else {
            this.marketValue1 = parseInt(result.token.value);
          }
        }
      }
    });
  }


  marketValueChange(){
    if(this.marketValue1 != null || this.marketValue2 != null) {
      if (this.marketValOperator != "Between") {
        let token = "Portfolio Market Value " + this.criteriaService.convertOperator(this.marketValOperator) + " " + this.marketValue1;
        let data = {
          ref: this.criteriaService.componentRefByIndex(this.componentIndex),
          token: token,
          index: this.componentIndex
        };
        this.criteriaService.notifyParentData(data);
      } else if (this.marketValue1 != null && this.marketValue2 != null) {
        let token = "Portfolio Market Value " + this.criteriaService.convertOperator(this.marketValOperator) + " " + this.marketValue1 + " AND " + this.marketValue2;
        let data = {
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
    } else{
      this.showRange = false;
    }

    this.marketValueChange();
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
