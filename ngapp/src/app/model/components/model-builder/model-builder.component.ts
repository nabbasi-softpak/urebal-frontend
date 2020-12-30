import {
  Component, OnInit, Output, EventEmitter, Input, ViewChildren, QueryList, AfterViewInit
} from '@angular/core';
import {ModelService} from '../../model.service';
import {URebalService} from "../../../services/urebal.service";
import { AutocompleteComponent } from '../../../shared/components/autocomplete/autocomplete.component';
import {UILoader} from "../../../shared/util/UILoader";
import {delay} from "rxjs/operators";


@Component({
  selector: 'model-builder',
  templateUrl: './model-builder.component.html',
  styleUrls: ['./model-builder.component.css']
})
export class ModelBuilderComponent implements OnInit,AfterViewInit {

  private securities:any=[];
  private securitiesMaster:any={};
  @Input() isSecurityModel:boolean;
  @Input() isEditSecurityModel:boolean;
  private filteredSecurities:any=[];
  private securityExist:string;
  private modelSecurities:any=[];
  @Output() modelOutput = new EventEmitter();
  private modelElements:any = [];
  private invalidTargetMinMax:boolean = true;
  private selectedTickerName: string = '';
  priceListArray: any;
  private securityStyle: string = '';
  private securitySector: string = '';
  private securitySize: string = '';
  public securityModel: any;
  private fetchingPrice:boolean = false;


  @Input() selectedAttributes:any = [];
  private selectedAttributeSecurities:any=[]; // This list contains selected securities against each selected attribute like key value pair (attributeName,securitiesArray)
  //@ViewChildren(UrebalAutocompleteComponent) inputsList : QueryList <UrebalAutocompleteComponent>;

  @ViewChildren(AutocompleteComponent) inputsList: QueryList <AutocompleteComponent>;
  constructor(private modelService:ModelService,private urebalService:URebalService) {}

  ngOnInit() {
    if(this.isSecurityModel) {
      if (!this.isEditSecurityModel) {
        this.getSecurities();
      }
    }
  }

  ngAfterViewInit() {
    this.inputsList.changes
    /* Introducing delay so the the below code run in a separate context and does not interfere with the Angular change detection flow. Please see below Reference:
    Reference: ExpressionChangedAfterItHasBeenCheckedError (https://blog.angular-university.io/angular-debugging/)
    Note: Angular skips some checks (e.g. change detection after AfterViewInit) while in production mode and hence in production mode we will not see
    "ExpressionChangedAfterItHasBeenCheckedError". Please see below Reference:
    (https://medium.com/@ali.dev/expressionchangedafterithasbeencheckederror-in-angular-what-why-and-how-to-fix-it-c6bdc0b22787)
    */
    .pipe(delay(0))
      .subscribe(changes => { this.bindAutoComplete(changes);});
  }

  getSecurities(){
    if(this.securities.length == 0) {
      UILoader.blockUI.start("Fetching security prices...");
      this.fetchingPrice = true;
      this.modelService
        .getPriceList()
        .subscribe(
          result => {
            this.fetchingPrice = false;
            if(result.code == 200){
              this.securities = result.responsedata;
              this.setSecurityModelData(this.securityModel);
            }else if(result.code == 404){
              this.urebalService.notifyAppComponentCall("Securities not found, please import securities to use this feature.")
            }else{
              console.error(result.message);
            }
            this.inputsList.forEach(inputObject => {
              if(inputObject.inputID === "securityAutoComplete"){
                inputObject.items  = this.securities;
              }
            });
          },
          err => {
            this.fetchingPrice = false;
            console.error(err);
            UILoader.blockUI.stop();
          }, () => UILoader.blockUI.stop()
        );
    }
  }

  onSecuritySelect(item){
    if(item != null){
      if(this.filteredSecurities.indexOf(item) >= 0){
        this.securityExist='Security already exists';
      }else {
        this.filteredSecurities.push(item);

        let isPriceZero=false;
        for(let security of this.securities){
          if(security.ticker == item){
            isPriceZero = security.price == 0?true:false;
            break;
          }
        }

        let modelSec = {
          security: item,
          target:null,
          min:null,
          max:null,
          invalid:true,
          error:"",
          isPriceZero: isPriceZero,
          tickerName: ''
        }

        this.getSelectedTickerName(this.securities,item,modelSec);
        this.getAttrSummary(item,modelSec, this.modelSecurities,'CREATE','SECURITY');
        this.modelOutput.emit(this.modelSecurities);
        this.securityExist='';

        //Defect#201: removing the item from input-box as item has already been selected
        //commented as this causes an error on console for edit mode of model
        //this.inputsList.first.item='';

      }

    }
  }

