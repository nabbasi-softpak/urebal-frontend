import {Component, Inject, ViewChildren, QueryList, ViewChild, ChangeDetectorRef} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {ModelComponent} from "../model-list/model.component";
import {UrebalDropdownComponent} from "../../shared/components/urebal-dropdown/urebal-dropdown.component";
import {ModalComponent} from "../../shared/components/modal/modal.component";
import {URebalUtil} from "../../shared/util/URebalUtil";
import {ModelBuilderComponent} from "../components/model-builder/model-builder.component";

import {ModelService} from '../model.service';
import {URebalService} from "../../services/urebal.service";
import {UILoader} from "../../shared/util/UILoader";
import {uListener, uObserver} from "../../shared/classes/uObserver";
import {FirmConfig} from "../../shared/util/config";
import {ModelType} from "../../shared/enums/ModelType.enum";


@Component({
  selector: 'app-attribute-model',
  templateUrl: './attribute-model.component.html',
  styleUrls: ['./attribute-model.component.css']
})
export class AttributeModelComponent extends ModelComponent implements uListener{

  private attributeTypes:any=[];
  private selectedAttributeType;
  private attributes:any=[];
  public selectedAttributes:any=[];
  private subModels:any=[];
  public modelSuccessMessage:string;
  private cashAttribute:any;
  public titleName: string = 'Create - Attribute Model';
  @ViewChildren(UrebalDropdownComponent) dropdowns : QueryList <UrebalDropdownComponent>;
  @ViewChild('saveAttrModelRef') saveModelRef: ModalComponent;
  @ViewChild('attributeModelBuilder') modelBuilder: ModelBuilderComponent;

  private attributeServiceObserver : uObserver = new uObserver();
  private subscriptionId : string = "";
  action : boolean;
  constructor(protected modelService:ModelService, private route: ActivatedRoute, router:Router, private urebalService:URebalService, protected ref: ChangeDetectorRef) {
    super(modelService,router, ref)
  }

  ngOnInit() {
    UILoader.blockUI.start("Loading Attributes");
    this.modelType = ModelType.Asset_Allocation_Model;
    this.getAllAttributeTypes();
    this.getCashAttribute();
    this.route.params.subscribe(params => {
      if(params['modelName'] && params['modelId'] ){
        this.modelId = params['modelId'];
        this.modelName = URebalUtil.decodeparams(params['modelName']);
        this.action = params['action'] == "copy";

        if(this.action){
          this.isEdit = false;
        } else {
          this.isEdit = true;
        }

        this.getAttributeModel();
      }

      UILoader.blockUI.stop();
    });
  }
  onNotify(data: any){

    if(data == this.model.attributeType ){

      for(let subModel of this.model.submodels){
        for(let attribute of this.attributes){
          if(subModel.sleeve.name.replace('_'+this.model.name,'') == attribute.attributeName){
            if(attribute.attributeName != "CASH ATTRIBUTE") {
              attribute.modelElements = subModel.sleeve.elements;
            }
            attribute.attributeTarget = subModel.ratio;

            this.getDropDown("attributes").dropdownList.checkItem(attribute.attributeName);

          }
        }
      }
      this.setModelAttributes(this.selectedAttributes);
      this.attributeServiceObserver.unsubscribe(this.subscriptionId);
      UILoader.blockUI.stop();
    }



  }

  /**
   * This method called in the edit case to render model details on the screen.
   * It updates the attribute type combo box
   * Than check the model attributes in attribute combo box
   */
  renderModel(){
    let dropdownObject = this.getDropDown("attributeTypesModel");
    if(dropdownObject != null){
        this.subscriptionId = this.attributeServiceObserver.subscribe(this);
        let dropdown = dropdownObject.dropdownList;
        dropdown.selectItem(this.model.attributeType);
      }
  }

