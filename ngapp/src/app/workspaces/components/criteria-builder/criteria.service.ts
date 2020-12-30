import {Injectable, ComponentRef, Component} from '@angular/core';
import {Subject} from "rxjs";
import {URebalService} from "../../../services/urebal.service";
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable()
export class CriteriaService extends URebalService {


  GET_CRITERIA_BY_NAME = "CriteriaWS/getCriteriaByName";
  GET_CRITERIA_LIST = "CriteriaWS/getCriteriaList";
  SAVE_CRITERIA = "CriteriaWS/saveCriteria";


  private notifyParent = new Subject<any>();
  private notify = new Subject<any>();
  private position:number=0;
  private criteria:string;
  private quoteBegin:boolean;
  private tokenComplete:boolean;
  private relationalSepList:String[]= [">" , "<" , "=", "!=", "<>", ">=", "<=", "BETWEEN", "LIKE", "IN"];
  private logicalSepList:String[] = ["AND","OR"]
  private builder:string = '';
  private isLogicalOperator:boolean = false;
  componentReferences:any=[];
  isCriteriaValid = false;

  /**
   * Observable string streams
   */
  notifyObservableParent$ = this.notifyParent.asObservable();
  notifyObservable$ = this.notify.asObservable();

  constructor(http: HttpClient, localStorage: LocalStorageService) {
    super(http, localStorage);
  }

  getCriteriaByName(templateName){
    return this.get(this.GET_CRITERIA_BY_NAME + "?template=" + templateName);
  }

  getCriteriaList(){
    return this.get(this.GET_CRITERIA_LIST);
  }
  saveCriteria(Criteria){
    return this.postForm(this.SAVE_CRITERIA,Criteria);
  }

  public notifyOther(data: any) {
    if (data) {
      this.notify.next(data);
    }
  }

  public notifyParentData(data: any) {
    if (data) {
      this.notifyParent.next(data);
    }
  }

  generateCriteriaString(tokensList:any):string{

    let criteriaString = '';

    let allTokens = [];

    for (let tokenIndex in tokensList) {
      allTokens.push(tokensList[tokenIndex].token);
    }

    let tokenCount = 0;
    for(let token of allTokens){
      tokenCount++;
      criteriaString = criteriaString.concat(token);
      if(tokenCount != allTokens.length){
        criteriaString = criteriaString.concat(' AND ')
      }
    }

    return criteriaString;
  }

  componentRefByIndex(index):ComponentRef<Component>{
    for(let compRef of this.componentReferences){
      if(compRef.index == index){
        return compRef.ref;
      }
    }
  }

  public convertOperator(operator): string{
    if(operator == "Equal"){
      return "="
    }else if(operator == "Not Equal"){
      return "!="
    }else if(operator == "Contains"){
      return  "LIKE";
    }else if(operator == "Greater"){
      return  ">";
    }else if(operator == "Greater or Equal"){
      return  ">=";
    }else if(operator == "Less"){
      return  "<";
    }else if(operator == "Less or Equal"){
      return  "<=";
    }else if(operator == "Between"){
      return  "BETWEEN";
    }else if(operator == "="){
      return "Equal"
    }else if(operator == "!="){
      return "Not Equal"
    }else if(operator == "LIKE"){
      return  "Contains";
    }else if(operator == ">"){
      return  "Greater";
    }else if(operator == ">="){
      return  "Greater or Equal";
    }else if(operator == "<"){
      return  "Less";
    }else if(operator == "<="){
      return  "Less or Equal";
    }else if(operator == "BETWEEN"){
      return  "Between";
    }else if(operator == "IN"){
      return  "IN";
    }
  }

  /**
   * Criteria Builder code Starting
   */
  tokenize(criteriaString):string[] {


    let criteriaArr = criteriaString.split(" ");
    let isBetween = false;
    let exp = [];
    let currExp = [];
    for (let e of criteriaArr) {
      if (e == 'AND' && isBetween == false) {
        exp.push(currExp.join(" "));
        currExp = []
      }
      else if (e == 'BETWEEN') {
        isBetween = true;
        currExp.push(e);
      }
      else if (e == 'AND' && isBetween == true) {
        isBetween = false;
        currExp.push(e);
      }
      else {
        currExp.push(e);
      }
    }
    exp.push(currExp.join(" "));
    return exp;
  }

  private nextChar():boolean {
    let currentChar = this.criteria.charAt(this.position++);
    let skipIteration = false;
    switch (currentChar)
    {
      case '"':
        skipIteration = this.handleQuote(currentChar);
        break;
      case '\'':
        skipIteration = this.handleQuote(currentChar);
        break;
      case ' ':
        skipIteration = this.handleSpace(currentChar);
        break;
      default:
        this.builder = this.builder.concat(currentChar);
        break;
    }

    return skipIteration;
  }

  private handleQuote(currentChar):boolean {
    if(this.position >= 2 && this.criteria.charAt(this.position-2) == '\\') {
      // this is an escaped quote within the quote string
      this.builder = this.builder.concat(currentChar);
    }
    else {
      if (this.quoteBegin) {
        // ending of a value string
        this.tokenComplete = true;
      } else {
        // starting of a value string
        this.quoteBegin = true;
        return true;
      }
    }
    return false;
  }

  private handleSpace(currentChar):boolean {
    if(this.quoteBegin)
    {
      this.builder = this.builder.concat(currentChar);
    }
    else if(this.builder.length > 0)
    {
      this.tokenComplete = true;
    }
    else
    {
      // skip
      return true;
    }
    return false;
  }

  public invokeTokenGenerator(builder,strField,strOperator,strValue) {
    let strToken = builder;

    let shouldBreak;

    if(this.logicalSepList.indexOf(strToken.toUpperCase()) >= 0 && strField == null) {
      this.isLogicalOperator = true;
      shouldBreak = true;
    }else {

      if (strField == null) {
        strField = strToken;
      }
      else if (strOperator == null && this.relationalSepList.indexOf(strToken.toUpperCase()) >= 0) {
        strOperator = strToken;
      }
      else {
        if (strOperator == null) {
          strField = strField + " " + strToken;
        }
        else if ("BETWEEN" == strOperator) {
          if (strValue == null) {
            strValue = strToken;
          }
          else {
            strValue = strValue + " " + strToken;
            if ("AND" != strToken) {
              // break out of loop, one expression is parsed
              shouldBreak = true;
            }
          }
        }
        else {
          strValue = strToken;
          // break out of loop, one expression is parsed
          shouldBreak = true;
        }
      }
    }

    let returnToken = {
      strField : strField,
      strValue : strValue,
      strOperator: strOperator,
      shouldBreak: shouldBreak
    }

    return returnToken;
  }

}
