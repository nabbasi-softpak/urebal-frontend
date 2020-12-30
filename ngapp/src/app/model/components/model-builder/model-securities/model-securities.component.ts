import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {URebalService} from "../../../../services/urebal.service";

@Component({
  selector: 'model-securities',
  templateUrl: './model-securities.component.html',
  styleUrls: ['./model-securities.component.css']
})
export class ModelSecuritiesComponent implements OnInit {

  @Input() modelElem:any;
  public security:string;
  public target:number;
  public isPriceZero:boolean;
  public min:number;
  public max:number;
  public modelSecError:string;
  @Output() removeSecurity = new EventEmitter();
  @Output() setSecurityDetails = new EventEmitter();
  public invalidTargetMinMax:boolean = true;

  constructor(public urebalService: URebalService) { }

  ngOnInit() {
    this.addSecurity(this.modelElem);
  }

  addSecurity(modelElement){
    this.security=modelElement.security;
    this.target=modelElement.target;
    this.min=modelElement.min;
    this.max=modelElement.max;
    this.isPriceZero= modelElement.isPriceZero;
  }

  deleteSecurity(){
    this.removeSecurity.emit(this.modelElem);
  }

  changeSecurityDetails(changeField){
    if(changeField == "min"){
      if(isNaN(this.min) || this.min == undefined){
        this.min = 0.0;
      }
    }else if(changeField == "max"){
      if(isNaN(this.max) || this.max == undefined){
        this.max  = 0.0;
      }
    }else if(changeField == "target"){
      if(isNaN(this.target) || this.target == undefined){
        this.target  = 0.0;
      }
    }
    this.validateTargetMinMax();
    let modelElement =  {
      security: this.security,
      target: this.target,
      min: this.min,
      max: this.max,
      invalid:this.invalidTargetMinMax,
      isPriceZero: this.isPriceZero
    };
    this.setSecurityDetails.emit(modelElement);
  }


  validateTargetMinMax():boolean{
    if(this.target == undefined || this.min == undefined || this.max == undefined){
      this.invalidTargetMinMax = true;
      return;
    }else if(this.target < this.min ||  this.target > this.max){
      this.invalidTargetMinMax = true;
      this.modelSecError = 'Target% cannot be less than Min% or greater than Max%.';
      return;
    }else if(this.min > this.target  || this.min > this.max){
      this.invalidTargetMinMax = true;
      this.modelSecError = 'Min% cannot be greater than Target% or Max%.';
      return;
    }else if(this.max < this.target   ||  this.max < this.min){
      this.invalidTargetMinMax = true;
      this.modelSecError = 'Max% cannot be less than Target% or Min%.';
      return;
    }
    this.modelSecError = '';
    this.invalidTargetMinMax = false;
    return;
  }
}