  getAttributeModel(){
    if(this.modelId ) {
      this.invalidModelName = false;
      this.modelAlreadyExist = false;
      this.modelErrorMessage = '';

      UILoader.blockUI.start("Loading Attribute Model");
      this.modelService
        .getModel(this.modelId)
        .subscribe(
          result => {
            if(result.code == -100){
              this.invalidModelName = true;
              this.modelErrorMessage = result.message;
            }else if(result.code == 200){
              this.model = result.responsedata;
              this.modelId = this.model.id;
              this.modelType = this.model.modelType;
              if(this.isEdit){
                this.titleName = this.modelName;
              }
              this.createCustomAttributeData(this.model);
              setTimeout(()=>{
                this.renderModel();
              },500);
            }else{
              if(this.isEdit) {
                // If URL tempered and model not found, 404 page will be displayed
                this.router.navigate(['404']);
              } else {
                this.invalidModelName = false;
                this.modelErrorMessage = '';

              }
            }

          },
          err => {
            console.error(err);
            UILoader.blockUI.stop();
            if(err != 200)
            {
              this.router.navigate(['404']);
            }
          }, () => UILoader.blockUI.stop()
        );
    }else{
      this.invalidModelName = true;
      this.modelErrorMessage = 'Please enter valid model name';
    }
  }

  getAllAttributeTypes(){
    this.modelErrorMessage = '';

    UILoader.blockUI.start("Loading Attributes");
    this.modelService
      .getAttributes()
      .subscribe(
        result => {
          if(result.code == 200){
            for(let attribute of result.responsedata){
              if(attribute.attributeType != 'CASH') {
                this.attributeTypes.push(attribute.attributeType);
              }
            }
          }else if(result.code == 404){
            this.modelErrorMessage = "Attributes not found, please import attributes to use this feature.";
            this.urebalService.notifyAppComponentCall(this.modelErrorMessage);
          }else{
            this.modelErrorMessage = result.message;
            console.log(result.message);
          }


            this.getDropDown("attributeTypesModel").refreshDropDown(this.attributeTypes);

            let dropDownObject:UrebalDropdownComponent = this.getDropDown("attributes");
            if(dropDownObject != null){
              dropDownObject.refreshDropDown([]);
              dropDownObject.disableDropDown(true);
            }

        },
        err => {
          UILoader.blockUI.stop();
          console.error(err);
        }, () => UILoader.blockUI.stop()
      );
  }

  /**
   * This method is called on selecting attribute type which in turn call attributes against the attribute type
   * @param event selected attribute type
   */
  changeAttributeType(event:any){
    //this.attributes=[];

    /* reset/clear all the previously selected attribute securities */
    this.modelBuilder.resetSelectedAttributeSecurities();
    /* -- */

    this.selectedAttributeType = event.value;
    if(this.attributes.length == 0 || this.attributes[0].attributeType != event.value) {
      this.getAttributes(event.value);
      this.createPieChart();
    }
  }

