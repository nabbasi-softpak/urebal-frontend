import {
    Component,
    Inject,
    ViewChild,
    HostListener,
    Input,
    Output,
    EventEmitter,
    ChangeDetectorRef
} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AutocompleteComponent} from '../../../../shared/components/autocomplete/autocomplete.component';

import {AccountService} from '../../../account.service';
import {ModelService} from '../../../../model/model.service';
import {UILoader} from "../../../../shared/util/UILoader";
import {URebalService} from "../../../../services/urebal.service";
import { AppConfig } from 'app.config';
import {map} from "rxjs/operators";
import {SoftpakDropdownComponent} from "../../../../shared/jqwidgets/jqx-dropdown/softpak-dropdown.component";
import {FirmConfig} from "../../../../shared/util/config";


@Component({
    selector: 'app-restrictions',
    templateUrl: './restrictions.component.html'
})
export class RestrictionsComponent {

    @ViewChild(AutocompleteComponent) autoComplete: AutocompleteComponent;
    @ViewChild('restrictionSelectbox') restrictionSelectbox: SoftpakDropdownComponent;


    compareMinMaxError: string = 'Min % should be less than Max %';
    emptyMinMaxError: string = 'Min/Max % cannot be empty.';
    emptyMinError: string = 'Min % cannot be empty.';
    restrictionExistError: string = 'Restriction already exists.';
    restrictionUpdateError: string = 'Restrictions not updated';
    tickerNotFoundError: string = 'Ticker not found';
    defaultTicker: string = '';
    isLoadedAsModal: boolean = false;

    account: string;
    accountRestrictions = [];
    checkAccountRestrictions = [];
    restrictionsError = [];
    saveRestrictionsError = [];
    uniqueID: string = '';
    tickers = [];
    tickersForAutocomplete = [];
    autoCompleteList = [];
    addRestriction = {
        account: "",
        isEdit: false,
        isMaxAvailable: true,
        isMinAvailable: true,
        restrictionType: 2,
        ticker: '',
        min: "",
        max: "",
        valid: true
    };
    // restrictionTypes = ["Minimum Core Cash %", "Don't Trade", "Don't Buy", "Don't Sell", "Custom Weights %", "Minimum Trade Size"];
    restrictionTypes = ["Don't Trade", "Don't Buy", "Don't Sell", "Custom Weights %", "Minimum Trade Size"];
    success: string = '';
    restrictionsCount = 0;
    isSaved: boolean = false;
    public minCoreCash: string;
    public minCoreCashId: number;
    public accountRestrictionsCopy = [];
    public serverMinCoreCashValue: string;
    AppConfig = AppConfig;
    FirmConfig = FirmConfig;

    @Output() applyChange: EventEmitter<boolean> = new EventEmitter();
    @Output() successMsg = new EventEmitter();


    constructor(public accountService: AccountService, private modelService: ModelService, private ref: ChangeDetectorRef) {
        this.uniqueID = new Date().getTime().toString();
    }

    @HostListener("window:beforeunload")
    onBeforeUnload(): Observable<boolean> | boolean {
        return !this.restrictionsChange();

    }

