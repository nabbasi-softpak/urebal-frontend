import {Component, Input, Inject} from "@angular/core";
import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';
import {AccountService} from "../../../../account/account.service";
import {UILoader} from "../../../../shared/util/UILoader";
import {CriteriaService} from ".././criteria.service";
import {URebalService} from "../../../../services/urebal.service";

@Component({
  selector: 'app-acc-name-criteria',
  templateUrl: './acc-name-criteria.component.html'
})
export class AccountNameCriteriaComponent  {

  @Input() componentIndex:number;
  public accountName:string = '';
  public operator:string = 'Equal';
  public accountsList:any;

  constructor(public urebalService: URebalService, private criteriaService: CriteriaService, private accountService: AccountService) {
    UILoader.blockUI.start();
    criteriaService.notifyObservable$.subscribe((result) => {
      if(result.value.instance instanceof AccountNameCriteriaComponent && result.value.instance.componentIndex == this.componentIndex){
        let accountToken = {
          ref: result.value,
          index: this.componentIndex
        }

        if(criteriaService.componentReferences.findIndex(value =>  value.index == accountToken.index ) == -1 )
        {
          criteriaService.componentReferences.push(accountToken);
        }


        if(result.hasOwnProperty('token')){
          this.operator = criteriaService.convertOperator(result.token.operator);
          if (this.operator == 'Contains') {
            let accountNameValue = result.token.value.split('%');
            this.accountName = accountNameValue[1];
          } else {
            this.accountName = result.token.value.replace(/'/g,"");
          }
        }
      }
    });

    //Calling a new service that fetches only required data
    this.accountService.getPortfoliosListBrief().subscribe(result => {
      if(result.code == 200)
      {
        this.accountsList = result.responsedata;
      }
      else
      {
        console.error(result.message);
      }
      UILoader.blockUI.stop();
    });

  }

  accountNameOnBlur(account, accountModel) {
    this.accountName = account;

    if(this.accountName) {
      let token;
      if(this.operator=="Contains"){
        token = "Account Name " + this.criteriaService.convertOperator(this.operator) + " '%" + this.accountName + "%'";
      }else{
        token = "Account Name " + this.criteriaService.convertOperator(this.operator) + " '" + this.accountName + "'";
      }

      let data = {
        ref: this.criteriaService.componentRefByIndex(this.componentIndex),
        index: this.componentIndex,
        token: token
      };
      this.criteriaService.isCriteriaValid = true;
      this.criteriaService.notifyParentData(data);
    }else if(accountModel){
      this.criteriaService.isCriteriaValid = false;

    }
  }

  accountNameChange(account?, accountModel?){
    if(typeof account != 'undefined') {
      this.accountName = account.portfolioName;
    }

    if(this.accountName) {
      let token;
      if(this.operator=="Contains"){
        token = "Account Name " + this.criteriaService.convertOperator(this.operator) + " '%" + this.accountName + "%'";
      }else{
        token = "Account Name " + this.criteriaService.convertOperator(this.operator) + " '" + this.accountName + "'";
      }

      let data = {
        ref: this.criteriaService.componentRefByIndex(this.componentIndex),
        index: this.componentIndex,
        token: token
      };
      this.criteriaService.isCriteriaValid = true;
      this.criteriaService.notifyParentData(data);
    }else if(accountModel){
      this.criteriaService.isCriteriaValid = false;

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

  searchPortfolio($event: Event) {
    this.accountService.getPortfoliosListBriefFilter($event).subscribe(result => {
      if(result.code == 200)
      {
        this.accountsList = result.responsedata;
      }
      else
      {
        console.error(result.message);
      }
      UILoader.blockUI.stop();
    });
  }
}