  getCashAttribute(){
    this.modelErrorMessage = '';
    UILoader.blockUI.start("Loading Cash Attribute");

    this.modelService
      .getAttributesByType('CASH',true)
      .subscribe(
        result => {
          if(result.code == 200){
            let attribute = {
              attributeName: result.responsedata[0].attributeName,
              attributeId:result.responsedata[0].attributeID,
              attributeType: result.responsedata[0].attributeType,
              attributeError:"",
              modelElements :[{
                "ticker" : FirmConfig.cashSymbol,
                "target": "100",
                "min": "100",
                "max": "100",
                "isPriceMiss": false
              }],
              attributeTarget : 0.0,
              attributeSecurities : result.responsedata[0].securities
            }
            this.attributes.push(attribute);
            this.cashAttribute = attribute;

            this.selectedAttributes.push(attribute);
            this.modelBuilder.modelAttributeAdd(attribute);
            this.attributeServiceObserver.notify('CASH');
          }else{
            this.modelErrorMessage = result.message;
          }
        },
        err => {
            UILoader.blockUI.stop();
          console.log(err);
        }, () => UILoader.blockUI.stop()
      );
  }
  getAttributes(attributeType){

      UILoader.blockUI.start("Loading Attributes");
    this.getDropDown("attributes").disableDropDown(true);

    this.modelErrorMessage = '';
    this.modelService
      .getAttributesByType(attributeType,true)
      .subscribe(
        result => {
          if(result.code == 200){

            /**
             * Whenever a new security type has been selected all the attributes need to be removed
             * from selectedAttributes list except cash attribute.
             */
            for(let attribute of this.attributes){
              if(attribute.attributeName != "CASH ATTRIBUTE"){
                if(this.selectedAttributes.indexOf(attribute) >= 0) {
                  this.selectedAttributes.splice(this.selectedAttributes.indexOf(attribute), 1);
                }
              }
            }

            this.attributes = [];
            if(this.cashAttribute) {
              this.attributes.push(this.cashAttribute);
            }
            let attributeNames = [];
            for(let attrObj of result.responsedata){
              attributeNames.push(attrObj.attributeName);

              let attribute = {
                attributeName:attrObj.attributeName,
                attributeId:attrObj.attributeID,
                attributeType: attrObj.attributeType,
                attributeError:"",
                modelElements : [],
                attributeTarget : 0.0,
                attributeSecurities : attrObj.securities
              }
              this.attributes.push(attribute);
            }

            let dropdownObject:UrebalDropdownComponent = this.getDropDown("attributes");
            if (dropdownObject != null) {
              dropdownObject.refreshDropDown(attributeNames);
              dropdownObject.disableDropDown(false);
            }


            this.attributeServiceObserver.notify(attributeType);

          }else{
            this.modelErrorMessage = result.message;
          }
        },
        err => {
          UILoader.blockUI.stop();
          console.log(err);
        }, () => UILoader.blockUI.stop()
      );
  }

  selectAttribute(event){
    for(let attribute of this.attributes){
      if(attribute.attributeName == event.value) {
        if (event.checked && this.selectedAttributes.indexOf(attribute) < 0) {
          this.selectedAttributes.push(attribute);
          //This line of code informs model builder component about the new selected attribute
          this.modelBuilder.modelAttributeAdd(attribute);
          break;
        } else if (!event.checked && this.selectedAttributes.indexOf(attribute) >= 0) {
          this.selectedAttributes.splice(this.selectedAttributes.indexOf(attribute), 1);
          this.modelBuilder.modelAttributeAdd(attribute);
          this.setModelAttributes(this.selectedAttributes);
          attribute.modelElements = [];
          attribute.attributeTarget = 0;
          break;
        }
      }
    }
  }

  saveAttributeModel(){
    this.validateModel();
    if(!this.invalidModel) {


      let  modelSave = {"type" : 0 , "topDown" : {"modelName": this.modelName,"modelAttributeType": this.selectedAttributeType,"modelType": 2,"subModels": this.subModels}} ;

      //let modelSave = {"modelName": this.modelName,"modelAttributeType": this.selectedAttributeType,"modelType": 3,"subModels": this.subModels};

      //this.blockUI.start('Saving Attribute Model...'); // Start blocking
      UILoader.blockUI.start('Saving Attribute Model...'); // Start blocking
      this.modelService
        .createEditModel(modelSave, this.isEdit, this.modelId)
        .subscribe(
          result => {
            if (result.code == 200) {
              this.invalidModel = false;
              this.modelSuccessMessage = "Model '" + this.modelName + "' saved successfully";
              this.saveModelRef.open();
            } else {
              this.invalidModel = true;
              this.modelErrorMessage = result.message;
            }
          },
          err => {
            console.log(err);
            UILoader.stop();
          }, () => UILoader.blockUI.stop()
        );
    }
  }

  validateModel(){
    if(!this.modelName || this.invalidModelName || this.modelAlreadyExist){
      this.invalidModel = true;
      this.modelErrorMessage = 'Please enter valid model name';
      return;
    }else if(!(this.totalTarget >= 99.999 && this.totalTarget < 100.0001)){
      this.invalidModel = true;
      this.modelErrorMessage = 'Target % should be equal to 100.';
      return;
    }else if(this.subModels.length == 0){
      this.modelErrorMessage = 'Please add correct model details';
      return;
    }

    for(let attribute of this.selectedAttributes){
      if(attribute.attributeError){
        this.invalidModel = true;
        this.modelErrorMessage = attribute.attributeError;
        return;
      }
      for(let element of attribute.modelElements){
        if(element.invalid){
          this.invalidModel = true;
          this.modelErrorMessage = 'Model sleeve "'+attribute.attributeName+'" has errors.'
          return;
        }
      }
    }
    this.invalidModel = false;
    return;
  }