    loadRestrictions(portfolioId, id) {
        // UILoader.blockUI.start();
        this.addRestriction.account = this.account = id;
        this.success = '';
        this.restrictionsError = [];
        this.resetToDefaultState();
        if (typeof this.tickers == "undefined" || this.tickers.length == 0) {
            this.modelService.getPriceList()
                .subscribe((result) => {

                    if (result.code == 200) {
                        // UILoader.blockUI.stop();
                        let data = result.responsedata;
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].ticker != FirmConfig.cashSymbol) {
                                this.tickers[i] = data[i].ticker;
                                this.tickersForAutocomplete[i] = Object.assign({}, data[i]);

                            }
                        }
                    } else {
                        console.error(result.message);
                        // UILoader.blockUI.stop();
                    }
                });
        }
        if (this.accountRestrictions == null || typeof this.accountRestrictions[0] == "undefined" || this.accountRestrictions[0].account != id) {
            this.accountService.getRestriction(portfolioId, this.account)
                .subscribe((result) => {
                    if (result.code == 404) {
                        this.resetMinCashToNull();
                    } else if (result.code == 200) {
                        this.accountRestrictions = result.responsedata;
                        let mccrExists = false;
                        for (let i = 0; i < this.accountRestrictions.length; i++) {
                            if (this.accountRestrictions[i].restrictionType == 1) {
                                mccrExists = true;
                                this.minCoreCash = this.accountRestrictions[i].min;
                                this.serverMinCoreCashValue = this.accountRestrictions[i].min;
                                this.minCoreCashId = this.accountRestrictions[i].id;
                                this.accountRestrictions.splice(i, 1);
                                i--;
                            }

                        }
                        if (!mccrExists)
                            this.resetMinCashToNull();

                        this.restrictionsCount = result.responsedata.length;
                        result.responsedata.forEach((obj, index) => {
                            obj = this.checkRestrictionType(obj);
                            this.checkAccountRestrictions[index] = Object.assign({}, obj);
                        })


                    } else {
                        this.accountRestrictions = [];
                    }

                    UILoader.blockUI.stop();
                });
        }
    }

    addMoreRestriction() {
        // if((this.addRestriction.restrictionType != 1 && this.addRestriction.ticker != '') || this.addRestriction.restrictionType == 1) {
        this.addRestriction = this.checkRestrictionType(this.addRestriction);
        let newRestriction: any = Object.assign({}, this.addRestriction);

        if (newRestriction.restrictionType == 1) {
            this.addRestriction.ticker = this.defaultTicker;
            newRestriction.ticker = FirmConfig.cashSymbol;
        }
        if (newRestriction.restrictionType == 2 || newRestriction.restrictionType == 3 || newRestriction.restrictionType == 4) {
            // newRestriction.min = '0';
            newRestriction.isMinAvailable = false;
        }
        if (newRestriction.restrictionType == 1 || newRestriction.restrictionType == 2 || newRestriction.restrictionType == 3 || newRestriction.restrictionType == 4 || newRestriction.restrictionType == 6) {
            // newRestriction.max = '0';
            newRestriction.isMaxAvailable = false;
        }

        this.errorValidation(this.addRestriction, newRestriction);

        this.accountRestrictions.forEach((item, index) => {
            if (item.ticker == this.addRestriction.ticker) {
                if (item.restrictionType == this.addRestriction.restrictionType) {
                    this.restrictionsError.push(this.restrictionExistError);
                }
            }
        });


        if (this.restrictionsError.length < 1) {
            this.addRestriction.ticker = '';
            this.accountRestrictions.push(newRestriction);
            this.applyChange.emit(!this.restrictionsChange());
        }

        this.ref.detectChanges();
        // }
    }

    errorValidation(addedRestriction, newRestriction) {
        this.restrictionsError = [];
        if (addedRestriction.restrictionType == 5) {
            if (newRestriction.min === '' || newRestriction.min === 'N/A' || newRestriction.max === '' || newRestriction.max === 'N/A') {
                this.restrictionsError.push(this.emptyMinMaxError);
            } else if (+newRestriction.min > +newRestriction.max) {
                this.restrictionsError.push(this.compareMinMaxError);
            }
        }

        if (addedRestriction.restrictionType == 1 || addedRestriction.restrictionType == 6) {
            if (newRestriction.min === '') {
                this.restrictionsError.push(this.emptyMinError);
            }
        }

        if (addedRestriction.restrictionType != 1) {
            if (this.tickers.indexOf(addedRestriction.ticker) < 0) {
                this.restrictionsError.push(this.tickerNotFoundError);
            }
        }

    }

    removeRestriction(index) {
        if (index >= 0) {
            this.accountRestrictions.splice(index, 1);
        }
        this.applyChange.emit(!this.restrictionsChange());
    }

    selectTicker(e, index) {
        if (index < 0) {
            this.addRestriction.ticker = e;
            this.removeError(this.tickerNotFoundError);
        } else {
            this.accountRestrictions[index].ticker = e;
            this.applyChange.emit(!this.restrictionsChange());
        }
    }

    setRestrictions() {
        this.addRestriction.restrictionType = this.restrictionSelectbox.getSelectedIndex() + 2;
        if ([2, 3, 4].indexOf(this.addRestriction.restrictionType)  > -1) {
            this.addRestriction.min = 'N/A'
        } else {
            this.addRestriction.min = '';
        }

        if ([1, 2, 3, 4, 6].indexOf(this.addRestriction.restrictionType) > -1) {
            this.addRestriction.max = 'N/A';
        } else {
            this.addRestriction.max = '';
        }
    }

    setAddedRestrictions(index) {
        if (this.accountRestrictions[index].restrictionType == 2 || this.accountRestrictions[index].restrictionType == 3 || this.accountRestrictions[index].restrictionType == 4) {
            this.accountRestrictions[index].min = 'N/A';
        } else {
            this.accountRestrictions[index].min = 0;
        }

        if (this.accountRestrictions[index].restrictionType != 5) {
            this.accountRestrictions[index].max = 'N/A';
        } else {
            this.accountRestrictions[index].max = 0;
        }

        this.accountRestrictions[index].restrictionTypeName = this.restrictionTypes[this.accountRestrictions[index].restrictionType - 2];
        this.applyChange.emit(!this.restrictionsChange());

    }

    //TODO: onFocusOut validate ticker is conflicting with click event
    /*validateTicker() {
      this.addRestriction.ticker = this.addRestriction.ticker.toUpperCase();
      this.autoComplete.autocomplete = [];
      this.removeError(this.tickerNotFoundError);
      if(this.tickers.indexOf(this.addRestriction.ticker) < 0) {
        this.restrictionsError.push(this.tickerNotFoundError);
      }
    }*/

    validateMinMax($event?, restrictionType?, min?, max?) {
        this.restrictionsError = [];
        for (let i = 0; i < this.accountRestrictions.length; i++) {
            // if(this.accountRestrictions[i].restrictionType == 5) {
            //   if (this.accountRestrictions[i].min === '' || this.accountRestrictions[i].max === '') {
            //     this.restrictionsError.push(this.emptyMinMaxError);
            //   }else if (+this.accountRestrictions[i].min > +this.accountRestrictions[i].max) {
            //     this.restrictionsError.push(this.compareMinMaxError);
            //   }
            // }
            //
            // if(this.accountRestrictions[i].restrictionType == 1 || this.accountRestrictions[i].restrictionType == 6) {
            //   if (this.accountRestrictions[i].min === '') {
            //     this.restrictionsError.push(this.emptyMinError);
            //   }
            // }

            this.errorValidation(this.accountRestrictions[i], this.accountRestrictions[i]);
        }


    }

    removeError(error) {
        let index = this.restrictionsError.indexOf(error);
        if (index >= 0) {
            this.restrictionsError.splice(index, 1);
        }
    }

    save() : Observable<any> {
        this.removeRestrictionsAddedErrorOnSave();

        if (this.restrictionsError.length > 0) {
          return of("");
        }

         this.restrictionsError = [];
         this.saveRestrictionsError = [];

         for (let j = 0; j < this.accountRestrictions.length; j++) {
             console.log(this.accountRestrictions[j].restrictionType);
             console.log(this.minCoreCash);
             console.log(this.accountRestrictions.length);
             if (this.accountRestrictions[j].restrictionType == 1 && this.minCoreCash == null) {

                 this.checkAccountRestrictions[j] = Object.assign({}, this.accountRestrictions[j]);
                 let index = this.accountRestrictions.findIndex(cashRest => cashRest.restrictionType == 1);
                 this.accountRestrictions.splice(index, 1);

                 continue;
             }

         }

         this.defaultMinCoreRestriction();

         this.showNotApplicable(this.accountRestrictionsCopy);

         return this.accountService.saveRestrictions(this.account, this.accountRestrictionsCopy).pipe(map(result => {
           if (result.code == -100) {
             this.isSaved = false;
             if (result.message != '') {
               this.saveRestrictionsError.push(result.message);
             } else {
               this.saveRestrictionsError.push(this.restrictionUpdateError);
             }
           } else {
             // this.success = result.message;
             this.successMsg.emit("Restrictions");
             this.isSaved = true;
             this.checkAccountRestrictions = [];
             for (let i = 0; i < this.accountRestrictions.length; i++) {
               if (this.accountRestrictions[i].restrictionType == 1 && this.minCoreCash == null) {
                 this.checkAccountRestrictions[i] = Object.assign({}, this.accountRestrictions[i]);
                 continue;
               }
               this.accountRestrictions[i] = this.checkRestrictionType(this.accountRestrictions[i]);
               this.checkAccountRestrictions[i] = Object.assign({}, this.accountRestrictions[i]);
             }
             this.serverMinCoreCashValue = this.minCoreCash;
           }

           this.restrictionsChange();

           return result;
         }));
    }

    cancelBtn() {
        this.resetToDefaultState();
    }

    resetToDefaultState() {
        this.accountRestrictions = [];
        this.checkAccountRestrictions = [];
        this.restrictionsError = [];
        this.saveRestrictionsError = [];
    }

    restrictionsChange() {
        //let isSaved = 0;

        if (this.checkAccountRestrictions.length === this.accountRestrictions.length) {
            if (JSON.stringify(this.checkAccountRestrictions) === JSON.stringify(this.accountRestrictions)) {
                if (this.minCoreCash == this.serverMinCoreCashValue) {
                    return false;
                }
            }
        }
        return true;
    }

    defaultMinCoreRestriction() {
        this.accountRestrictionsCopy = Object.assign([], this.accountRestrictions);
        let defaultRestriction: any = Object.assign({}, this.addRestriction);

        if (this.minCoreCash != null) {
            defaultRestriction.isMaxAvailable = false;
            defaultRestriction.max = '100';
            defaultRestriction.min = this.minCoreCash;
            defaultRestriction.restrictionType = 1;
            defaultRestriction.ticker = FirmConfig.cashSymbol;
            defaultRestriction.valid = true;
            defaultRestriction.id = this.minCoreCashId;

            this.accountRestrictionsCopy.push(defaultRestriction);
        }
    }

    showNotApplicable(array) {
        array.forEach((item, index) => {
            if (item.min == 'N/A') {
                item.min = 0;
            }
            if (item.max == 'N/A') {
                item.max = 0;
            }
            if (item.restrictionType == 6) {
                item.max = 100;
            }

        });
    }

    checkRestrictionType(obj) {
        if (obj.restrictionType == 2 || obj.restrictionType == 3 || obj.restrictionType == 4) {
            obj.min = 'N/A'
        }

        if (obj.restrictionType == 1 || obj.restrictionType == 2 || obj.restrictionType == 3 || obj.restrictionType == 4 || obj.restrictionType == 6) {
            obj.max = 'N/A';
        }

        return obj;
    }

    removeRestrictionsAddedErrorOnSave() {
        let index = this.restrictionsError.findIndex(err => err == this.restrictionExistError);
        this.restrictionsError.splice(index, 1);
    }

    checkAndReplaceZeroMinCash() {
        if ((this.minCoreCash == '0' || this.minCoreCash == '')) {
            this.minCoreCash = null;
        }


    }

    resetMinCashToNull() {
        this.minCoreCash = null;
        this.serverMinCoreCashValue = null;
        this.minCoreCashId = null;
    }

}
