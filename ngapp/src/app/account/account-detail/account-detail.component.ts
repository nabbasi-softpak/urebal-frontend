import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {RestrictionsComponent} from '../components/account-settings/restrictions/restrictions.component';
import {TaxSettingsComponent} from '../components/account-settings/tax-settings/tax-settings.component';
import {WashsalesComponent} from '../components/account-settings/washsales/washsales.component'
import {PositionsComponent} from '../components/account-settings/positions/positions.component';
import {AttributeRestrictionComponent} from '../components/account-settings/attribute-restriction/attribute-restriction.component';

import {AccountService} from '../account.service';
import {PortfolioService} from '../portfolio.service';
import {ModalComponent} from "../../shared/components/modal/modal.component";

import {AutocompleteComponent} from "../../shared/components/autocomplete/autocomplete.component";
import {forkJoin, Observable, of} from "rxjs";
import {PermissionResolverService, UrebalPermissions} from "../../services/permission-resolver.service";
import {UILoader} from "../../shared/util/UILoader";
import {DriftComponent} from "../components/account-settings/drift/drift.component";
import {OverviewComponent} from "../components/account-settings/overview/overview.component";
import {modelTypePermissions} from "../../model/model.datasource";
import {AppConfig} from "../../../app.config";
import {map} from "rxjs/operators";
import {EquivalencesComponent} from "../../equivalences/components/equivalences/equivalences.component";


