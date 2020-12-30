
import {Component, Input, Output, EventEmitter, AfterViewInit, forwardRef, ChangeDetectorRef} from '@angular/core';
import {NG_VALUE_ACCESSOR,ControlValueAccessor} from "@angular/forms";
import {URebalService} from "../../../services/urebal.service";


@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    }
  ]
})
export class AutocompleteComponent implements AfterViewInit, ControlValueAccessor{

  @Input() item:string;
  @Input() items=[];
  @Input() inputID:string;
  @Input() scrollableParent:string = '';
  @Input() focusAfterSelection: boolean = false;

  @Input() upperCase:boolean;
  @Input() emptyOnSelection:boolean = false;
  @Input() placeholder:string;
  @Input() defaultValue:string;
  @Input() disableCondition:string;
  @Input() template:string = 'none';
  public isLoader: boolean = false;
  public listPosition = 0;
  private static counter:number = 0;
  autocomplete=[];
  public isFcousOut: boolean = true;
  @Output() postSelect: EventEmitter<any> = new EventEmitter();
  @Output() textValue = new EventEmitter<string>();

  propagateChange = (_: any) => {};

  constructor(private urebalService: URebalService, private ref: ChangeDetectorRef) {
    /*if(!this.inputID)
      this.inputID = 'AutoComplete-'+ AutocompleteComponent.counter++;*/
  }