  onSecuritiesSelect(advancedSearchSecurities: any[], attribute){
    $('#'+attribute.attributeId+'_securityExist').hide();
    advancedSearchSecurities.forEach(security => {
      this.selectAttributeSecurity(security.securityId, attribute);
    });
  }

  removeSecurity(secDetails,attribute?){
    if(attribute){
      this.selectedAttributeSecurities[attribute.attributeName].splice(this.selectedAttributeSecurities[attribute.attributeName].indexOf(secDetails.ticker),1);

      let attributeIndex = this.selectedAttributes.indexOf(attribute);
      let modelElements = this.selectedAttributes[attributeIndex].modelElements;
      this.selectedAttributes[attributeIndex].modelElements.splice(modelElements.indexOf(secDetails),1);
      this.modelOutput.emit(this.selectedAttributes);
    }else {
      let secIndex = this.filteredSecurities.indexOf(secDetails.security);
      if (secIndex >= 0) {
        this.filteredSecurities.splice(secIndex, 1);
      }

      for (let modelSec of this.modelSecurities) {
        if (modelSec.security == secDetails.security) {
          this.modelSecurities.splice(this.modelSecurities.indexOf(modelSec), 1);
          break;
        }
      }
      this.modelOutput.emit(this.modelSecurities);
    }
  }

  setSecurityModelData(modelData){
    if(this.isSecurityModel) {
      if (modelData != undefined) {
        for (let element of modelData.elements) {
          this.filteredSecurities.push(element.ticker);
          let elem = {
            security: element.ticker,
            target: element.target,
            min: element.min,
            max: element.max,
            invalid: false,
            error: "",
            isPriceZero: element.isPriceMiss
          }
          this.modelSecurities.push(elem);
        }
        this.getAttributeSummaryBySecurities([this.modelSecurities],1);

      }
    }
  }


  deleteAttribute(attribute){
    delete this.selectedAttributeSecurities[attribute.attributeName]
    this.selectedAttributes.splice(this.selectedAttributes.indexOf(attribute),1);
    this.modelOutput.emit(this.selectedAttributes);
  }

  changeSecurityDetails(changeField,security,attribute?){
    if(changeField == "min"){
      if(isNaN(security.min) || security.min == null || security.min == ""){
        security.min = 0.0;
      }
      if(attribute){
        security.absMin = (attribute.attributeTarget * security.min / 100).toFixed(3);
      }
    }else if(changeField == "max"){
      if(isNaN(security.max) || security.max == null || security.max == ""){
        security.max  = 0.0;
      }
      if(attribute){
        security.absMax = (attribute.attributeTarget * security.max / 100).toFixed(3);
      }
    }else if(changeField == "target"){
      if(isNaN(security.target) || security.target == null || security.target == ""){
        security.target  = 0.0;
      }
      if(attribute){
        security.absTarget = (attribute.attributeTarget * security.target / 100).toFixed(3);
      }
    }
    this.validateTargetMinMax(security,attribute);
    security.invalid = this.invalidTargetMinMax;

    if(this.isSecurityModel) {
      this.modelOutput.emit(this.modelSecurities);
    }else{
      this.modelOutput.emit(this.selectedAttributes);
    }
  }

  changeAttributeTarget(attribute){
    if(attribute != 'cashAttribute') {
      if(isNaN(attribute.attributeTarget)){
        attribute.attributeTarget = 0;
      }
      this.updateAbsolute(attribute);
      this.modelOutput.emit(this.selectedAttributes);
    }else{

    }
  }

  updateAbsolute(attribute){
    for(let element of attribute.modelElements){
      element.absTarget = (attribute.attributeTarget * element.target/ 100).toFixed(3);
      element.absMin = (attribute.attributeTarget * element.min/ 100).toFixed(3);
      element.absMax = (attribute.attributeTarget * element.max/ 100).toFixed(3);
    }
  }