@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountDetailComponent extends UrebalPermissions implements OnInit, AfterViewInit {
  @ViewChild('overviewTab') overviewTab: OverviewComponent;
  @ViewChild(TaxSettingsComponent) taxsettings: TaxSettingsComponent;
  @ViewChild(RestrictionsComponent) restrictions: RestrictionsComponent;
  @ViewChild(WashsalesComponent) washsales: WashsalesComponent;
  @ViewChild(PositionsComponent) positions: PositionsComponent;
  @ViewChild(DriftComponent) drift: DriftComponent;
  @ViewChild(AttributeRestrictionComponent) attributes: AttributeRestrictionComponent;
  @ViewChild(EquivalencesComponent) equivalences: EquivalencesComponent;

  @ViewChild(AutocompleteComponent) autoComplete: AutocompleteComponent;
  @ViewChildren(ModalComponent) accountSettingsModalRef: QueryList<ModalComponent>;

  selectedIndex: string = '';
  isHouseHold = false;
  portfolioId: number = 0;
  portfolioName: string = '';
  accountList: any[];
  accountListSearch: any[];
  defaultAccount: string;
  error: string = '';
  errMsg: string = '';
  warningMsg: string = '';
  householdInitialStateChanged: boolean = false;
  householdAccountStates = {Added: 'added', Removed: 'removed'}
  householdPostServiceError: string = '';


  messages: any;

  accountSummary: any;
  accountSummaryErrMsg: string = '';

  householdData = {
    portfolioId: '',
    portfolioName: '',
    accounts: [{accountId: 0, accountName: '', status: ''}]
  };

  accountsInitialCount: number = 0;
  tobeRemovedCount: number = 0;
  tobeAddedCount: number = 0;

  public noChangesErr: string = '';
  public successMsg: string = '';
  private msgsArr = [];
  private selectedAccount;
  private selectedAccountNav;
  isApplicableCondition: {} = {taxsettings: true, restrictions: true, attributeRestrictions: true};

  public isEditHousehold: boolean = false;
  public totalAccounts: number = 0;
  public portfolioList = [];

  private totalMktVal: number = 0;
  private model: any;
  private modelName: string = '--';
  private taxable: number = 0;
  private holdingsNum: number = 0;
  private availableCash: number = 0;
  private freeCash: number = 0;
  private freeCashPercentage: number = 0;
  private coreCash: number = 0;
  private coreCashPercentage: number = 0;
  private taxableMktVal: number = 0;
  private nonTaxableMktVal: number = 0;
  private responseCode: number = 0;
  private accountType: string;
  private taxableCash: number = 0;
  private nonTaxableCash: number = 0;
  private isTaxable: string;
  private driftDetails: any;
  private modelId: number;
  public DATETIME_FORMAT = AppConfig.DATETIME_FORMAT;


  @Input() loadAsModal: boolean = false;
  @Output() closeModalModeEmitter = new EventEmitter<string>();
  private modelType: string
  private modelAttributeType: string;
  private modelTypeNum: string = "0";


  constructor(public accountService: AccountService,
              private route: ActivatedRoute,
              protected router: Router,
              private portfolioService: PortfolioService,
              private cd: ChangeDetectorRef,
              private urebalPermissions: UrebalPermissions,
              permissionResolverService: PermissionResolverService) {
    super(permissionResolverService);
  }

  ngOnInit() {


    this.route.params.subscribe(params => {
      if (params['portfolioId'] && params['household']) {
        this.portfolioId = Number(decodeURIComponent(params['portfolioId']));
        this.initilaizeMessages();

        if (params['household'] === 'false') {
          this.isHouseHold = false;
          this.accountType = "Single Account";
        } else {
          this.isHouseHold = true;
          this.accountType = "Household";
          this.loadAutoComplete();
        }
      }

      this.selectedIndex = (this.isAllowed('accountOverview') && this.isHouseHold) ? 'overview' : 'drift';
    });

  }

  initializeModalMode(portfolioId: number, household: boolean) {
    if (portfolioId) {
      this.portfolioId = portfolioId;
      this.initilaizeMessages();

      if (household === false) {
        this.isHouseHold = false;
        this.accountType = "Single Account";
      } else {
        this.isHouseHold = true;
        this.accountType = "Household";
        this.loadAutoComplete();
      }

      this.selectedIndex = this.isAllowed('accountOverview') ? 'overview' : 'drift';
      this.getPortfolio().subscribe();
      if (household === false) {
        this.defaultAccount = this.portfolioName;
      }
      this.tabSelection();
      this.toggleCollapseSidebar();

    }
  }

  ngAfterViewInit() {
    if (!this.loadAsModal) {
      this.getPortfolio().subscribe();
      this.tabSelection();
      this.toggleCollapseSidebar();
    }
    this.cd.detectChanges();
  }

  @HostListener("window:beforeunload")
  detectHouseholdChangedState(): Observable<boolean> | boolean {
    return !this.householdInitialStateChanged;
  }

  updateHouseholdChangedState() {
    this.householdInitialStateChanged = (this.householdData.accounts.length > 0) ? true : false;
  }

  initilaizeMessages() {
    this.messages = {
      householdDissolve: `All accounts in this household are 'to be removed', this will remove this household '${this.portfolioName}' completely.`,
      accountsTobeRemoved: `Accounts marked as 'to be removed' will be removed from this household '${this.portfolioName}'.`,
      accountsTobeAdded: `Some account(s) are going 'to be added' in this household '${this.portfolioName}'.`,
      householdChanged: `Changes made in this household '${this.portfolioName}' will be saved.`,
      accountsLimitExceeds: `Number of accounts in household cannot exceed 15.`,
      //householdChangesInvalid : ""
    }
  }

  toggleCollapseSidebar() {
    //Toggle Collapse Sidebar
    $('.btn-collapse-sidepanel').off("click").on("click", (event) => {
      $('.collapsed-sidebar').toggleClass('slds-hide');
      $(event.currentTarget).css({transform: 'rotate(180deg)'});

      if ($(event.currentTarget).parent().width() > 100) {
        $(event.currentTarget).parent().width('1%');
        $('.mainPanel').removeClass('slds-size--10-of-12').addClass('slds-size--1-of-1');
      } else {
        $(event.currentTarget).parent().removeAttr('style');
        $(event.currentTarget).css({transform: 'rotate(0deg)'});
        $('.mainPanel').removeClass('slds-size--1-of-1').addClass('slds-size--10-of-12');
      }
      setTimeout(() => {
        this.positions.positionsGrid.jqxGrid.refresh();
        this.washsales.grid.jqxGrid.refresh();
        this.drift.gridComponent.jqxGrid.refresh();
        this.equivalences.refresh();
      }, 500);
    });
  }

  loadAutoComplete() {
    this.accountService.getSinglePortfolios().subscribe(result => {
      this.portfolioList = result.responsedata;
    });
  }

  getPortfolio(lastSelectedAccount?: string) {

    if (this.isHouseHold) {
      return this.accountService.getPortfolioDetailsById(this.portfolioId).pipe(map((result) => {
        this.responseCode = result.code;
        if (result.code == 404 || result.code == 0) {
          this.router.navigate(['404']);
        } else if (result.code < 0) {
          this.error = result.message;
        } else {
          this.portfolioName = result.responsedata.portfolioName;
          if (result.responsedata.rebalance.model) {
            this.model = result.responsedata.rebalance.model;
            this.modelName = result.responsedata.rebalance.model.name;
            this.modelId = result.responsedata.rebalance.model.id;
            this.modelAttributeType = result.responsedata.rebalance.model.attributeType == null ? "N/A" : result.responsedata.rebalance.model.attributeType;
            this.modelTypeNum = result.responsedata.rebalance.model.modelType;
          } else {
            this.modelName = '--';
          }
          this.portfolioId = result.responsedata.portfolioId;
          this.holdingsNum = result.responsedata.positionsCount;
          this.accountList = result.responsedata.accounts;
          this.availableCash = result.responsedata.availableCash;
          this.freeCash = result.responsedata.freeCash;
          this.freeCashPercentage = result.responsedata.freeCashPercentage;
          this.coreCash = result.responsedata.cash;
          this.coreCashPercentage = result.responsedata.cashPercentage;
          this.isTaxable = result.responsedata.taxable;


          /** Initialize household data to post **/
          this.householdData.portfolioId = result.responsedata.portfolioId;
          this.householdData.portfolioName = result.responsedata.portfolioName;
          this.householdData.accounts = [];
          /** end Initialize household data to post **/


          this.totalMktVal = result.responsedata.marketValue;

          this.accountListSearch = result.responsedata.accounts;
          if (lastSelectedAccount == undefined) {
            this.defaultAccount = this.accountList[0].id;
            this.selectedAccountNav = 'accountNameLink0';
          } else {
            this.defaultAccount = lastSelectedAccount;
          }

          this.loadAccountSettings(this.defaultAccount, true);
          this.getDriftDetails();

          this.totalAccounts = this.accountList.length;
          this.accountsInitialCount = this.accountListSearch.length;

          this.taxableCash = 0;
          this.nonTaxableCash = 0;

          this.taxableMktVal = 0;
          this.nonTaxableMktVal = 0;

          for (let i = 0; i < this.accountList.length; i++) {
            if (this.accountList[i].isTaxable) {
              this.taxableMktVal += this.accountList[i].marketValue;
              this.taxableCash += this.accountList[i].accountCash;
            } else {
              this.nonTaxableMktVal += this.accountList[i].marketValue;
              this.nonTaxableCash += this.accountList[i].accountCash;
            }
          }

          //this.totalMktVal = Math.round(this.totalMktVal); --AF20200605 | RBL-3018
          this.taxableMktVal = Math.round(this.taxableMktVal);
          this.nonTaxableMktVal = Math.round(this.nonTaxableMktVal);
        }
      }));
    } else {
      return this.loadDataForIndividualAccount();
    }
  }

  loadDataForIndividualAccount() {
    return this.accountService.getPortfolioDetailsByIdForIndividualAccount(this.portfolioId).pipe(map((result) => {
      this.responseCode = result.code;
      if (result.code == 404 || result.code == 0) {
        this.router.navigate(['404']);
      } else if (result.code < 0) {
        this.error = result.message;
      } else {
        let accountData = result.responsedata.items[0];
        this.portfolioId = accountData.portfolioId;
        this.portfolioName = accountData.portfolioName;

        if (accountData.modelId) {
          this.modelName = accountData.modelName;
          this.modelId = accountData.modelId;
          this.modelAttributeType = "N/A"; //Todo: Need to fetch model AttributeType when introducing Attribute Model feature for BlueLeaf
          this.modelTypeNum = accountData.modelType;
        } else {
          this.modelName = '--';
        }

        /** Account summary data load in case of individual account **/
        this.accountSummary = accountData;
        this.accountSummary.marketValue = accountData.marketValue;
        this.accountSummary.accountNumber = accountData.accountNumber;
        this.accountSummary.accountName = accountData.portfolioName;
        this.accountSummary.freeCash = accountData.coreCash;
        this.accountSummary.freeCashPercentage = Math.round(accountData.coreCashPct * 100) / 100;

        this.driftDetails = Object.assign({}, accountData);
        this.drift.driftDate = this.driftDetails['asOfDate'];
        this.drift.setErrorMessage(this.driftDetails['statusDescription']);
        /** ---- **/

        this.cd.detectChanges();

        this.defaultAccount = accountData.accountId;
        this.loadAccountSettings(this.defaultAccount, true);
      }
    }));
  }

  loadAccountSummary(accountId) {
    this.accountSummaryErrMsg = null;
    this.portfolioService.getAccountSummary(this.portfolioId, accountId).subscribe((result) => {
        if (result.code == 200) {
          this.accountSummary = result.responsedata;
        } else {
          this.accountSummary = null;
          this.accountSummaryErrMsg = 'Unexpected response from server: ' + result.code + ': ' + result.message;
          console.error(result.message);
        }

        this.cd.detectChanges();
      },
      error => {
        this.accountSummary = null;
        this.accountSummaryErrMsg = 'Unexpected response from server: ' + error + ': Server error';
        console.error(error);
      });
  }

  loadAccountSettings(acc_id, reload?: boolean) {

    if (this.selectedAccount !== acc_id || reload == true) {
      this.selectedAccount = acc_id;

      if (this.isHouseHold) {
        this.loadAccountSummary(acc_id);
      }

      this.drift.loadDriftReport(this.portfolioId);
      this.positions.loadPositions(acc_id);
      this.restrictions.loadRestrictions(this.portfolioId, acc_id);

      if (this.urebalPermissions.isAllowed("equivalenceList")) {
          this.equivalences.loadEquivalences(acc_id);
      }

      //this.getDriftDetails();

      /** Remove unnecessary service(s) call using appropriate permissions */
      if (this.urebalPermissions.isAllowed('accountModifyTaxSettings')) {
        this.taxsettings.loadTaxSettings(acc_id);
      }
      if (this.urebalPermissions.isAllowed('accountModifyRestrictions')) {
        this.attributes.loadAccountAttributes(acc_id);
      }
      if (this.urebalPermissions.isAllowed('accountUploadWashsales')) {
        this.washsales.loadWashsale(acc_id);
      }
      /** -- */

      this.restrictions.isLoadedAsModal = (this.loadAsModal ? true : false);
    }

    setTimeout(() => {
      $('.accounts-selection li').removeClass('list-active');
      $('#' + this.selectedAccountNav).parent().parent().parent().addClass('list-active');
    }, 100);
  }

  tabSelection() {

  }

  handleTabsClick(event: any) {
      this.openTab(event.target.dataset.target);
  }

  // target should match the data-target field defined for the tabs in template/html
  openTab(target) {
      this.selectedIndex = target;
      this.noChangesErr = '';
      this.successMsg = '';
  }

  applyButtonCondition() {
    let count = 0;
    for (let key in this.isApplicableCondition) {
      if (this.isApplicableCondition[key]) {
        count++;
      }
    }
    if (count == 3) {
      return true;
    }
    return false;
  }

  changeAccount(event, id) {
    this.selectedAccountNav = event.currentTarget.id;

    if (this.positions.positionsChange() || this.taxsettings.settingsChange() || this.restrictions.restrictionsChange() || this.attributes.restrictionsChange()) {
      if (!confirm("Changes you made will not be saved, Are you sure you want to continue?")) {
        return;
      } else {
        this.redirectToAnotherAccount(id);
      }
    } else {
      this.redirectToAnotherAccount(id);
    }
  }

  redirectToAnotherAccount(id) {
    this.defaultAccount = id;
    this.successMsg = '';
    this.msgsArr = [];
    this.noChangesErr = '';
    this.restrictions.restrictionsError = [];
    this.attributes.removeError();
    $('.report-tabs > .active > a').click();
    this.loadAccountSettings(this.defaultAccount);
    this.isApplicableCondition = {taxsettings: true, restrictions: true, attributeRestrictions: true};
  }

  filterAccount(event) {
    let value = event.target.value;
    this.accountListSearch = [];
    value = value.trim().toUpperCase();

    if (value.length == 0) {
      this.accountListSearch = this.accountList;
      return;
    }

    $('.accounts-selection li:first').addClass('list-active');

    for (let account of this.accountList) {
      let checkAccountName = account.id.toUpperCase();

      if (checkAccountName.indexOf(value) != -1) {
        this.accountListSearch.push(account);
      }
    }
  }

  _apply() {
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

    UILoader.blockUI.start("Loading");

    this.apply().subscribe(
      () => {
      },
      error => {
        console.log(error);
        UILoader.blockUI.stop();
      },
      () => {
        return this.getPortfolio(this.selectedAccount).subscribe(
          () => {
          },
          (error) => {
            console.log(error);
            UILoader.blockUI.stop();
          }, () => {
            UILoader.blockUI.stop();
          });
      }
    );
  }

  apply() : Observable<any> {
    const requests = [];

    if (this.positions.positionsChange()) {
      const positionsRequest = this.positions.savePositions().pipe(map(result => {
          if (result.error && result.error.length() > 0) {
            $('.report-tabs li:eq(0) > a').click();
          }
        }
      ));

      requests.push(positionsRequest);
    }

    if (this.taxsettings.settingsChange()) {
      const taxSettingsRequest = this.taxsettings.save().pipe(map(errors => {
        if (errors != '') {
          $('.report-tabs li:eq(1) > a').click();
        }
      }));

      requests.push(taxSettingsRequest);
    }

    if (this.restrictions.restrictionsChange()) {
      const restrictionsRequest = this.restrictions.save().pipe(map(errors => {
        if (errors.length > 0) {
          $('.report-tabs li:eq(2) > a').click();
        }
      }));

      requests.push(restrictionsRequest);
    }

    if (this.attributes.restrictionsChange()) {
      const attributesObservable = this.attributes.save().pipe(map(errors => {
        if (errors && errors.length > 0) {
          $('.report-tabs li:eq(3) > a').click();
        }
      }));

      requests.push(attributesObservable);
    }

    return forkJoin(requests);
  }

  cancelBtnPressed() {
    this.noChangesErr = '';
    this.successMsg = '';
    if (this.loadAsModal) {

      if (this.responseCode < 0) {
        this.closeInModalMode();
      } else if (!this.positions.positionsChange() && !this.taxsettings.settingsChange() && !this.restrictions.restrictionsChange() && !this.attributes.restrictionsChange()) {
        this.closeInModalMode();
      } else {
        this.openModal('cancelAccountSettings');
      }
    } else {
      if (this.responseCode < 0) {
        this.navigateToAccountsList();
      } else if (!this.positions.positionsChange() && !this.taxsettings.settingsChange() && !this.restrictions.restrictionsChange() && !this.attributes.restrictionsChange()) {
        this.navigateToAccountsList();
      } else {
        this.openModal('cancelAccountSettings');
      }
    }

  }

  closeInModalMode() {
    this.closeModalModeEmitter.next('closeModal');
  }


  openModal(id) {
    let instance = this.accountSettingsModalRef.toArray().find(modal => modal.id == id);
    if (instance != null && instance != undefined) {
      instance.open();
    }
  }

  navigateToAccountsList() {
    //this.router.navigate([DriftService.ACCOUNT_DRIFTS_URL_PATH]);
    this.router.navigate(["/secure/drift/list"]);
  }

  cancelHouseholdChanges() {
    if (this.householdInitialStateChanged) {
      this.openModal('cancelHouseholdChangesModel');
    } else {
      this.restoreHouseholdInitialState();
    }
  }

  isAllAccountMarkedforDeletion() {
    let householdDeletion: boolean = false;
    if (this.accountListSearch.length == this.householdData.accounts.filter(account => account.status == this.householdAccountStates.Removed).length) {
      householdDeletion = true;
    }

    return householdDeletion;
  }

  confirmSaveChanges() {
    this.warningMsg = '';
    if (((this.accountsInitialCount - this.tobeRemovedCount) + this.tobeAddedCount) == 1) {
      /** Invalid household scenario as household with only ONE account does not make sense **/
      this.openModal('invalidHouseholdChangesModel');
      return;
    } else if (this.isAllAccountMarkedforDeletion()) {
      this.warningMsg = this.messages.householdDissolve;
    } else if (this.tobeRemovedCount > 0) {
      this.warningMsg = this.messages.accountsTobeRemoved;
    } else if (this.tobeAddedCount > 0) {
      this.warningMsg = this.messages.accountsTobeAdded;
    } else {
      this.warningMsg = this.messages.householdChanged;
    }
    this.openModal('saveHouseholdChangesModal');
  }

  saveHouseholdChanges() {

    this.householdPostServiceError = '';
    this.isEditHousehold = false;
    UILoader.blockUI.start();
    /** Save household service call **/
    this.accountService.saveHouseHoldData(this.householdData).subscribe(result => {
        if (result.code === 200) // some accounts are removed/added from this household
        {
          // show success message (with result.message) in modal with ok, clicking ok will reload data
          UILoader.blockUI.stop();
          this.openModal('successHouseholdChangesModel');
        } else if (result.code === 302) // in case of household dissolve
        {
          // show success message (with result.message) in modal with ok, clicking ok will redirect user to account list???
          UILoader.blockUI.stop();
          this.openModal('dissolveHouseholdChangesModel');
        } else if (result.code === 404) // in case of incorrect portfolioId or portfolioName is provided to post service
        {
          // show success message in modal with ok, with result.message.
          UILoader.blockUI.stop();
          this.householdPostServiceError = result.message;
          this.openModal('householdPostServiceErrorModal');
        } else {
          UILoader.blockUI.stop();
          this.householdPostServiceError = result.message;
          this.openModal('householdPostServiceErrorModal');
        }
      },
      error => {
        UILoader.blockUI.stop();
        console.log(error);
        this.householdPostServiceError = error;
        this.openModal('householdPostServiceErrorModal');
      });
    //UILoader.blockUI.stop();
    /** end Save household service call **/

    //this.householdData = ;
    this.householdData.accounts = [];
    this.tobeRemovedCount = 0;
    this.tobeAddedCount = 0;
    this.householdInitialStateChanged = false;
    // this.closeModal('saveHouseholdChangesModal');
  }

  refreshHousehold() {
    this.closeModal('successHouseholdChangesModel');
    this.loadAutoComplete();
    this.getPortfolio().subscribe(() => {
      //setTimeout(() => this.overviewTab.refresh() ); // wait for accountList to load in RestrictionOverview
    });
  }

  markAccountforDeletion(idx) {
    this.errMsg = '';

    /** find index of account that does not originally exists and delete it from the list**/
    let account = this.householdData.accounts.find(account => account.accountId == this.accountListSearch[idx].id);

    if (account != null && account != undefined) {
      if (account.status == this.householdAccountStates.Added) {
        //this.accountListSearch.splice(this.accountListSearch.indexOf(portfolio => portfolio[idx].id == account.accountId), 1);
        this.accountListSearch.splice(idx, 1);
        this.householdData.accounts.splice(this.householdData.accounts.findIndex(acc => acc.accountId == account.accountId), 1);
        this.tobeAddedCount--;
        this.updateHouseholdChangedState();
        return;
      } else {
        this.setStyleForAccountToBeRemoved(idx);
      }
    } else {
      this.setStyleForAccountToBeRemoved(idx);
      this.householdData.accounts.push({
        accountId: this.accountListSearch[idx].id,
        accountName: this.accountListSearch[idx].accountName,
        status: this.householdAccountStates.Removed
      });
      this.updateHouseholdChangedState();
      this.tobeRemovedCount++;
    }
  }

  setStyleForAccountToBeRemoved(idx) {
    $('#dataState' + idx).text('remove').css("font-style", "italic").css("color", "red");
    $('#accountNameText' + idx).css("text-decoration", "line-through").css("text-decoration-color", "red");
    $('#btnMarkForDeletion' + idx).css("display", "none");
    $('#btnUndoDeletion' + idx).css("display", "inline");
  }

  updateSuccessMessage(val) {
    this.msgsArr.push(val);
    this.successMsg = this.msgsArr.toString() + ' have been saved successfully.';
  }


  resetStyleForAccountToBeRemoved(idx) {
    $('#dataState' + idx).text('');
    $('#accountNameText' + idx).css("text-decoration", "none");
    $('#btnMarkForDeletion' + idx).css("display", "inline");
    $('#btnUndoDeletion' + idx).css("display", "none");
  }

  editButtonClicked() {
    this.isEditHousehold = !this.isEditHousehold;
    this.errMsg = '';

    this.cd.detectChanges();

    if (this.isEditHousehold == true) {
      $('#' + this.autoComplete.inputID).focus();
    }
  }

  undoDeletion(idx) {
    this.errMsg = '';

    /** check number of account should not exceed 15 in current household **/
    if (this.isAccountsLimitReached()) {
      this.autoComplete.item = '';
      this.errMsg = this.messages.accountsLimitExceeds;
      return;
    }

    let index = this.householdData.accounts.findIndex(account => account.accountId == this.accountListSearch[idx].id && account.status == this.householdAccountStates.Removed); //this.accountsMarkedforDeletion.indexOf(this.accountListSearch[idx].id);
    if (index > -1) {
      this.householdData.accounts.splice(index, 1);
      this.tobeRemovedCount--;
      this.updateHouseholdChangedState();
      this.resetStyleForAccountToBeRemoved(idx);
    }
  }

  isAccountsLimitReached(): boolean {
    /*if((this.accountListSearch.length - this.accountsMarkedforDeletion.length) == 15) {
      return true;
    }*/
    if ((this.accountListSearch.length - this.householdData.accounts.filter(account => account.status == this.householdAccountStates.Removed).length) == 15) {
      return true;
    }
    return false;
  }

  addAccountToList(portfolio) {
    this.errMsg = '';

    /** check number of account should not exceed 15 in current household **/
    if (this.isAccountsLimitReached()) {
      this.autoComplete.item = '';
      this.errMsg = this.messages.accountsLimitExceeds;
      return;
    }

    /** if selected account already exists in household **/
    if (this.accountListSearch.findIndex(acc => acc.id == portfolio.accounts[0].accountId) > -1) {
      this.errMsg = `'${portfolio.portfolioName}' already exists/added.`; //this.messages.accountAlreadyExists;
      this.autoComplete.item = '';
      return;
    }

    /** add new account info temporarily in the source array **/
    this.accountListSearch.push({
      'id': portfolio.accounts[0].accountId,
      'accountName': portfolio.accounts[0].accountName
    });

    /** add accountid to new temp array **/
    this.householdData.accounts.push({
      accountId: portfolio.accounts[0].accountId,
      accountName: portfolio.accounts[0].accountName,
      status: this.householdAccountStates.Added
    });
    this.tobeAddedCount++;
    this.updateHouseholdChangedState();

    /** using angular change detection since our binding source (i.e. in this case accountListSearch array) has been modified,
     * and dom (for newly created elements) will not be updated unless we explicitly trigger this change detection **/
    this.cd.detectChanges();

    $('#dataState' + (this.accountListSearch.length - 1)).text('add').css("font-style", "italic").css("color", "green");
    this.autoComplete.item = '';
  }

  restoreHouseholdInitialState() {

    /** restore original accounts in this household **/
    this.householdData.accounts.forEach(account => {
      let idx = this.accountListSearch.findIndex(acc => acc.id == account.accountId && account.status == this.householdAccountStates.Added);
      if (idx > -1) {
        this.accountListSearch.splice(idx, 1);
      }
    });

    this.isEditHousehold = false;
    this.householdData.accounts = [];
    this.tobeRemovedCount = 0;
    this.tobeAddedCount = 0;
    this.householdInitialStateChanged = false;
  }


  private getDriftDetails() {

    this.accountService.getDriftDetails(this.portfolioId).subscribe((result) => {
      this.responseCode = result.code;
      if (result.code == 200) {

        this.driftDetails = result.responsedata; //TODO: service need to refactor to send single row instead of array
        this.drift.driftDate = this.driftDetails['asOfDate']; // TODO: service need to refactor to send single row instead of array
        this.drift.setErrorMessage(result.responsedata['driftDescription']); // TODO: service need to refactor to send single row instead of array
        UILoader.blockUI.stop();
      } else {
        UILoader.blockUI.stop();
      }
    });
  }

  cancelAccSetting_YesBtnPressed(id: string) {
    this.noChangesErr = '';
    this.successMsg = '';
    this.loadAsModal ? this.closeInModalMode() : this.navigateToAccountsList();
    this.closeModal(id);

  }

  dissolveHouseholdChangesModelOKPressed() {
    this.loadAsModal ? this.closeInModalMode() : this.navigateToAccountsList();
  }

  closeModal(id) {
    let instance = this.accountSettingsModalRef.toArray().find(modal => modal.id == id);
    if (instance != null && instance != undefined) {
      instance.close();
    }
  }

  openModelDetails(modelName) {
    if (this.loadAsModal) {
      this.closeInModalMode();

    }
    this.router.navigate(['/secure/model/detail', this.modelId]);
  }

  haveModelPermission(modelId, modelTypeNum) {
    let modelTypePermission = modelTypePermissions.find((m) => m.modelType == modelTypeNum);
    return modelTypePermission && this.urebalPermissions.isAllowed(modelTypePermission.permissionName);
  }

}
