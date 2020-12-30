import {Component, ComponentFactoryResolver, ViewContainerRef, ViewChild, ComponentRef, EventEmitter, Output, OnDestroy, OnInit, Input} from "@angular/core";
import {AccountNameCriteriaComponent} from "./acc-name-criteria/acc-name-criteria.component";
import {HouseholdCriteriaComponent} from "./household-criteria/household-criteria.component";
import {MarketValueCriteriaComponent} from "./mkt-val-criteria/mkt-val-criteria.component";
import {TaxableCriteriaComponent} from "./taxable-criteria/taxable-criteria.component";
import {ModelCriteriaComponent} from "./model-criteria/model-criteria.component";
import {DriftCriteriaComponent} from "./drift-criteria/drift-criteria.component";
import {CriteriaService} from "./criteria.service";
import {DragulaService} from "ng2-dragula";
import {ModalComponent} from '../../../shared/components/modal/modal.component';
import {Subject} from "rxjs";
import {DriftStatusCriteriaComponent} from "./drift-status-criteria/drift-status-criteria.component";
import {URebalService} from "../../../services/urebal.service";


@Component({
  selector: 'app-criteria-builder',
  templateUrl: './criteria-builder.component.html'
})
export class CriteriaBuilderComponent implements OnDestroy {

  @ViewChild('criteriaBodyDiv',{read:ViewContainerRef, static: true}) criteriaBodyDiv;
  @ViewChild('criteriaRef') addCriteriaRef: ModalComponent;
  @Input() criteriaString:string = '';
  private presetCriteria:string='';
  public presetCriteriaSelect:CriteriaObject = null;

  public componentRefArray:ComponentRef<Component>[]=[];
  private tokensList:any =[];
  @Output() criteriaOutput: EventEmitter<any> = new EventEmitter();
  private idx:number = 0;
  public criteriaList:CriteriaObject[]=[];
  public saveCriteriaName:string = '';
  private _invalidCriteria:boolean = false;
  private _modalSaveCriteriaError:string;
  private _modalSaveCriteriaSuccess:string;
  isWorkspaceExists: boolean = false;

  private destroy$ = new Subject();

  constructor(private componentFactoryResolver:ComponentFactoryResolver,public urebalService: URebalService,
              private criteriaService: CriteriaService,private dragulaService: DragulaService) {
    //Dragula service used for draging functionality, code commented for any future reusability.
    /*dragulaService.drop.asObservable().takeUntil(this.destroy$).subscribe((value) => {
      this.onDrop(value.slice(1));
    });
    dragulaService.setOptions('first-bag', {
      copy: true
    });*/

    criteriaService.notifyObservableParent$.subscribe((res) => {
      if(res.isDelete){
          delete this.tokensList[res.index];
          this.componentRefArray.splice(this.componentRefArray.indexOf(res.ref), 1);
      }else {
        if(this.tokensList[res.index]){
          delete this.tokensList[res.index];
        }
        let tokenData = {ref:res.ref,token:res.token}
        this.tokensList[res.index] = tokenData;
      }
      this.criteriaOutput.emit(this.tokensList);
      this.criteriaString = this.criteriaService.generateCriteriaString(this.tokensList);
    });
    this.getAllPresetCriteria();
  }

  //Method used for functionality on drop after dragged, code commented for any future reusability.
  /*private onDrop(args) {
    let [e, el] = args;
    $('#criteriaBodyDiv').find('li#'+e.id).remove();
    /!**
     * Eliminate household component or taxable component if already exist.
     *!/
    let isExist = false;

    if(e.id == 'household' || e.id == 'taxable') {
      for (let reference of this.criteriaService.componentReferences) {
        if (reference.ref._elDef.element.name == 'app-household-criteria' && e.id == 'household') {
          isExist = true;
        }
        if (reference.ref._elDef.element.name == 'app-taxable-criteria' && e.id == 'taxable') {
          isExist = true;
        }
      }
    }

    if(!isExist) {
      this.createComponent(e.id, null, null);
    }
  }*/

