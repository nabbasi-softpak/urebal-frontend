import {
  Component, Inject, ViewChildren, QueryList, HostListener, Output, EventEmitter,
  AfterViewInit
} from '@angular/core';
import { ToggleButtonComponent } from '../../../../shared/components/toggle-button/toggle-button.component';

import { AccountService} from '../../../account.service';
import {Observable} from "rxjs";
import {UILoader} from "../../../../shared/util/UILoader";
import {map} from "rxjs/operators";


@Component({
  selector: 'app-tax-settings',
  templateUrl: './tax-settings.component.html'
})
export class TaxSettingsComponent implements AfterViewInit{

  accountSettings:any;
  accountSettingsCopy:any;
  settingsError:string = '';
  success:string = '';
  isSaved:boolean = false;

  @Output() applyChange: EventEmitter<boolean> = new EventEmitter();
  @Output() successMsg = new EventEmitter();

  @ViewChildren('ToggleButtonRef') toogleButton: QueryList<ToggleButtonComponent>;

  constructor(private accountService:AccountService) { }

  @HostListener("window:beforeunload")
  onBeforeUnload(): Observable<boolean> | boolean {
    return !this.settingsChange();

  }

  ngAfterViewInit() {
    /*setTimeout(()=>{
      $("input").change(()=>{
        alert('here')
        //this.applyChange.emit(this.settingsChange())
      })
    },2000)*/
  }

  loadTaxSettings(id) {
    this.settingsError = '';
    this.success = '';
    this.resetToDefaultState();
    if(typeof this.accountSettings == "undefined" || this.accountSettings.id != id) {
      this.accountService.getAccountSetting(id)
        .subscribe((result) => {
          if(result.code == 200){
            this.accountSettings = result.responsedata[0];
            this.accountSettingsCopy = Object.assign({},result.responsedata[0]);
            setTimeout(()=>{
              $("input").change(()=>{
                this.applyChange.emit(!this.settingsChange())
              })
            },500)
          }
          else
          {
            console.error(result.message);
          }
        });
    }/* else if(this.accountSettings.id != id) {
      this.accountService.getAccountSetting({"id": id})
        .subscribe((result) => {
          this.accountSettings = result[0];
        });
    }*/
  }

  toggleButtonOnChange() {
    this.toogleButton.forEach((componentInstance,index) => {
      this.accountSettings[componentInstance.buttonProperty] = componentInstance.buttonValue;
    });
    this.applyChange.emit(!this.settingsChange());
    console.log(this.accountSettings);
  }

  netRadioClick() {
    if(this.accountSettings.isMcgSlSeparation)
    {
      this.accountSettings.ytdNetGainLoss = "0.00";
      this.accountSettings.maxCapitalGain = "0.00";
    }
  }

  save() : Observable<any> {
    return this.accountService.saveAccountSetting(this.accountSettings.accountId, this.accountSettings).pipe(map(result => {
      if(result.code == 200) {
        // this.success = result.message;
        this.successMsg.emit('Tax Settings');
        this.accountSettingsCopy = Object.assign({}, this.accountSettings);
        this.isSaved = true;
      } else {
        this.settingsError = (result.message != '') ? '' : 'Settings not updated';
        this.isSaved = false;
      }

      return this.settingsError;
    }));
  }

  cancelBtn() {
    this.resetToDefaultState();
  }

  resetToDefaultState() {
    this.accountSettings = {};
    this.accountSettingsCopy = {};
  }

  settingsChange() {
    if(JSON.stringify(this.accountSettings) === JSON.stringify(this.accountSettingsCopy)) {
      return false;
    }
    return true;
  }

}
