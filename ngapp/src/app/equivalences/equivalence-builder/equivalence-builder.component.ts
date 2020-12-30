import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {DragulaService} from "ng2-dragula";
import {URebalService} from "../../services/urebal.service";

@Component({
  selector: 'app-equivalence-builder',
  templateUrl: './equivalence-builder.component.html'
})
export class EquivalenceBuilderComponent implements OnInit,AfterViewInit {

  @ViewChild('equivalenceBodyDiv', {read: ViewContainerRef}) equivalenceBodyDiv;
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  public errMsg: string = '';
  public Buyrules = [
    {     id: 0,value: "Highest Tradable PCT"},
    {     id: 1,value: "Security Name"}
  ];

  public Sellrules = [
    {     id: 0,value: "Highest Tradable PCT"},
    {     id: 1,value: "Security Name"},
    {     id: 2,value: "Normal Lot Order"}
  ];

  public chosenBuyRules = [];
  public chosenSellRules = [];

  // values to be stored in DB
  private DBBuyRules ="";
  private DBSellRules ="";

  constructor(private dragulaService: DragulaService, public urebalService: URebalService) {

    dragulaService.drop().subscribe((value) => {
      this.onDrop(value);
    });

    dragulaService.createGroup('first-bag', {
      copy: function (el, container) {
        if(container.id === 'equivalenceBuyRulesDiv')
          return true;
        if(container.id === 'equivalenceSellRulesDiv')
          return true;
        return false;
      },
      removeOnSpill: true,

      copyItem: function (value)
      {
       let data=  {"id":value.id,"value":value.value} ;
       return data;
      },
      copySortSource: true,
      accepts: function (el, container, handle) {
        if(container.id !== 'equivalenceBuyRulesDiv' && container.id !== 'equivalenceSellRulesDiv')
          return true;

        return false;
      }
    });

  }

  ngAfterViewInit(){
    $('.equivalence-tabs li').on('click', (e) => {

      let target = $(e.currentTarget).data("target");

      //make current tab highlighted
      $('.equivalence-tabs li').removeClass('slds-active');
      $(e.currentTarget).addClass('slds-active');

      $('.eq-tab').each((i,ele)=>{

        if($(ele).hasClass('slds-show')){
          $(ele).removeClass('slds-show').addClass('slds-hide');
        }

        if($(ele).attr("id")==target){
          $(ele).removeClass('slds-hide').addClass('slds-show');
        }

      });
    });

    $('#appequivalenceBuilder').parent().parent().removeClass('blueleaf-modal__content');
  }

  ngOnInit() {
  }

  //(0 - bagname, 1 - el, 2 - target, 3 - source, 4 - sibling)
  private onDrop(value) {
    if (value.target == null)
      return;
    if (value.target.id === "equivalenceBodyDiv" && value.target.id !== value.source.id) //dragged to a container that should not add the element
    {
      this.SpliceIfAlreadyExists(this.chosenBuyRules,value.el.innerText.toString());
    }
    if (value.target.id  === "equivalenceBodyDiv2" && value.target.id  !== value.source.id) //dragged to a container that should not add the element
    {
      this.SpliceIfAlreadyExists(this.chosenSellRules,value.el.innerText.toString());

    }
  }

  SpliceIfAlreadyExists(equivalanceList,draggedItem){
    let index = -1;
    let text = draggedItem;
    let name = text.replace(/['"\n\r]+/g, '');
    let count =0;
    for (var i = 0; i < equivalanceList.length; i++) {
      if (equivalanceList[i].value == name) {
        index = i;
        count++;
      }
    }
    if (index != -1 && count == 2)
      equivalanceList.splice(index, 1);
}
  setDefaultBuyRules() {
    this.chosenBuyRules = [
      {id: 0, value: "Highest Tradable PCT"},
      {id: 1, value: "Security Name"}
    ];
  }
  setDefaultSellRules(){
  this.chosenSellRules = [
    {     id: 0,value: "Highest Tradable PCT"},
    {     id: 1,value: "Security Name"}
  ];

  }

  setDBBuyRules(value:string ) {
    if(value != null && value != "")
    {
      this.chosenBuyRules=[];
      var list = value.split(",");
      for (let entry of list)
        {
          for (let buyrule of this.Buyrules) {
            if(buyrule.id.toString() == entry)
            this.chosenBuyRules.push(buyrule);
          }
        }
    }else
      this.setDefaultBuyRules();
  }
  getDBBuyRules():string{
    return this.DBBuyRules;
  }
  getDBSellRules():string{
    return this.DBSellRules;
  }

  setDBSellRules(value:string ) {
    if(value != null && value != "")
    {
      this.chosenSellRules=[];
      var list = value.split(",");
      for (let entry of list)
      {
        for (let sellrule of this.Sellrules) {
          if (sellrule.id.toString() == entry)
            this.chosenSellRules.push(sellrule);
        }
      }
    }else
      this.setDefaultSellRules();
  }
  saveEquivalence()
  {
    if (this.chosenBuyRules.length <=0 || this.chosenSellRules.length <=0) {
      this.errMsg = "Buy/Sell rules are empty. Please select at least one breakdown rule."
      return
    }else {
      this.errMsg = '';
    }
    this.DBSellRules = "";
    this.DBBuyRules = "";
    for (let entry of this.chosenSellRules)
    {
      this.DBSellRules=this.DBSellRules+entry["id"].toString();
      this.DBSellRules=this.DBSellRules+(",");
    }
    this.DBSellRules = this.DBSellRules.slice(0, -1);

    for (let entry of this.chosenBuyRules)
    {
      this.DBBuyRules=this.DBBuyRules+entry["id"].toString();
      this.DBBuyRules=this.DBBuyRules+(",");
    }
    this.DBBuyRules = this.DBBuyRules.slice(0, -1);

    this.closeModal();
  }

  closeModal() {
    this.onClose.emit();
  }

  ngOnDestroy(){
    this.dragulaService.destroy('first-bag');
  }

}