  public onclick(id): void {
    //Works with drag and drop feature
    //let [e, el] = args;

    $('#criteriaBodyDiv').find('li#'+id).remove();
    /**
     * Eliminate household component or taxable component if already exist.
     */
    let isExist = false;

    if(['accName', 'household', 'mktVal', 'taxable', 'model', 'drift', 'driftStatus'].indexOf(id) > -1) {
      for (let reference of this.criteriaService.componentReferences) {
        const elementName = reference.ref._elDef.element.name;
        if (elementName == 'app-acc-name-criteria' && id == 'accName') { isExist = true; }
        if (elementName == 'app-household-criteria' && id == 'household') { isExist = true; }
        if (elementName == 'app-mkt-val-criteria' && id == 'mktVal') { isExist = true; }
        if (elementName == 'app-taxable-criteria' && id == 'taxable') { isExist = true; }
        if (elementName == 'app-model-criteria' && id == 'model') { isExist = true; }
        if (elementName == 'app-drift-criteria' && id == 'drift') { isExist = true; }
        if (elementName == 'app-drift-status-criteria' && id == 'driftStatus') { isExist = true; }
      }
    }

    if(!isExist) {
      this.createComponent(id, null, null);
    }
  }

  private createComponent(componentName,componentString,componentData) {
    let component;
    let compRef;
    let data;
    if (componentName == "accName" || componentName == "Account Name") {
      component = this.componentFactoryResolver.resolveComponentFactory(AccountNameCriteriaComponent);
    } else if (componentName == "household" || componentName == "Household") {
      component = this.componentFactoryResolver.resolveComponentFactory(HouseholdCriteriaComponent);
    } else if (componentName == "mktVal" || componentName == "Portfolio Market Value") {
      component = this.componentFactoryResolver.resolveComponentFactory(MarketValueCriteriaComponent);
    } else if (componentName == "taxable" || componentName == "Taxable") {
      component = this.componentFactoryResolver.resolveComponentFactory(TaxableCriteriaComponent);
    } else if (componentName == "model" || componentName == "Model") {
      component = this.componentFactoryResolver.resolveComponentFactory(ModelCriteriaComponent);
    } else if (componentName == "drift" || componentName == "Drift") {
      component = this.componentFactoryResolver.resolveComponentFactory(DriftCriteriaComponent);
    } else if (componentName == "driftStatus" || componentName == "DriftStatus") {
      component = this.componentFactoryResolver.resolveComponentFactory(DriftStatusCriteriaComponent);
    }

    compRef = this.criteriaBodyDiv.createComponent(component);
    compRef.instance.componentIndex = this.idx;

    this.componentRefArray.push(compRef);

    if(componentString){
      this.tokensList[this.idx] = {ref:compRef,token:componentString};
      data = {value : compRef, token : componentData};
      this.criteriaOutput.emit(this.tokensList);
    }else{
      data = {value: compRef};
    }

    this.idx++;
    this.criteriaService.notifyOther(data);
  }

  openSaveModal() {
    this._invalidCriteria = false;
    this._modalSaveCriteriaError = '';
    this._modalSaveCriteriaSuccess = '';
    this.criteriaString?this.addCriteriaRef.open():this._invalidCriteria=true;
  }

  getAllPresetCriteria() {
     this.criteriaService.getCriteriaList().subscribe(
      result => {
        if(result.code == 200){
          this.criteriaList= result.responsedata;
          if(this.presetCriteriaSelect) {
            for (let criteria of this.criteriaList) {
              if (criteria.templateName == this.presetCriteriaSelect.templateName) {
                this.presetCriteriaSelect = criteria;
              }
            }
          }
        }
        else{
          console.error(result.message);
        }
      },
      err => {
        console.error(err);
      });
  }

