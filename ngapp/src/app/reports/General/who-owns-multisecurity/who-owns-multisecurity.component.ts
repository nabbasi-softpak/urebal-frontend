import {
  AfterViewInit, Component, ComponentFactoryResolver, EmbeddedViewRef, Query, QueryList, TemplateRef, ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {ReportsService} from "../../reports.service";
import {WhoOwnsSecurityComponent} from "./who-owns-security/who-owns-security.component";
import {AutocompleteComponent} from "../../../shared/components/autocomplete/autocomplete.component";
import {UILoader} from "../../../shared/util/UILoader";


@Component({
  selector: 'app-who-owns-multisecurity',
  templateUrl: './who-owns-multisecurity.component.html',
  styleUrls: ['./who-owns-multisecurity.component.css']
})
export class WhoOwnsMultisecurityComponent implements AfterViewInit{

  private dataBindingCompleteCounter: number =0;
  public tickerArr = [];
  autocompleteCounter = 1;
  private autCompleteId:number  = 0;
  errMsg : string = '';
  //showDuplicateSecurityError : false = '';
  public arrAutoCompl = [];
  private tickerInfo: TickerInfo;
  private reportLoadingMessage = '';

  @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
  @ViewChild('vcAutocomplete', {read: ViewContainerRef}) vcAutocomplete: ViewContainerRef;
  @ViewChild('tpl') tpl: TemplateRef<any>;

  @ViewChildren(AutocompleteComponent) autoCompleteList: QueryList<AutocompleteComponent>;

  constructor(private service: ReportsService,
              private r: ComponentFactoryResolver) {}

  ngAfterViewInit() {
    this.service.getPriceList().subscribe(response => {
      if (response.code == 200) {
        this.tickerArr = response.responsedata;
      }
    });
  }

  addAutocomplete()
  {
    if(this.autocompleteCounter >= 5 ) {
      this.errMsg = 'Cannot add more than 5 securities!';
      return;
    }
    else {
      this.errMsg = '';
    }

    let id = "autoCompl-"+ this.autCompleteId++;

    this.vcAutocomplete.createEmbeddedView(this.tpl, { $implicit: id });

    this.autocompleteCounter++;

    this.arrAutoCompl.push(id);

  }

  bindReportData()
  {
    try
    {
      this.dataBindingCompleteCounter = 0;
      this.vc.clear();

      if(!this.validateSecurityID()){
        return;
      }

      this.errMsg = '';

      this.reportLoadingMessage = 'Loading report please wait...';
      UILoader.blockUI.start(this.reportLoadingMessage);

      let gridCounter = 1;
      this.autoCompleteList.forEach(autocomplete =>
      {
        let ticker = autocomplete.items.find(t => t.ticker == autocomplete.item);
        this.tickerInfo = new TickerInfo();
        this.tickerInfo.ticker = ticker.ticker;
        this.tickerInfo.tickerName = ticker.tickerName;
        this.tickerInfo.tickerPrice = ticker.price;
        this.createSecurityGrid(gridCounter, this.tickerInfo);
        gridCounter++;
      });

    }
    catch(e) {
      UILoader.blockUI.stop();
    }
  }

  private createSecurityGrid(gridCounter: number, ticker: TickerInfo)
  {
    const factory = this.r.resolveComponentFactory(WhoOwnsSecurityComponent);
    let WhoOwnsSecurityComponentRef = <WhoOwnsSecurityComponent>this.vc.createComponent(factory).instance;
    WhoOwnsSecurityComponentRef.uniqueID = '' + gridCounter;
    WhoOwnsSecurityComponentRef.showPageDivider = (gridCounter == (this.autoCompleteList.length)) ? false: true;
    WhoOwnsSecurityComponentRef.bindReportData(ticker);

    WhoOwnsSecurityComponentRef.bindingCompleted.subscribe((result) => {
        if(result == true) {
          this.dataBindingCompleteCounter++;

          this.reportLoadingMessage = 'Report loaded for ' + ticker.tickerName + ', now loading report for next security please wait...';
          UILoader.blockUI.update(this.reportLoadingMessage);

          if(this.dataBindingCompleteCounter == this.vc.length) {
            UILoader.blockUI.stop();
          }
        }
    });
  }

  removeSecurity(id)
  {
    console.log(id);

    let index = this.arrAutoCompl.indexOf(id);
    this.arrAutoCompl.splice(index,1);

    this.vcAutocomplete.remove(index);
    this.autocompleteCounter--;
    this.errMsg = '';
  }

  validateSecurityID() : boolean {
    let isValidated : boolean = true;

    this.autoCompleteList.forEach(autocomplete =>
    {
      $('#errMsg' + autocomplete.inputID).text("");

      if(autocomplete.item == '' || autocomplete.item == undefined) {
        $('#errMsg' + autocomplete.inputID).text("Please enter Security ID.");
        //document.getElementById('errMsg' + autocomplete.inputID).innerText = "Please enter Security ID.";
        isValidated = false;
      }
      else if(this.tickerArr.find(t => t.ticker == autocomplete.item) == undefined)
      {
        $('#errMsg' + autocomplete.inputID).text("Entered Security ID does not exist.");
        isValidated = false;
      }
    });


    //Check for duplication
    let tickerCount : number = 0;
    //let isTickerDuplicated : boolean = false;
    this.autoCompleteList.forEach(autocomplete =>
    {
      tickerCount = this.autoCompleteList.toArray().filter(ticker =>  ticker.item == autocomplete.item && autocomplete.item != '' && autocomplete.item != undefined).length;
      if(tickerCount > 1)
      {
        $('#errMsg' + autocomplete.inputID).text("Duplicate entry for Security ID '" + autocomplete.item + "' is found.");
        isValidated = false;
      }
    });

    return isValidated;

  }

}

export class TickerInfo{
  ticker : string;
  tickerName : string;
  tickerPrice : number;
}