  writeValue(value:any) {
    this.item = value;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  ngAfterViewInit() {

    $(window).click(() => {
      if(typeof $('#'+this.inputID).offset() != 'undefined') {
        $('#' + this.inputID).next().find('.handle').css({top: ($('#' + this.inputID).offset().top + $('#' + this.inputID).height() + 2) - $(window).scrollTop()})
       }
    });

    if($(window).scrollTop() > 0) {
      $('#'+this.inputID).next().find('.handle').css({top: ($('#'+this.inputID).offset().top + $('#'+this.inputID).height() + 2) - $(window).scrollTop()})
    }

    $(window).scroll(()=>{
      if(typeof $('#'+this.inputID).offset() != 'undefined') {
        $('#' + this.inputID).next().find('.handle').css({top: ($('#' + this.inputID).offset().top + $('#' + this.inputID).height() + 2) - $(window).scrollTop()})
        //console.log('scroll: ', $(window).scrollTop())
      }
    });

    if(this.scrollableParent != '') {
      $(this.scrollableParent).scroll(() => {
        if (typeof $('#' + this.inputID).offset() != 'undefined') {
          $('#' + this.inputID).next().find('.handle').css({top: ($('#' + this.inputID).offset().top + $('#' + this.inputID).height() + 2) - $(window).scrollTop()})
          //console.log($(this.scrollableParent).scrollTop() + $(window).scrollTop())
        }
      });
    }

    $('#'+this.inputID).on('keydown',(e)=>{
      let $selected = $('.tickers li').filter('.selected');
      let $current;
      $('.tickers li').removeClass('selected');
      $('#' + this.inputID).next().find('.handle').css({top: ($('#' + this.inputID).offset().top + $('#' + this.inputID).height() + 2) - $(window).scrollTop()})
      if(this.autocomplete.length > 0)
      {
        if(e.which == 9) {
          switch (this.template) {
            case 'security':
              this.item = this.autocomplete[0].ticker;
              this.autocomplete = [];
              this.postSelect.emit(this.item);
              break;
            case 'securityandmodel':
              this.item = this.autocomplete[0].ticker;
              this.autocomplete = [];
              this.postSelect.emit(this.item);
            break;
            case 'portfolio':
            case 'portfolio_simple':
            case 'drift':
              let portfolioDetail = this.autocomplete[0];
              this.item = this.autocomplete[0].portfolioName;
              this.autocomplete = [];
              this.postSelect.emit(portfolioDetail);
            break;
            case 'account':
              let accountDetail = this.autocomplete[0];
              this.item = this.autocomplete[0].name;
              this.autocomplete = [];
              this.postSelect.emit(accountDetail);
            break;
            case 'equivalence':
              let equivalence = this.autocomplete[0];
              this.item = this.autocomplete[0].name;
              this.autocomplete = [];
              this.postSelect.emit(equivalence);
              break;
            case 'model':
              this.item = this.autocomplete[0].modelName;
              this.autocomplete = [];
              this.postSelect.emit(this.item);
              break;
            case 'rebalance':
              let rebalanceDetail =this.autocomplete[0];
              this.item = this.autocomplete[0].item;
              this.autocomplete = [];
              this.postSelect.emit(rebalanceDetail);
              break;
            case 'none':
              this.item = this.autocomplete[0];
              this.autocomplete = [];
              this.postSelect.emit(this.item);
              break;
          }
          this.ref.detectChanges();

          if(this.emptyOnSelection) {
            this.item = '';
          }
        }

        if(e.which == 40) {
          if (!$selected.length || $selected.is(':last-child')) {
            $current = $('.tickers li').eq(0);
          } else {
            $current = $selected.next();
          }
          $current.addClass('selected');
          $('.handle').scrollTop($current.position().top - $('.tickers li').eq(0).position().top);
        }

        if(e.which == 38) {
          if (!$selected.length || $selected.is(':first-child')) {
            $current = $('.tickers li').last();
          } else {
            $current = $selected.prev();
          }
          $current.addClass('selected');
          $('.handle').scrollTop($current.position().top - $('.tickers li').eq(0).position().top);
        }

        if(e.which == 13) {
          let liIndex = 1;
          if ($selected.length) {
            liIndex = $selected.index()+1;
            let li = '.tickers li:nth-child('+liIndex+') a';
            let selectedTicker = $(li).find('.ticker-title').html();

          }

          switch (this.template) {
            case 'security':
              this.selectAutocomplete(this.autocomplete[liIndex-1].ticker);
              break;
            case 'securityandmodel':
              this.selectAutocomplete(this.autocomplete[liIndex-1].value);
              break;
            case 'model':
              this.selectAutocomplete(this.autocomplete[liIndex-1].modelName);
              break;
            default:
              this.selectAutocomplete(this.autocomplete[liIndex-1]);
          }
          $(':focus').blur();
        }
      }
    });


    $('#'+this.inputID).on('keyup',(e)=>{
      this.item = <string> $(e.currentTarget).val();
      this.propagateChange(this.item);
      //enable spinner
      this.isLoader = true;
      if (this.item !== ""){
        this.autocomplete = [];
        switch (this.template) {
          case 'security':
            for(let i in this.items) {
              if (this.items[i].ticker.toLowerCase().indexOf(this.item.toLowerCase()) === 0) {
                this.autocomplete.push(this.items[i]);
              }
            }
              //disable loader
              this.isLoader = false;
          break;
          case 'securityandmodel':
            for(let i in this.items) {
              if (this.items[i].value.toLowerCase().indexOf(this.item.toLowerCase()) === 0) {
                this.autocomplete.push(this.items[i]);
              }
            }
            this.isLoader = false;
          break;
          case 'model':
            for(let i in this.items) {
              if (this.items[i].modelName.toLowerCase().indexOf(this.item.toLowerCase()) === 0) {
                this.autocomplete.push(this.items[i]);
              }
            }
            this.isLoader = false;
          break;
          case 'portfolio':
          case 'drift':
          case 'portfolio_simple':
            for(let i in this.items) {
              if (this.items[i].portfolioName.toLowerCase().indexOf(this.item.toLowerCase()) === 0) {
                this.autocomplete.push(this.items[i]);
              }
            }
            this.isLoader = false;
          break;
          case 'account':
            for(let i in this.items) {
              if (this.items[i].accountName.toLowerCase().indexOf(this.item.toLowerCase()) === 0||
                this.items[i].portfolioName.toLowerCase().indexOf(this.item.toLowerCase()) === 0) {
                this.autocomplete.push(this.items[i]);
              }
            }
            this.isLoader = false;
          break;
          case 'equivalence':
          case 'rebalance':
            for(let i in this.items) {
              if (this.items[i].name.toLowerCase().indexOf(this.item.toLowerCase()) === 0) {
                this.autocomplete.push(this.items[i]);
              }
            }
            this.isLoader = false;
            break;
          case 'none':
              this.autocomplete = this.items.filter(function (el) {
                  return el.toLowerCase().indexOf(this.item.toLowerCase()) === 0;
              }.bind(this));
              //disable loader
              this.isLoader = false;
          break;
          default:
            this.autocomplete = [];
        }
      }else{
        this.autocomplete = [];
        //disable loader
        this.isLoader = false;
      }

      this.ref.detectChanges();
      this.textValue.emit(this.item);

    });

    //TODO: need to add few more functionality later
    $('.autoComplete-input').on('focusout',()=>{
      setTimeout(() => {
        if(this.isFcousOut) {
          //console.log('Mouse Leave FocusOut: '+this.isFcousOut);
          this.autocomplete = [];
          //disable loader
          this.isLoader = false;
        }
      },100);
    });

    $('.handle').mouseover(()=>{
      this.isFcousOut = false;
      //console.log('Mouse Over: '+this.isFcousOut);
    }).mouseleave(()=>{
      this.isFcousOut = true;
      //console.log('Mouse Leave: '+this.isFcousOut);
    });
  }

  selectAutocomplete(item){
    switch (this.template) {
      case 'portfolio':
      case 'drift':
      case 'portfolio_simple':
        this.item = item.portfolioName;
        break;
      case 'account':
        this.item = item.accountName;
        break;
      case 'equivalence':
      case 'rebalance':
        this.item = item.name;
        break;

      default:
        this.item = item;
    }

    if(this.emptyOnSelection) {
      this.item = '';
    }
    this.autocomplete = [];
    this.postSelect.emit(item);
    this.ref.detectChanges();


    if (this.focusAfterSelection) {
      setTimeout(()=>{
        $('#'+ this.inputID).focus();
      },200);
    }


  }


}