  saveCriteria() {
    this.saveCriteriaName = this.saveCriteriaName.replace(/(^\s+|\s+$)/g,'');
      if(this.presetCriteriaSelect == null && this.tokensList.length == 0) {
        this._modalSaveCriteriaError = "Criteria save failed";
        return;
      }
      if(this.saveCriteriaName == null || this.saveCriteriaName == "") {
        this._modalSaveCriteriaError = "Please enter filter name";
        return;
      }

      let saveCriteria:CriteriaObject = new CriteriaObject();

      this.criteriaString = this.criteriaService.generateCriteriaString(this.tokensList);
      saveCriteria.templateName = this.saveCriteriaName;
      saveCriteria.criteria = this.criteriaString;
      saveCriteria.asOfDate = new Date;

      if(this.presetCriteriaSelect) {
        this.presetCriteriaSelect.templateName = this.saveCriteriaName;
      }

        this.presetCriteriaSelect = saveCriteria;


      this.criteriaService.saveCriteria(this.presetCriteriaSelect).subscribe(
         response =>{
           if(response.code == 200){
             this._modalSaveCriteriaSuccess = response.message;
             this.getAllPresetCriteria();
           }else{
             this._modalSaveCriteriaError = response.message;
             this.presetCriteriaSelect = null;
           }
         },
        err => {
          console.error(err);
        });
      this.addCriteriaRef.close();
  }

  loadPresetCriteria(){
    for(let component of this.componentRefArray){
      component.destroy();
    }
    this.criteriaService.componentReferences = [];
    this.componentRefArray = [];
    this.tokensList = [];
    this.idx = 0;
    this._invalidCriteria = false;
    this._modalSaveCriteriaSuccess = '';

    if(this.presetCriteriaSelect == null) {
      this.saveCriteriaName = '';
      this.criteriaString =  '';
      return;
    }
    this.presetCriteria = this.presetCriteriaSelect.criteria;
    this.loadCriteria(this.presetCriteria)
    this.criteriaService.isCriteriaValid = true;
    this.saveCriteriaName = this.presetCriteriaSelect.templateName;
  }

  loadCriteria(criteria){

    //Add space after LIKE keyword in case of LIKE(*****) to resolve criteria string
    if(criteria.indexOf('(') != -1) {
      criteria = criteria.replace("(", " (");
    }

    let components = this.criteriaService.tokenize(criteria);


    for(let component of components){
      let splitParameter = component.split(/\s+(=|!=|<>|>|<|>=|<=|<>|LIKE|BETWEEN|IN)\s+/);
      let componentData = {
        name : splitParameter[0],
        operator : splitParameter[1] ? splitParameter[1].trim() : null,
        value : splitParameter[2] ? splitParameter[2].replace(/^'+|'+$/g,"") : null, // Remove quote from start and end
      };

      this.createComponent(componentData.name,component,componentData);
      this.criteriaString =  criteria;

    }
  }

  isCriteriaValid() {
    return this.criteriaService.isCriteriaValid;
  }

  ngOnDestroy() : void {
    // this.dragulaService.destroy('first-bag');
    this.criteriaService.componentReferences = [];
    this.destroy$.next();
  }

  cancelCriteria() {
    let token = this.tokensList;
    let compRef = this.criteriaService.componentReferences;

    for(let componentIndex in token){
      let data = {ref:this.criteriaService.componentRefByIndex(componentIndex),isDelete:true,index:componentIndex};
      this.criteriaService.notifyParentData(data);
    }

    for(let reference of compRef) {
      //if (reference.ref._elDef.element.name == 'app-household-criteria' || reference.ref._elDef.element.name == 'app-taxable-criteria') {
      reference.ref.destroy();
      compRef.splice(0, compRef.length);
      //}
    }
  }



  get invalidCriteria(): boolean {
    return this._invalidCriteria;
  }

  set invalidCriteria(value: boolean) {
    this._invalidCriteria = value;
  }

  get modalSaveCriteriaError(): string {
    return this._modalSaveCriteriaError;
  }

  set modalSaveCriteriaError(value: string) {
    this._modalSaveCriteriaError = value;
  }

  get modalSaveCriteriaSuccess(): string {
    return this._modalSaveCriteriaSuccess;
  }

  set modalSaveCriteriaSuccess(value: string) {
    this._modalSaveCriteriaSuccess = value;
  }
}

export class CriteriaObject
{
asOfDate:Date;
criteria:string;
criteriaId:number;
templateName:string;
}