  /**
   * This is the output method for model builder class.Whenever an attribute has been updated with new security or its details, this method is called
   * to updated Total Target and SubModels
   * @param selectedAttributes list of selected attribute with the changes
   */
  setModelAttributes(selectedAttributes) {

    let isPieValue = 0;
    $('#defaultPie').removeClass('default-pie-removed');
    $('#defaultPie').addClass('default-pie');

    for(let attribute of selectedAttributes) {
      if(attribute.attributeTarget > 0) {
        isPieValue = 1;
        $('#defaultPie').removeClass('default-pie');
        $('#defaultPie').addClass('default-pie-removed');
      }
    }

    if(!isPieValue) {
      $('#defaultPie div:first-child').hide();
    } else {
      $('#defaultPie div:first-child').show();
    }

    this.subModels = [];
    this.totalTarget = 0;
    this.invalidModel = false;
    this.modelErrorMessage='';
    let data = [];
    this.unCheckAttribute();
    if (selectedAttributes != null && selectedAttributes.length > 0) {
      for (let modelAttribute of selectedAttributes) {
        let modelElementsList=[];
        for(let modelElement of modelAttribute.modelElements) {
          let elem = {
            'ticker':modelElement.ticker,
            'target': parseFloat(modelElement.target).toFixed(3),
            'min': parseFloat(modelElement.min).toFixed(3),
            'max': parseFloat(modelElement.max).toFixed(3)
          }

          modelElementsList.push(elem);
        }
        let subModel = {
          'attributeID':modelAttribute.attributeId,
          'attributeName':modelAttribute.attributeName,
          'target': parseFloat(modelAttribute.attributeTarget).toFixed(3),
          'min': parseFloat(modelAttribute.attributeTarget).toFixed(3),
          'max': parseFloat(modelAttribute.attributeTarget).toFixed(3),
          "modelElements": modelElementsList
        }
        this.subModels.push(subModel);
        this.totalTarget += parseFloat(subModel.target);

        //Creating data for pie chart
        if(modelAttribute.attributeTarget){
          data.push({
            name: modelAttribute.attributeName,
            value: parseFloat(modelAttribute.attributeTarget),
            id: modelAttribute.attributeId
          });
        }
      }
      //commented as an error on console at this line is encountered when edit asset model is clicked
//      this.modelBuilder.inputsList.first.item='';//defect# 201
    }else{
      this.modelErrorMessage = '';
    }
    this.createPieChart(data);
  }

  //This is the method which deals with the removing attribute cards from the model
  unCheckAttribute(){
    for(let attribute of this.attributes){
      if(this.selectedAttributes.indexOf(attribute) < 0){
        let dropDown:UrebalDropdownComponent = this.getDropDown("attributes");
        if(dropDown != null){
          attribute.modelElements = [];
          attribute.attributeTarget = 0;
          dropDown.dropdownList.uncheckItem(attribute.attributeName);
        }
      }
    }
  }

  navigateToModelDetail() {
    if (this.isEdit) {
      this.routeToDetail(3,this.modelName,this.model.attributeType ? this.model.attributeType: "N/A", this.modelId);
    }else {
      this.router.navigate(['/secure/model/list']);
    }
  }

  createCustomAttributeData(model) {
    this.modelBuilder.getAttributeSummaryBySecurities(model.submodels,3);
  }

  getDropDown(Id:string):UrebalDropdownComponent
  {

    let arrList:any[] = this.dropdowns.toArray();

    for (var i = 0, len = arrList.length; i < len; i++) {
      let dropDown:UrebalDropdownComponent = arrList[i];
      if (dropDown.id === Id) {
        return dropDown;
      }
    }

    return null;
  }

}


