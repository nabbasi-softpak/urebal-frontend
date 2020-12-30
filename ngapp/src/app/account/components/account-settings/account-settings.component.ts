import {Component, AfterViewInit, Inject, ViewChild, Output, EventEmitter} from '@angular/core';
import {RestrictionsComponent} from './restrictions/restrictions.component';
import {TaxSettingsComponent} from './tax-settings/tax-settings.component';
import {WashsalesComponent} from './washsales/washsales.component'
import {PositionsComponent} from './positions/positions.component';
import {AttributeRestrictionComponent} from './attribute-restriction/attribute-restriction.component';
import {AccountService} from '../../account.service';


@Component({
    selector: 'app-account-settings',
    templateUrl: './account-settings.component.html',
    styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements AfterViewInit {

    @ViewChild(TaxSettingsComponent) taxsettings: TaxSettingsComponent;
    @ViewChild(RestrictionsComponent) restrictions: RestrictionsComponent;
    @ViewChild(WashsalesComponent) washsales: WashsalesComponent;
    @ViewChild(PositionsComponent) positions: PositionsComponent;
    @ViewChild(AttributeRestrictionComponent) attributes: AttributeRestrictionComponent;


    accountKeys: any;
    accountList: any;
    accountID: any;
    accountName: any;
    projectID: any;
    isHouseHold = false;

    public totalMktVal: number = 0;
    public modelName: string = '--';
    public portfolioId: string = '';
    public portfolioName: string = '';
    public taxable: number = 0;
    public holdingsNum: number = 0;
    public freeCash: number = 0;
    public freeCashPercentage: number = 0;
    public coreCash: number = 0;
    public coreCashPercentage: number = 0;
    public taxableMktVal: number = 0;
    public msgsArr = [];
    public successMsg: string = '';
    public noChangesErr: string = '';

    isApplicableCondition = {
        positions: true,
        taxsettings: true,
        restrictions: true,
        attributeRestrictions: true
    };


    @Output() onClose: EventEmitter<any> = new EventEmitter();

    constructor(public accountService: AccountService) {
    }


    ngAfterViewInit() {
        $('.setting-tabs li').on('click', (e) => {

            let target = $(e.currentTarget).data("target");

            //make current tab highlighted
            $('.setting-tabs li').removeClass('slds-active');
            $(e.currentTarget).addClass('slds-active');

            $('.acc-tab').each((i, ele) => {

                if ($(ele).hasClass('slds-show')) {
                    $(ele).removeClass('slds-show').addClass('slds-hide');
                }

                if ($(ele).attr("id") == target) {
                    $(ele).removeClass('slds-hide').addClass('slds-show');
                }

            });
        });
    }

    applyButtonCondition() {
        let count = 0;
        for (let key in this.isApplicableCondition) {
            if (this.isApplicableCondition[key]) {
                count++;
            }
        }
        if (count == 4) {
            return true;
        }
        return false;
    }

    loadAcctSettings(id, name) {
        this.msgsArr = [];
        this.successMsg = '';
        this.noChangesErr = '';

        $('.setting-tabs li:first-child').click();
        //$('#positions').addClass('slds-active');

        this.positions.loadPositions(id);
        this.restrictions.loadRestrictions(this.portfolioId, id);
        this.taxsettings.loadTaxSettings(id);
        this.washsales.loadWashsale(id);
        this.attributes.loadAccountAttributes(id);
        this.accountID = id;
        this.accountName = name;

        $('.acct-list').hide();
        $('.acct-setting-panel').fadeIn('fast');
        if (this.accountKeys.length > 1) {
            $('.cancel-button').hide();
            $('.back-button').show();
        } else {
            $('.cancel-button').show();
            $('.back-button').hide();
        }
    }

    loadAcctList(isBack?: boolean) {

        if (isBack) {
            //this.accountService.getPortfolioDetailsByName(this.projectID)
            this.accountService.getPortfolioDetails(this.portfolioId)
                .subscribe((result) => {
                    if (result.code == 200) {

                        if (result.responsedata.rebalance.model) {
                            this.modelName = result.responsedata.rebalance.model.name;
                        }
                        this.portfolioName = result.responsedata.portfolioName;
                        this.holdingsNum = result.responsedata.positionsCount;
                        this.accountList = result.responsedata.accounts;
                        this.freeCash = result.responsedata.freeCash;
                        this.freeCashPercentage = result.responsedata.freeCashPercentage;
                        this.coreCash = result.responsedata.cash;
                        this.coreCashPercentage = result.responsedata.cashPercentage;
                        this.isHouseHold = result.responsedata.isHouseHold;
                        this.totalMktVal = 0;
                        this.taxableMktVal = 0;
                        for (let i = 0; i < this.accountList.length; i++) {
                            this.totalMktVal = this.totalMktVal + this.accountList[i].marketValue;

                            if (this.accountList[i].isTaxable) {
                                this.taxableMktVal = this.taxableMktVal + this.accountList[i].marketValue;
                            }
                        }

                        this.totalMktVal = Math.round(this.totalMktVal);
                        this.accountList = result.responsedata.accounts;
                        this.taxableMktVal = Math.round(this.taxableMktVal);
                        this.accountKeys = Object.keys(this.accountList);
                    }
                });
        }

        $('.cancel-button').show();
        $('.back-button').hide();
        $('.acct-list').show();
        $('.acct-setting-panel').hide();
    }

    restoreFields() {
        $('.acct-list').show();
        $('.acct-setting-panel').hide();
        //(typeof this.taxsettings != "undefined")?this.taxsettings.settingsError = '':null;
        //(typeof this.restrictions != "undefined")?this.restrictions.restrictionsError = []:null;
    }

    fetchData(id, name) {

        this.portfolioId = id;
        this.portfolioName = name;

        this.projectID = id;
        this.msgsArr = [];
        this.modelName = '--';

        //this.accountService.getPortfolioDetailsByName(id)
        this.accountService.getPortfolioDetails(id)
            .subscribe((result) => {
                if (result.code == 200) {

                    if (result.responsedata.rebalance.model) {
                        this.modelName = result.responsedata.rebalance.model.name;
                    }

                    this.portfolioName = result.responsedata.portfolioName;
                    this.holdingsNum = result.responsedata.positionsCount;
                    this.accountList = result.responsedata.accounts;
                    this.freeCash = result.responsedata.freeCash;
                    this.freeCashPercentage = result.responsedata.freeCashPercentage;
                    this.coreCash = result.responsedata.cash;
                    this.coreCashPercentage = result.responsedata.cashPercentage;
                    this.isHouseHold = result.responsedata.isHouseHold;
                    this.totalMktVal = 0;
                    this.taxableMktVal = 0;
                    for (let i = 0; i < this.accountList.length; i++) {
                        this.totalMktVal = this.totalMktVal + this.accountList[i].marketValue;

                        if (this.accountList[i].isTaxable) {
                            this.taxableMktVal = this.taxableMktVal + this.accountList[i].marketValue;
                        }
                    }

                    this.totalMktVal = Math.round(this.totalMktVal);
                    this.accountList = result.responsedata.accounts;
                    this.taxableMktVal = Math.round(this.taxableMktVal);
                    this.accountKeys = Object.keys(this.accountList);
                    if (this.isHouseHold) {
                        this.loadAcctList();
                    } else {
                        if (this.accountList.length > 0) {
                            this.loadAcctSettings(this.accountList[0].id, this.accountList[0].accountName)
                        }
                    }
                } else {
                    console.error(result.message);
                }
            });
    }

    apply() {
        // this.msgsArr = [];
        //
        // switch($('.setting-tabs > .slds-active').data('target')) {
        //   case 'tab-acct-positions':
        //     this.positions.savePositions((errors) => {});
        //     break;
        //   case 'tab-acct-restrictions':
        //     this.restrictions.save((errors)=>{});
        //     break;
        //   case 'tab-acct-taxsetting':
        //     this.taxsettings.save((errors)=>{});
        //     break;
        //   case 'tab-acct-attributes':
        //     this.attributes.save((errors) => {});
        //     break;
        // }

        this.msgsArr = [];

        if (!this.positions.positionsChange() && !this.taxsettings.settingsChange() && !this.restrictions.restrictionsChange() && !this.attributes.restrictionsChange()) {
            this.taxsettings.success = '';
            this.taxsettings.settingsError = '';
            this.restrictions.success = '';
            this.attributes.success = '';
            this.successMsg = '';
            this.noChangesErr = 'No changes have been made.';
            return
        } else {
            this.noChangesErr = '';
        }

        // if (this.positions.positionsChange()) {
        //     setTimeout(() => {
        //         this.positions.savePositions((errors) => {
        //             if (errors.length > 0) {
        //                 $('.report-tabs li:eq(0) > a').click();
        //             }
        //         });
        //     }, 100);
        // }
        //
        // if (this.taxsettings.settingsChange()) {
        //     setTimeout(() => {
        //         this.taxsettings.save((errors) => {
        //             if (errors != '') {
        //                 $('.report-tabs li:eq(1) > a').click();
        //             }
        //         });
        //     }, 150);
        // }
        //
        // if (this.restrictions.restrictionsChange()) {
        //     setTimeout(() => {
        //         this.restrictions.save((errors) => {
        //             if (errors.length > 0) {
        //                 $('.report-tabs li:eq(2) > a').click();
        //             }
        //         });
        //     }, 200);
        // }
        //
        // if (this.attributes.restrictionsChange()) {
        //     setTimeout(() => {
        //         this.attributes.save((errors) => {
        //             if (errors != '') {
        //                 $('.report-tabs li:eq(3) > a').click();
        //             }
        //         });
        //     }, 250);
        // }


        /*this.restrictions.save((errors)=>{
          if(errors.length > 0) {
            $('#restrictions').click();
          } else {
            this.taxsettings.save((errors)=>{
              if(errors == '') {
                this.attributes.save((errors) => {
                  if(errors.length > 0) {
                    $('#attributes').click();
                  } else {
                    this.closeModal();
                  }
                });
              } else {
                $('#taxSettings').click();
              }
            });
          }
        });*/
    }

    closeModal() {
        this.onClose.emit();
        this.restrictions.cancelBtn();
        this.attributes.cancelBtn();
        this.taxsettings.cancelBtn();
        this.msgsArr = [];
    }

    updateSuccessMessage(val) {
        this.msgsArr.push(val);
        this.successMsg = this.msgsArr.toString() + ' have been saved successfully.';
    }

}