  validateTargetMinMax(security,attribute?):boolean{
    if(parseFloat(security.target) == undefined || parseFloat(security.min) == undefined || parseFloat(security.max) == undefined){
      this.invalidTargetMinMax = true;
      return;
    }else if(parseFloat(security.target) < parseFloat(security.min) ||  parseFloat(security.target) > security.max){
      this.invalidTargetMinMax = true;
      security.error = 'Target% cannot be less than Min% or greater than Max%.';
      return;
    }else if(parseFloat(security.min) > parseFloat(security.target)  || parseFloat(security.min) > parseFloat(security.max)){
      this.invalidTargetMinMax = true;
      security.error = 'Min% cannot be greater than Target% or Max%.';
      return;
    }

    security.error = '';
    this.invalidTargetMinMax = false;

    if(!this.isSecurityModel){
      let totalAttributeTarget = 0;
      for(let element of attribute.modelElements){
        totalAttributeTarget += parseFloat(element.target);
      }

      if(totalAttributeTarget > 100 || totalAttributeTarget < 100){
        attribute.attributeError='Model sleeve "'+attribute.attributeName+'" target should be equal to 100%.'
      }else{
        attribute.attributeError=''
      }
    }
    return;
  }

  modelAttributeCollapse(id) {
    var collapsible_body = $('#'+id).next().next();

    if(collapsible_body.hasClass('ur-is-open')){
      collapsible_body.removeClass('ur-is-open').hide('fast');
      $('#'+id).find('.chevronDown').show();
      $('#'+id).find('.chevronUp').hide();
    }else{
      collapsible_body.addClass('ur-is-open ur-is-active').show('fast');
      $('#'+id).find('.chevronDown').hide();
      $('#'+id).find('.chevronUp').show();
    }
  }

  modelAttributeAdd(attribute){
    if(this.selectedAttributes.indexOf(attribute) >= 0){
      //Get Security Master data for filtering attribute security for security detail
      //let securitiesMaster = {};
      if(this.fetchingPrice === false) {
        UILoader.blockUI.start("Fetching security prices...");
        this.fetchingPrice = true;
        this.modelService
          .getPriceList()
          .subscribe(
            result => {
              this.fetchingPrice = false;

              if (result.code == 200) {
                this.priceListArray = result.responsedata;

                for (let index = 0; index < result.responsedata.length; index++)
                {
                  let security = result.responsedata[index];
                  this.securitiesMaster[security.ticker] = security;
                }

                this.bindAutoComplete(this.inputsList);

              } else if (result.code == 404) {
                this.urebalService.notifyAppComponentCall("Securities not found, please import securities to use this feature.")
              } else {
                console.error(result.message);
              }
            },
            err => {
              this.fetchingPrice = false;
              console.error(err);
              UILoader.blockUI.stop();
            }, () => UILoader.blockUI.stop()
          );
      }

      if(this.selectedAttributeSecurities[attribute.attributeName] == null){
        let securityList = [];
        for(let security of attribute.modelElements){
          securityList.push(security.ticker)
        }
        this.selectedAttributeSecurities[attribute.attributeName] = securityList;
      }
    }else{
      delete this.selectedAttributeSecurities[attribute.attributeName];
    }
  }

  bindAutoComplete(autoCompleteList:QueryList<AutocompleteComponent>) {

    autoCompleteList.forEach(inputObject => {
      let securityArray = [];
      let attribute = this.getSelectedAttribute(inputObject.inputID);
      if(attribute === undefined)
        return;

      //Extract attribute securities form security master and assign list to autocomplete
      attribute.attributeSecurities.forEach(attributeSecurity=>{
       if(typeof this.securitiesMaster[attributeSecurity.securityID] != "undefined") {
        securityArray.push(this.securitiesMaster[attributeSecurity.securityID]);
       }
      })

      inputObject.items = securityArray;
      this.updateAbsolute(attribute);
    });
  }


  selectAttributeSecurity(security,attribute){
    if(security != null){
      //Checking if the security already exist in the attribute's selected securities
      if(this.selectedAttributeSecurities[attribute.attributeName] && this.selectedAttributeSecurities[attribute.attributeName].indexOf(security) >= 0){
        $('#'+attribute.attributeId+'_securityExist').show();
      }else {
        this.selectedAttributeSecurities[attribute.attributeName].push(security);

        $('#'+attribute.attributeId+'_securityExist').hide();

        let modelSec = {
          ticker: security,
          target:null,
          min:null,
          max:null,
          invalid:true,
          error:"",
          isPriceZero: false,
          absTarget:null,
          absMin:null,
          absMax:null,
          tickerName: ''
        };

        this.getSelectedTickerName(this.priceListArray,security,modelSec);
        this.getAttrSummary(security,modelSec, this.selectedAttributes[this.selectedAttributes.indexOf(attribute)].modelElements,'CREATE','ATTRIBUTE');
        this.modelOutput.emit(this.selectedAttributes);
      }

    }
  }

