import {AfterViewInit, Component} from '@angular/core';
import { AccountService} from '../../account/account.service';

import {trigger, state, style, transition, animate} from '@angular/animations';


@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class AttributeComponent implements AfterViewInit{

  //@BlockUI() blockUI: NgBlockUI;
  public attributes = [];
  public AllAttributes = [];
  public list = [];
  public index = 0;
  public AllSecurities = [];
  public securities = [];
  public itemsPerPage = 10;

  menuState:string = 'out';

  constructor(public accountService:AccountService) { this.loadAttributes() }

  ngAfterViewInit() {
  }

  openSidePanel(attribute,e){
    this.menuState = 'in';
    this.securities = attribute.securities;
    this.AllSecurities = this.securities;

     $('.slidingPanel .slidingPanelHeader h3').text(attribute.attributeName);
  }

  bindElementClick() {
    setTimeout(()=>{
      $(".urebal-collapsible-header").off("click");
      $('.urebal-collapsible-header').on('click', (event)=>{
        let collapsible_body = $(event.currentTarget).next();
        //close all other opened collapsible divs
        $('.ur-collapsible').find('.urebal-collapsible-body.ur-is-open').each(function(i,ele){
          $(ele).not(collapsible_body).removeClass('ur-is-open').hide('fast');
        });

        if(collapsible_body.hasClass('ur-is-open')){
          collapsible_body.removeClass('ur-is-open').hide('fast');
          $(event.currentTarget).find('.chevronDown').show();
          $(event.currentTarget).find('.chevronUp').hide();
        }else{
          let attributeType = {name: event.currentTarget.children[0].innerHTML};

          this.accountService.getAttributeDetail(attributeType.name,true).subscribe(result => {
            if (result.code == 200) {
              this.list = result.responsedata;
              collapsible_body.addClass('ur-is-open ur-is-active').show('fast');
              $(event.currentTarget).find('.chevronDown').hide();
              $(event.currentTarget).find('.chevronUp').show();
            }
          });
        }
      });
    },200);
  }

  loadAttributes() {
    this.accountService.getAttributeList()
      .subscribe((result)=>{
        if (result.code == 200) {
          this.attributes = result.responsedata.slice(this.index, this.itemsPerPage);
          this.AllAttributes = result.responsedata;
          this.bindElementClick();
        }
      });
  }

  filterAttribute(event) {
    let value = event.target.value;
    this.attributes = [];
    value = value.trim().toUpperCase();

    if(value.length == 0){
      this.attributes = this.AllAttributes.slice(this.index, this.index + this.itemsPerPage);
      return;
    }

    for(let attribute of this.AllAttributes)
    {
      if(attribute.attributeType.toUpperCase().indexOf(value) != -1)
      {
        this.attributes.push(attribute);
      }
    }
    this.bindElementClick();
  }

  filterSecurities(event) {
    let value = event.target.value;
    this.securities = [];
    value = value.trim().toUpperCase();

    if(value.length == 0){
      this.securities = this.AllSecurities;
      return;
    }

    for(let security of this.AllSecurities)
    {
      if(security.securityID.indexOf(value) != -1)
      {
        this.securities.push(security);
      }
    }
  }

  reload() {
    this.index = 0;
    this.loadAttributes();
    $("#text-input-01").val('');
  }

  page(direction) {
    if(this.AllAttributes.length > 0){
      $("#text-input-01").val('');
      if(direction === 'up')
      {
        let ceiling = (Math.ceil(this.AllAttributes.length/this.itemsPerPage) * this.itemsPerPage)-this.itemsPerPage;
        this.index = (this.index < ceiling) ? this.index + this.itemsPerPage : ceiling;
      } else {
        this.index = (this.index > 0) ? this.index - this.itemsPerPage : 0;
      }

      if(this.index >= 0) {
        this.attributes = this.AllAttributes.slice(this.index, this.index + this.itemsPerPage);
      }
      this.bindElementClick();
    }
  }
}
