import {Component, OnInit, ViewChild, Input, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {jqxInputComponent} from "../../../../../src/assets/jqwidgets-ts/angular_jqxinput";


@Component({
  selector: 'app-urebal-autocomplete',
  template: `
    <jqxInput #inputReference [auto-create]='false' [disabled]="disabled"  [placeHolder]="placeholder" [displayMember]="displayMember" [source]="source" [width]="width" (onSelect)="selectItem($event)" id="{{id}}"></jqxInput>
  `,
  styles: []
})
export class UrebalAutocompleteComponent implements OnInit,AfterViewInit {

  @ViewChild('inputReference') jqxInput: jqxInputComponent;
  @Input() id : any;
  @Input() source : any;
  @Input() width: string;
  @Input() displayMember: string;
  @Input() placeholder: string;
  @Output() onItemSelect = new EventEmitter<string>();
  @Input() inputClass:string;
  @Input() writeValue: string = '';
  @Output() textValue = new EventEmitter<string>();
  @Input() isNgModel:boolean=false;
  @Input() disabled:boolean=false;
  @Output() onBlur = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    if(this.writeValue != '') {
      this.jqxInput.writeValue(this.writeValue);
    }
  }

  ngAfterViewInit(): void {
    this.settings.source = this.source;
    this.settings.displayMember = this.displayMember;
    this.settings.placeHolder =this.placeholder;


    let element = this.jqxInput.elementRef.nativeElement.querySelector('input');
    $(element).addClass(this.inputClass);

    $(element).on('keyup',(e)=>{
      this.textValue.emit(<string> $(e.currentTarget).val());
    });

    /*
       jqxInput onBlur event
     */

    $(element).on('blur', (e) => {
      this.onBlur.emit($(e.currentTarget).val());
    })


    this.jqxInput.createComponent(this.settings);
    this.jqxInput.elementRef.nativeElement.querySelector("input").setAttribute("autocomplete", "off");
  }

  updateInputSource(data?:any){
    this.source = data;
  }

  settings: jqwidgets.InputOptions = {
    theme: 'blueleaf'
  }

  selectItem(event){
    let item = event.args? event.args.item:null;
    if (item != null) {
      if(this.isNgModel) {
        this.jqxInput.writeValue(item.value);
      }else{
        this.jqxInput.writeValue('');
      }
      this.onItemSelect.emit(item.value);
      // Code below update selected value which causes rebalance settings selected model name donot display
      /*if (typeof this.writeValue != "undefined"){
        this.jqxInput.writeValue(this.writeValue);
      }else {
        this.jqxInput.writeValue('');
      }*/

    }
  }
}