  getSelectedTickerName(array,security,modelSec) {
    let index = array.findIndex(sec => sec.ticker == security);
    if (index >= 0) {
      modelSec.tickerName = array[index].tickerName;
    }
  }

   getAttrSummary(item,modelSec,dataArray,modelForm,modelType){
    UILoader.blockUI.start("Loading attribute summary...");
    this.modelService.getAttributeSummarybySecurity(item).subscribe(result => {
      if (result.code == 200) {
        for(let i=0; i<result.responsedata.length; i++) {
          if (result.responsedata[i].attributeType == 'Size') {
            modelSec.size = result.responsedata[i].attributeName;
          }
          else if (result.responsedata[i].attributeType == 'Style') {
            modelSec.style = result.responsedata[i].attributeName;
          }else {
            modelSec.sector = result.responsedata[i].attributeName;
          }
        }

        if (modelForm == 'EDIT') {
          let index;
          if (modelType == 'SECURITY') {
            index = dataArray.findIndex(data => data.security == item);
            modelSec.security = item;
          }else {
            index = dataArray.findIndex(data => data.ticker == item);
          }
          if (index >= 0) {
            dataArray[index] = modelSec;
          }
        }else {
          dataArray.push(modelSec);
        }
      }
      else {
        modelSec.size = '';
        modelSec.sector = '';
        modelSec.sector = '';
      }
    }, error => UILoader.blockUI.stop(),
        () => UILoader.blockUI.stop()
    );
  }


  getAttributeSummaryBySecurities(data,modelType) {
    UILoader.blockUI.start('Loading Model...');
    let securitiesArr: any = [];
    let index;

      if (modelType == 1) {
        this.getAllSecurities(data[0],securitiesArr,modelType);
      }else {
        for (let i=0; i<data.length; i++) {
          this.getAllSecurities(data[i].sleeve.elements,securitiesArr,modelType);
        }
      }

      let params = '';
      securitiesArr.forEach(security=>{
        params += "securityID="+ security + "&";
      });

      this.modelService.getAttribyteSummaryByAllSecurities(params.slice(0, -1)).subscribe(result => {
        if (modelType == 1){
          this.modelOutput.emit(this.modelSecurities);
        }

        if(result.code != 200)
          return;

        for (let j=0; j<data.length; j++) {
          for (let k=0; k<result.responsedata.length; k++) {
            if (modelType == 1) {
              index  = data[j].findIndex(row => row.security == result.responsedata[k].SECURITY_ID);
            }else {
              index = data[j].sleeve.elements.findIndex(row => row.ticker == result.responsedata[k].SECURITY_ID);
            }

            if (index >= 0) {
              if (modelType == 1) {
                data[j][index].tickerName = result.responsedata[k].SECURITY_DESCRIPTION;
                data[j][index].size = result.responsedata[k].SIZE;
                data[j][index].sector = result.responsedata[k].SECTOR;
                data[j][index].style = result.responsedata[k].STYLE;
              }else {
                data[j].sleeve.elements[index].tickerName = result.responsedata[k].SECURITY_DESCRIPTION;
                data[j].sleeve.elements[index].size = result.responsedata[k].SIZE;
                data[j].sleeve.elements[index].sector = result.responsedata[k].SECTOR;
                data[j].sleeve.elements[index].style = result.responsedata[k].STYLE;
              }
            }
          }
        }
      }, error => UILoader.blockUI.stop(),
          () => UILoader.blockUI.stop());


  }

  getAllSecurities(data,arr,modelType) {
    for(let i=0; i<data.length; i++) {
      if (modelType == 1) {
        arr.push(data[i].security);
      }else {
        arr.push(data[i].ticker);
      }
    }
    return arr;
  }





  public resetSelectedAttributeSecurities(){
    this.selectedAttributeSecurities = [];
  }

  getSelectedAttribute(inputID: string) {
    for(let index=0; index < this.selectedAttributes.length; index++){
      if("attribute_"+ this.selectedAttributes[index].attributeId == inputID)
        return this.selectedAttributes[index];
}

    return undefined;
  }
}
