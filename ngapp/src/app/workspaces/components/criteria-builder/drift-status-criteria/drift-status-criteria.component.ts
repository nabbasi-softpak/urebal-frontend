import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CriteriaService} from "../criteria.service";
import {UrebalDropdownComponent} from "../../../../shared/components/urebal-dropdown/urebal-dropdown.component";
import {DriftStatus} from "../../../../account/account.service";
import {URebalService} from "../../../../services/urebal.service";

@Component({
  selector: 'app-drift-status-criteria',
  templateUrl: './drift-status-criteria.component.html',
  styles: []
})
export class DriftStatusCriteriaComponent implements OnInit {

  @Input() componentIndex:number;
  @ViewChild(UrebalDropdownComponent) dropdown : UrebalDropdownComponent;

  public driftStatusList = [];
  private driftStatus: string = "";
  private driftStatusValOperator: string = "IN";
  private checkedValues = [];

  constructor(public urebalService: URebalService, private criteriaService: CriteriaService) {
    this.driftStatusList = [
      { display: DriftStatus.STATUS_ERROR, value: DriftStatus.STATUS_ERROR },
      { display: DriftStatus.STATUS_UNASSINGED, value: DriftStatus.STATUS_UNASSINGED },
      { display: DriftStatus.STATUS_NEW_ACCOUNT, value: DriftStatus.STATUS_NEW_ACCOUNT },
      { display: DriftStatus.STATUS_NO_DRIFT, value: DriftStatus.STATUS_NO_DRIFT },
      { display: DriftStatus.STATUS_OUT_OF_TOLERANCE, value: DriftStatus.STATUS_OUT_OF_TOLERANCE_OR_CASH_IN },
      { display: DriftStatus.STATUS_CASH_IN, value: DriftStatus.STATUS_OUT_OF_TOLERANCE_AND_CASH_IN }

    ];

    criteriaService.notifyObservable$.subscribe((result) => {
      if (result.value.instance instanceof DriftStatusCriteriaComponent && result.value.instance.componentIndex == this.componentIndex) {
        let driftStatusToken = {
          ref: result.value,
          index: this.componentIndex
        }

        if (criteriaService.componentReferences.findIndex(value => value.index == driftStatusToken.index) == -1) {
          criteriaService.componentReferences.push(driftStatusToken);
        }

        if(result.token != undefined){
          //Replacing ", " with $, otherwise it will split "Out of tolerance, Cash in" value
          //Also replacing following characters excluding braces {(,),"} these character malformed the criteria string
          // such that checkItems function of angular dropdown class couldn't find them..
          let parseCriteriaValue:string = result.token.value.replace(/#/g,"").replace(/_/g," ").replace(", ","$").replace(", ","$").replace("(","").replace(")","").replace(/["]/g, "");
          this.checkedValues = parseCriteriaValue.split(",");
        }
      }
    });

    setTimeout(()=>{
      let dropDown = this.dropdown.dropdownList;
      for(let value of this.checkedValues){
        let dropdownValue: string = value;
        //Replacing $ with ", " to make it selectable in dropdown
        if(dropdownValue.indexOf("$") != -1){
          dropdownValue = dropdownValue.replace("$",", ");
        }
        dropDown.checkItem(dropdownValue);
      }
    },1000);
  }

  ngOnInit() {
  }

  selectDriftStatus(event?){
    this.driftStatus = "";
    let dropDown = this.dropdown.dropdownList;
    let getCheckedValue = dropDown.getCheckedItems();

    for(let index = 0; index < getCheckedValue.length; index++){
      let val = getCheckedValue[index].value;

      this.driftStatus += "\"" + val + "\"";
      if(index + 1 != getCheckedValue.length){
        this.driftStatus += ",";
      }
    }


    let data;
    if (this.driftStatus.length > 0) {
      let token = "DriftStatus " + this.criteriaService.convertOperator(this.driftStatusValOperator) + " (" + this.driftStatus + ") ";
      data = {ref: this.criteriaService.componentRefByIndex(this.componentIndex), token: token,index: this.componentIndex};
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
