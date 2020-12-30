import {
    Component, ElementRef, Output, EventEmitter, ViewChild, QueryList, ViewChildren,
    ChangeDetectorRef
} from "@angular/core";
import {ModalComponent} from "../../../shared/components/modal/modal.component";
import {ModelElementsComponent} from "../../../model/components/model-elements/model-elements.component"
import {URebalService} from "../../../services/urebal.service";
import {CriteriaService} from "../../../workspaces/components/criteria-builder/criteria.service";
import {ActivatedRoute, Router} from "@angular/router";
import {WorkspaceService} from "../../../workspaces/workspace.service";
import {ModelService} from "../../../model/model.service";
import {AccountService} from "../../account.service";
import {UrebalAutocompleteComponent} from "../../../shared/components/urebal-autocomplete/urebal-autocomplete.component";
import {UrebalGridComponent} from "../../../shared/components/urebal-grid/urebal-grid.component";
import {EquivalenceBuilderComponent} from "../../../equivalences/equivalence-builder/equivalence-builder.component";
import {UILoader} from "../../../shared/util/UILoader";
import {PermissionResolverService, UrebalPermissions} from '../../../services/permission-resolver.service';
import {AccountDetailComponent} from "../../account-detail/account-detail.component";

import {RebalanceTemplateObject} from "../../../shared/classes/RebalanceTemplate.class";
import {UrebalDropdownComponent} from "../../../shared/components/urebal-dropdown/urebal-dropdown.component";
import {SoftpakDropdownComponent} from "../../../shared/jqwidgets/jqx-dropdown/softpak-dropdown.component";
import {SoftpakComboBoxComponent} from "../../../shared/jqwidgets/jqx-combobox/softpak-combobox.component";
import {ModelType} from "../../../model/model.data-types";
import {AppConfig} from "../../../../app.config";
import {modelTypePermissions} from "../../../model/model.datasource";
import {of} from "rxjs";
import {map} from "rxjs/operators";

@Component({
    selector: 'app-rebalance-settings',
    templateUrl: './rebalance-settings.component.html',
    styleUrls: ['./rebalance-settings.component.css']
})
export class RebalanceSettingsComponent extends UrebalPermissions {
    public selectedTemplate: RebalanceTemplateObject;
    protected tiltingParameterList: any[] = [];
    public rebalanceTemplateList: RebalanceTemplateObject[] = [];

    @ViewChild(UrebalDropdownComponent) templateDropDown: UrebalDropdownComponent;

    public rebalanceSettings: any;
    public accountIds: any = [];
    public elementRef;
    public selectedSleeve;
    private LoggedIn: boolean = false;
    public isSaveProgress: boolean = false;
    public securityTypesList: any;
    public templateSecurityTypesList: any;
    public cachedTemplateSecurityTypesList: any;
    public errMessage: string;
    private selectedType;
    @ViewChild('rebTemplateRef') rebTemplateRef: ModalComponent;
    public saveTemplateName: string;
    public saveTemplateError: string;
    public saveTemplateSuccess: string;
    private modelList: any = [];
    private modelSecurities: any = [];
    private modelSubModels: any = [];
    private securityRanking = [];
    private tiltParameters: any = [];
    private selectTiltAccount: string;
    private selectTiltParamName: string;
    private tiltParamExist: boolean;
    private tiltParamSecurities: any = [];
    private rankSecurities: any[];
    private deleteAccountParam = [];
    //private objTabError:string;
    private strAccounts = [];
    private deleteTiltParam: boolean = false;
    public inputValidationErr: boolean = false;
    private harvestGainDollar;
    private harvestLossDollar;
    public disableApplyModelAttribute: boolean = false;
    private subModelList: any = [];
    private rebSubModels: any = [];
    public errorMessage = "";
    public isCreateTemplateMode: boolean = false;

    @ViewChildren(UrebalGridComponent) modelGrids: QueryList<UrebalGridComponent>;
    @ViewChild('tiltingDetailGrid') tiltingDetailGrid: UrebalGridComponent;
    @ViewChild('rankDetailGrid') rankDetailGrid: UrebalGridComponent;

    //Add reference for modal component to use modal functionality and design
    @ViewChild('modalRef') addModalRef: QueryList<ModalComponent>;
    @ViewChildren(ModalComponent) accountDetailsModal: QueryList<ModalComponent>;
    @ViewChild('equivalenceModalRef') addEquivalenceModalRef: ModalComponent;
    @ViewChild('securitytyperoundingmodal') securityTypeRoundingModal: ModalComponent;
    @ViewChild('securitytyperoundingtemplatemodal') templateSecurityTypeRoundingModal: ModalComponent;
    @ViewChild('rebalanceNameTemplateWarningRef') rebalanceNameTemplateWarningModal: ModalComponent;
    @ViewChild('modelElementsDetailRef') modelElementsDetail: ModelElementsComponent;
    @ViewChild('tiltParamDetailsRef') tiltParamDetailsModal: ModalComponent;
    @ViewChild('rankDetailsRef') rankDetailsModal: ModalComponent;
    // @ViewChild('equivalenceBreakDownRef') equivalenceBreakDownModal: ModalComponent;
    @ViewChild('equivalenceBuilderRef') equivlenceBuilder: EquivalenceBuilderComponent;
    //Add refernec for accoutn settings component to use account settings functionality and screen
    @ViewChild("accountSettingsModalRef") accountSettingsModal: ModalComponent;
    @ViewChild('accountSettingsRef') accountSettings: AccountDetailComponent;

    @ViewChild('modelAutoComplete') modelAutoComplete: UrebalAutocompleteComponent;
    @ViewChild('tiltAutoComplete') tiltParamAutoComplete: UrebalAutocompleteComponent;
    @ViewChild('modelSleeveDropDownRef') modelSleeveDropDown: SoftpakDropdownComponent;

    @ViewChild('modelComboxBoxRef') modelComboxBox: SoftpakComboBoxComponent;

    @Output() onClose: EventEmitter<any> = new EventEmitter();

    private options = [
        {id: 0, type: "Rebalance to Target", disabled: false, hidden: false, title: 'All securities are rebalanced to meet their benchmark targets'},
        {id: 1, type: "Rebalance to Tolerance", disabled: false, hidden: false, title: 'All securities are rebalanced to meet their benchmark tolerance bands'},
        {id: 2, type: "Generate Cash", disabled: false, hidden: false, title: 'Rebalance with buying disabled to generate specified cash amount'},
        {id: 3, type: "Invest Cash", disabled: false, hidden: false, title: 'Rebalance with selling disabled and buys proposed using available cash'},
        {id: 4, type: "Rebalance To Asset Allocation", disabled: true, hidden: false, title: 'All securities are rebalanced to bring attributes within min/max ranges'},
        {id: 5, type: "Rebalance Within Model Sleeve", disabled: true, hidden: false, title: 'All Securities are rebalanced to meet their sub-model weights, total weight of sub-model remains unchanged'},
        {id: 7, type: "Harvest Gain", disabled: false, hidden: false, title: 'N/A'},
        {id: 8, type: "Harvest Loss", disabled: false, hidden: false, title: 'N/A'}
    ];

    private directionArray = ['UP', 'DOWN'];
    private lotsOrderArray = ['Sell the earliest'];
    private roundLotSizeOptions = ['Do not round', 1, 5, 10, 25, 50, 75, 100, 500, 1000];
    private roundDirections = ["UP", "DOWN"];
    private lotSellOrderingArray = {
        'FIFO': 'Sell the earliest purchased lots first (FIFO)',
        'LIFO': 'Sell the recent purchased lots first (LIFO)',
        'MinTax': 'Sell the lots with minimum tax first (Min.Tax)',
        'MaxTax': 'Sell the lots with maximum tax first (Max.Tax)',
        'HIFOLoss': 'Sell the lots with highest loss first (HIFO Loss)',
        'HIFOGain': 'Sell the lots with highest gain first (HIFO Gain)',
        'HIFOCost': 'Sell the lots with highest cost first (HIFO Cost)',
        'AverageCost': 'Sell the lots in FIFO averaging cost (Average Cost)',
    };
    private taxSortingStrategy = {
        'LOSS-FIRST': 'Sell Loss securities first',
        'GAIN-FIRST': 'Sell Gain securities first',
        'CONVERGE-TO-ZERO': 'Converge towards zero Gain-Loss'
    };
    private modelTypes = {1: "Security Model", 2: "Attribute Model", 3: "Asset Allocation Model"}
    private portfolioName: string;
    private portfolioId: number;
    private selectedModel;
    public rebModalId: string = "";
    private rebalanceTemplateLoaded: boolean = false;
    private cachedRebalanceSecurityTypesList: any;
    private isHousehold: boolean;
    AppConfig = AppConfig;

    constructor(public urebalService: URebalService,
                criteriaService: CriteriaService,
                route: ActivatedRoute,
                router: Router,
                private workspaceService: WorkspaceService,
                myElement: ElementRef,
                private modelService: ModelService,
                private accountService: AccountService,
                permissionResolverService: PermissionResolverService,
                private changeDetector: ChangeDetectorRef,
                private urebalPermissions: UrebalPermissions) {
        super(permissionResolverService);
        //super(workspaceService, criteriaService, route, router, permissionResolverService);
        this.elementRef = myElement;
        //Hiding advance rebalancing options for bluleaf phase I build
        for (let item of this.options) {
            if (item.id > 3 && item.id < 6) {
                if(!this.isAllowed('workspaceRebalanceTypeSettings')){
                  item.hidden = true;
                }
            } else if (item.id > 6 && item.id < 9) {
                if (!this.isAllowed('accountModifyTaxSettings')) {
                  item.hidden = true;
                }
            }
        }

        if (this.isAllowed('objectiveFunctionRebalancing')) {
            this.accountService.getSecurityRankingList().subscribe((result) => {
                if (result.code == 200) {
                    this.securityRanking = result.responsedata;
                }
            });
            this.getTiltParameterList();
        }


    }

    ngAfterViewInit() {

        $('.urebal-tabs li').on('click', (e) => {

            let target = $(e.currentTarget).data("target");

            //make current tab highlighted
            $('.urebal-tabs li').removeClass('slds-active');
            $(e.currentTarget).addClass('slds-active')


            $('.urebal-tab-container').each(function () {

                if ($(this).hasClass('slds-show')) {
                    $(this).removeClass('slds-show').addClass('slds-hide');
                }

                if ($(this).attr("id") == target) {
                    $(this).removeClass('slds-hide').addClass('slds-show');
                }

            });
        });

    }


    openSaveTemplateModal() {
        this.rebTemplateRef.open()
    }

    loadRebalanceTemplate() {
        this.saveTemplateError = "";
        this.saveTemplateSuccess = "";

        if (this.selectedTemplate) {
            this.rebalanceSettings.lotOrder = this.selectedTemplate.lotOrder;
            this.selectedType = this.options[this.selectedTemplate.rebalanceType > 6 ? this.selectedTemplate.rebalanceType - 1 : this.selectedTemplate.rebalanceType];
            this.rebalanceSettings.roundSellDirection = this.selectedTemplate.roundSellDirection;
            this.rebalanceSettings.roundBuyDirection = this.selectedTemplate.roundBuyDirection;

            if (this.selectedTemplate.roundNearestUnit == 0) {
                this.rebalanceSettings.roundNearestUnit = "Do not round";
            } else {
                this.rebalanceSettings.roundNearestUnit = this.selectedTemplate.roundNearestUnit;
            }
            this.rebalanceSettings.isSecurityTypeRounding = this.selectedTemplate.isSecurityTypeRounding;
            this.rebalanceSettings.isWashsaleApply = this.selectedTemplate.isWashsaleApply;
            this.rebalanceSettings.isEquivalenceApply = this.selectedTemplate.isEquivalenceApply;
            this.rebalanceSettings.isRestrictionApply = this.selectedTemplate.isRestrictionApply;
            this.rebalanceSettings.isModelAttributesApply = this.selectedTemplate.isModelAttributesApply;
            this.rebalanceSettings.cashToGenerate = this.selectedTemplate.cashToGenerate;
            this.rebalanceSettings.minTradeSize = this.selectedTemplate.minTradeSize;

            this.rebalanceSettings.model = this.selectedTemplate.model || {name: ''};
            this.rebalanceSettings.subModel = this.selectedTemplate.subModel;
            if (this.rebalanceSettings.model == null || this.rebalanceSettings.model.name === "") {
                this.modelComboxBox.selectedIndex(-1);
            } else {
                const selectedIndex = this.modelList.findIndex(
                    (value, index, items) => value.modelName == this.rebalanceSettings.model.name
                );

                this.modelComboxBox.selectedIndex(selectedIndex);
            }

            this.rebalanceSettings.gainLossToHarvest = this.selectedTemplate.gainLossToHarvest;
            this.rebalanceSettings.equivalenceBuySplitRules = this.selectedTemplate.equivalenceBuySplitRules;
            this.rebalanceSettings.equivalenceSellSplitRules = this.selectedTemplate.equivalenceSellSplitRules;
            this.rebalanceSettings.isObjFunction = this.selectedTemplate.isObjFunction;
            this.rebalanceSettings.scalarRank = this.selectedTemplate.scalarRank;
            this.rebalanceSettings.scalarVariance = this.selectedTemplate.scalarVariance;
            this.rebalanceSettings.buyTransactionCost = this.selectedTemplate.buyTransactionCost;
            this.rebalanceSettings.sellTransactionCost = this.selectedTemplate.sellTransactionCost;
            this.rebalanceSettings.rankSetID = this.selectedTemplate.rankSetID;
            this.rebalanceSettings.isReinvest = this.selectedTemplate.isReinvest;
            this.rebalanceSettings.isMTSApply = this.selectedTemplate.isMTSApply;
            this.rebalanceSettings.isAttributesApply = this.selectedTemplate.isAttributesApply;
            this.rebalanceSettings.sellStrategy = this.selectedTemplate.sellStrategy;
            this.getModelDetails();

            let params = {templateId: this.selectedTemplate.templateId};
            this.urebalService.post("RebalanceWS/getSecurityTypesByTemplateId", params)
                .subscribe(result => {
                    if (result.code == 200) {
                        this.templateSecurityTypesList = result.responsedata;
                        this.securityTypesList = [];
                        for (let type of this.templateSecurityTypesList) {
                            if (type.roundNearestUnit == 0) {
                                type.roundNearestUnit = "Do not round";
                            }

                            let data = {
                                roundBuyDirection: type.roundBuyDirection,
                                roundNearestUnit: type.roundNearestUnit,
                                roundSellDirection: type.roundSellDirection,
                                securityType: type.securityType
                            }
                            this.securityTypesList.push(data);

                        }

                        this.rebalanceTemplateLoaded = true;
                    }
                });
        }
    }

    createNewRebalanceTemplate() {
        if (this.saveTemplateName == null || this.saveTemplateName === "") {
            this.saveTemplateError = "Please enter template name";
            return;
        }
        this.workspaceService.getRebalanceTemplateByName(encodeURIComponent(this.saveTemplateName)).subscribe(response => {
                if (response.code == 0) {
                    this.saveRebalanceTemplate();

                } else {
                    this.openTemplateNameWarningModal();
                }
            },
            err => {
                console.error(err);
            });

    }

    openTemplateNameWarningModal() {
        this.saveTemplateError = "";
        this.rebalanceNameTemplateWarningModal.open();
    }

    saveRebalanceTemplate() {
        if (this.saveTemplateName == null || this.saveTemplateName === "") {
            this.saveTemplateError = "Please enter template name";
            return;
        }

        this.saveTemplateError = "";

        let rebalanceTemplate: RebalanceTemplateObject = new RebalanceTemplateObject();


        rebalanceTemplate.templateName = this.saveTemplateName;
        rebalanceTemplate.asOfDate = new Date;
        rebalanceTemplate.modificationDate = new Date;
        rebalanceTemplate.rebalanceType = this.selectedType.id;
        rebalanceTemplate.lotOrder = this.rebalanceSettings.lotOrder;
        rebalanceTemplate.roundSellDirection = this.rebalanceSettings.roundSellDirection;
        rebalanceTemplate.roundBuyDirection = this.rebalanceSettings.roundBuyDirection;


        if (this.rebalanceSettings.roundNearestUnit == "Do not round") {

            rebalanceTemplate.roundNearestUnit = 0;
        } else {
            rebalanceTemplate.roundNearestUnit = this.rebalanceSettings.roundNearestUnit;
        }

        rebalanceTemplate.isSecurityTypeRounding = this.rebalanceSettings.isSecurityTypeRounding;
        rebalanceTemplate.isWashsaleApply = this.rebalanceSettings.isWashsaleApply;
        rebalanceTemplate.isEquivalenceApply = this.rebalanceSettings.isEquivalenceApply;
        rebalanceTemplate.isRestrictionApply = this.rebalanceSettings.isRestrictionApply;
        rebalanceTemplate.isModelAttributesApply = this.rebalanceSettings.isModelAttributesApply;
        rebalanceTemplate.cashToGenerate = this.rebalanceSettings.cashToGenerate;
        rebalanceTemplate.minTradeSize = this.rebalanceSettings.minTradeSize;
        rebalanceTemplate.model = this.rebalanceSettings.model.name == "" ? null : this.rebalanceSettings.model;
        rebalanceTemplate.subModel = this.rebalanceSettings.subModel;
        rebalanceTemplate.gainLossToHarvest = this.rebalanceSettings.gainLossToHarvest;
        rebalanceTemplate.equivalenceBuySplitRules = this.rebalanceSettings.equivalenceBuySplitRules;
        rebalanceTemplate.equivalenceSellSplitRules = this.rebalanceSettings.equivalenceSellSplitRules;
        rebalanceTemplate.isObjFunction = this.rebalanceSettings.isObjFunction;
        rebalanceTemplate.scalarRank = this.rebalanceSettings.scalarRank;
        rebalanceTemplate.scalarVariance = this.rebalanceSettings.scalarVariance;
        rebalanceTemplate.buyTransactionCost = this.rebalanceSettings.buyTransactionCost;
        rebalanceTemplate.sellTransactionCost = this.rebalanceSettings.sellTransactionCost;
        rebalanceTemplate.rankSetID = this.rebalanceSettings.rankSetID;
        rebalanceTemplate.isReinvest = this.rebalanceSettings.isReinvest;
        rebalanceTemplate.isMTSApply = this.rebalanceSettings.isMTSApply;
        rebalanceTemplate.isAttributesApply = this.rebalanceSettings.isAttributesApply;
        rebalanceTemplate.sellStrategy = this.rebalanceSettings.sellStrategy;

        this.selectedTemplate = rebalanceTemplate;


        this.workspaceService.saveRebalanceTemplate(this.selectedTemplate).subscribe(
            response => {
                if (response.code == 200) {
                    this.saveTemplateSuccess = response.message;
                    this.getRebalanceTemplateList(() => {
                        if (this.isCreateTemplateMode) {
                            if (this.rebalanceNameTemplateWarningModal.hidden) {
                                this.rebalanceNameTemplateWarningModal.close();
                            }

                            for (let type of this.templateSecurityTypesList) {

                                if (type.roundNearestUnit === "Do not round") {
                                    type.roundNearestUnit = 0;
                                }
                            }

                            this.urebalService.post("RebalanceWS/saveTemplateSecurityTypeByTemplateName?templateName=" + encodeURIComponent(this.saveTemplateName), this.templateSecurityTypesList)
                                .subscribe(result => {
                                    if (result.code == 200) {
                                        this.templateSecurityTypesList = result.responsedata;
                                        this.cachedTemplateSecurityTypesList = null;

                                        this.saveTemplateName = "";
                                        this.selectedModel = undefined;

                                        this.closeDrawer();
                                    } else {
                                        this.errMessage = "Failed to save security type rounding information";
                                    }
                                });


                        } else {
                            let securityTypeList$;

                            if (!this.securityTypesList) {
                                let params = {
                                    workflowId: this.rebalanceSettings.rebalanceId,
                                    modelName: this.rebalanceSettings.model.name,
                                    accountIds: this.accountIds
                                };

                                securityTypeList$ = this.urebalService.post("RebalanceWS/getSecuritiesType", params)
                                    .pipe(map(result => {
                                        if (result.code == 200) {
                                            this.securityTypesList = result.responsedata;
                                            this.templateSecurityTypesList = [];

                                            for (let type of this.securityTypesList) {

                                                if (type.roundNearestUnit == "Do not round") {
                                                    type.roundNearestUnit = 0;
                                                }
                                                let data = {
                                                    roundBuyDirection: type.roundBuyDirection,
                                                    roundNearestUnit: type.roundNearestUnit,
                                                    roundSellDirection: type.roundSellDirection,
                                                    securityType: type.securityType
                                                }
                                                this.templateSecurityTypesList.push(data);
                                            }

                                            return this.templateSecurityTypesList;
                                        }
                                    }));
                            } else {
                                securityTypeList$ = of(this.securityTypesList)
                            }

                            securityTypeList$.subscribe(securityTypesList => {
                                this.templateSecurityTypesList = [];

                                for (let type of securityTypesList) {

                                    if (type.roundNearestUnit == "Do not round") {
                                        type.roundNearestUnit = 0;
                                    }
                                    let data = {
                                        roundBuyDirection: type.roundBuyDirection,
                                        roundNearestUnit: type.roundNearestUnit,
                                        roundSellDirection: type.roundSellDirection,
                                        securityType: type.securityType
                                    };
                                    this.templateSecurityTypesList.push(data);

                                }

                                this.urebalService.post("RebalanceWS/saveTemplateSecurityTypeByTemplateName?templateName=" + encodeURIComponent(this.saveTemplateName), this.templateSecurityTypesList)
                                    .subscribe(result => {
                                        if (result.code == 200) {
                                            const securityTypesRoundingList = result.responsedata;

                                            this.securityTypesList = securityTypesRoundingList.map(type => ({
                                                roundBuyDirection: type.roundBuyDirection,
                                                roundNearestUnit: type.roundNearestUnit == 0 ? "Do not round" : type.roundNearestUnit,
                                                roundSellDirection: type.roundSellDirection,
                                                securityType: type.securityType,
                                            }));

                                            this.rebTemplateRef.close();
                                        } else {
                                            this.errMessage = "Failed to save security type rounding information";
                                        }
                                    });
                            });
                        }

                    });


                } else {
                    this.saveTemplateError = response.message;
                    this.selectedTemplate = null;
                    this.rebTemplateRef.close();
                }
            },
            err => {
                console.error(err);
            });


    }

    selectParamFromList(item) {
        this.selectTiltParamName = item;
        this.errMessage = "";
    }

    isAddTiltParam() {
        return this.tiltParamExist;
    }

    getTiltParameterList() {
        this.workspaceService.getTiltParameterList().subscribe(
            result => {
                if (result.code == 200) {
                    this.tiltingParameterList = result.responsedata;
                } else {
                    console.error(result.message);
                }
            },
            err => {
                console.error(err);
            });
    }

    addtiltParameterInList() {
        for (let i = 0; i < this.tiltParameters.length; i++) {
            // if a clear account entry(With parameter == null) is added in list
            // then remove it from list since a new
            // entry is added in the account so no need to clear the account.
            if (this.tiltParameters[i].accountId == this.selectTiltAccount && this.tiltParameters[i].parameter == null) {
                this.tiltParameters.splice(i, 1);
                continue;
            }
            if (this.tiltParameters[i].parameter.parameterName.toUpperCase() == this.selectTiltParamName.toUpperCase()
                && this.tiltParameters[i].accountId == this.selectTiltAccount) {
                this.errMessage = 'Tilt parameter already exists';
                return;
            }
        }
        for (let tiltParameter of this.tiltingParameterList) {
            if (tiltParameter.parameterName.toUpperCase() == this.selectTiltParamName.toUpperCase()) {
                let parameter = {
                    parameter: {
                        parameterName: tiltParameter.parameterName,
                        parameterID: tiltParameter.parameterID,
                    },
                    goal: 0,
                    scale: 0,
                    accountId: this.selectTiltAccount
                };
                this.tiltParameters.push(parameter);
                this.errMessage = "";
                return;
            }
        }

        this.errMessage = 'Invalid Tilt parameter';

    }

    changeRebalanceType() {
        this.inputValidationErr = false;
        switch (this.selectedType.id) {
            case 2: {
                if (this.rebalanceSettings.cashToGenerate <= 0)
                    this.inputValidationErr = true;
                break;
            }
            case 4: {
                this.rebalanceSettings.isModelAttributesApply = true;
                break;
            }
            case 5: {
                this.rebalanceSettings.isModelAttributesApply = true;
                break;
            }
            case 7: {
                this.harvestGainDollar = this.rebalanceSettings.gainLossToHarvest;
                this.harvestLossDollar = null;
                break;
            }
            case 8: {
                this.harvestLossDollar = this.rebalanceSettings.gainLossToHarvest;
                this.harvestGainDollar = null;
                break;
            }
        }
    }

    onChangeCTG() {
        if (this.rebalanceSettings.cashToGenerate >= 0) {
            this.inputValidationErr = false;
        }
    }

    getAccountIdsForRebalance(portfolioId, callback = () => {
    }) {

        let url = "portfolios/getAccountIds?portfolioId=" + portfolioId;
        this.urebalService.get(url)
            .subscribe(result => {

                if (result.code == 200) {
                    this.accountIds = result.responsedata;
                } else {
                    console.error(result.message);
                    this.errMessage = 'Rebalance data not found.';
                }
            });
        callback();
    }

    getUserRebalanceSettings(portfolioId, templateList, callback = () => {
    }) {
        this.isSaveProgress = false;
        this.selectedTemplate = null;
        this.saveTemplateSuccess = "";
        this.errMessage = "";
        this.rebalanceTemplateList = templateList;
        let url = "portfolios/" + portfolioId + "/rebalance";


        this.urebalService.get(url)

            .subscribe(result => {

                if (result.code == 200) {

                    let rebType = result.responsedata.rebalance.rebalanceType;
                    if (rebType == 6)
                        rebType = 0;
                    this.selectedType = this.options[rebType > 6 ? rebType - 1 : rebType];

                    this.rebalanceSettings = result.responsedata.rebalance;

                    this.rebalanceSettings.portfolio = {
                        portfolioId: result.responsedata.portfolioId,
                        portfolioName: result.responsedata.portfolioName,
                        isClone: result.responsedata.isClone,
                        isHouseHold: result.responsedata.isHouseHold,
                        //AF01092020: accounts are not fetched here anymore. A seperate service fetches the account ids now
                    };
                    if (this.rebalanceSettings.roundNearestUnit == 0) {
                        this.rebalanceSettings.roundNearestUnit = "Do not round";
                    }
                    this.portfolioId = result.responsedata.portfolioId;
                    this.portfolioName = result.responsedata.portfolioName;
                    this.isHousehold = result.responsedata.isHouseHold;
                    this.errMessage = "";
                    this.disableApplyModelAttribute = false;

                    if (this.rebalanceSettings.model == null) {
                        this.selectedModel = undefined;
                        this.rebalanceSettings.model = {name: ''};
                        this.errorMessage = "No model is assigned";
                    } else {
                        this.modelSubModels = [];
                        this.selectedModel = {
                            modelName: this.rebalanceSettings.model.name,
                            modelType: this.modelTypes[this.rebalanceSettings.model.modelType],
                            elementsCount: -1,
                            cashTargetPctWt: -1
                        };

                        if (this.rebalanceSettings.model.modelType == 3) {
                            this.options[4].disabled = false;
                            this.options[5].disabled = false;
                        } else {
                            this.options[4].disabled = true;
                            this.options[5].disabled = true;
                            this.disableApplyModelAttribute = true;
                        }
                    }
                    this.changeDetector.detectChanges();


                    this.changeRebalanceType();


                    callback();
                    //AF01092020: This has to be called after callback as account ids are required in this method
                    this.createTiltingData();

                } else {
                    console.error(result.message);
                    this.errMessage = 'Rebalance data not found.';
                }

            });
    }

    getDefaultRebalanceSettings(templateList, callback = () => {
    }) {
        this.isSaveProgress = false;
        this.selectedTemplate = null;
        this.saveTemplateSuccess = "";
        this.errMessage = "";
        this.rebalanceTemplateList = templateList;
        let url = "RebalanceWS/getDefaultRebalanceTemplate";


        this.urebalService.get(url)

            .subscribe(result => {

                if (result.code == 200) {

                    let rebType = result.responsedata.rebalanceType;
                    if (rebType == 6)
                        rebType = 0;
                    this.selectedType = this.options[rebType > 6 ? rebType - 1 : rebType];

                    this.rebalanceSettings = result.responsedata;


                    if (this.rebalanceSettings.roundNearestUnit == 0) {
                        this.rebalanceSettings.roundNearestUnit = "Do not round";
                    }

                    this.errMessage = "";
                    this.disableApplyModelAttribute = false;

                    if (this.rebalanceSettings.model == null) {

                        this.selectedModel = undefined;

                        this.rebalanceSettings.model = {name: ''};
                    }


                    this.changeDetector.detectChanges();
                    this.createTiltingData();

                    this.changeRebalanceType();


                    callback();

                } else {
                    console.error(result.message);
                    this.errMessage = 'Rebalance data not found.';
                }

            });
    }

    createTiltingData() {
        if (this.rebalanceSettings == null || this.rebalanceSettings.portfolio == null)
            return;

        if (this.accountIds == null || this.accountIds.length == 0)
            return;
        this.tiltParamExist = false;
        this.strAccounts = [];
        this.tiltParameters = [];
        for (let entry of this.accountIds) {
            this.strAccounts.push(entry);
            for (let param of entry.accountTiltParams) {
                let tempParam = JSON.parse(JSON.stringify(param));
                tempParam.accountId = entry;
                this.tiltParameters.push(tempParam);
            }
        }
        this.selectTiltAccount = this.accountIds[0].id;
        if (this.tiltingParameterList.length > 0)
            this.tiltParamAutoComplete.updateInputSource(this.tiltingParameterList);
    }

    getModelDetails() {
        this.rebalanceSettings.rebalanceType = this.selectedType.id;

        if (this.rebalanceSettings.model != null && this.rebalanceSettings.model.name != "") {
            //fetch security model elements of model type is 1 and AAM elements(SubModels) if model type is 3
            if (this.rebalanceSettings.model.modelType == ModelType.SecurityModel) {

                if (this.rebalanceSettings.rebalanceType == 4 || this.rebalanceSettings.rebalanceType == 5) {
                    this.rebalanceSettings.rebalanceType = 0;
                    this.selectedType = this.options[0];
                }
                this.options[4].disabled = true;
                this.options[5].disabled = true;
            } else {
                UILoader.blockUI.start('Loading Model...'); // Start blocking
                this.modelService.getModelElements(this.rebalanceSettings.model.id)
                    .subscribe(result => {
                            UILoader.blockUI.stop();
                            if (result.code == 200) {
                                this.openOptionsDueToCompositeModel(result.responsedata);
                            } else {
                                this.modelSubModels = [];
                                this.errMessage = 'could not extract Model sleeve information';
                            }
                        }
                    );
            }
        }
    }


    openOptionsDueToCompositeModel(modelList) {
        this.modelSubModels = [];
        this.subModelList = [];
        if (this.rebalanceSettings.subModel != null)
            this.rebSubModels = this.rebalanceSettings.subModel.split(",");
        for (let model of modelList) {
            if (model.ratio == 0) {
                continue;
            }
            let sleeve = {
                id: model.sleeve.id,
                name: model.sleeve.name.split("_" + this.rebalanceSettings.model.name)[0],
                ratio: model.ratio,
                checked: ((this.rebSubModels.indexOf(model.sleeve.id.toString()) > -1) ? true : false)
            }
            if (sleeve.checked)
                this.subModelList.push(sleeve.id);

            this.modelSubModels.push(sleeve);

            if (this.rebalanceSettings.subModel != null && sleeve.id === this.rebalanceSettings.subModel) {
                this.selectedSleeve = sleeve;
            }
            if (this.rebalanceSettings.model.modelType == 4)
                this.options[4].disabled = true;
            else
                this.options[4].disabled = false;

            this.options[5].disabled = false;
        }
        this.modelSleeveDropDown.source(this.modelSubModels);
    }

    changeModelSleeveDD(event) {
        event = event.args.item;
        if (event == null)
            return;
        const index = this.subModelList.indexOf(event.originalItem.id);
        if (event.checked == true) {
            if (index == -1)
                this.subModelList.push(event.originalItem.id);
        } else {
            if (index > -1)
                this.subModelList.splice(index, 1);
        }
    }

    modelElementLoaded() {
        if (this.rebalanceSettings.model.modelType == 1) {
            if (this.rebalanceSettings.rebalanceType == 4 || this.rebalanceSettings.rebalanceType == 5) {
                this.rebalanceSettings.rebalanceType = 0;
                this.selectedType = this.options[0];
            }

            this.options[4].disabled = true;
            this.options[5].disabled = true;
        } else {
            if (this.rebalanceSettings.model.modelType != 4)
                this.options[4].disabled = false;
            this.options[5].disabled = false;
        }
    }

    getModelsList() {

        this.urebalService.get("models")
            .subscribe(result => {
                if (result.code == 200) {
                    this.modelList = result.responsedata;
                    if (this.modelList && Array.isArray(this.modelList)) {
                        this.modelList.sort((a, b) => {
                            return a.modelName.localeCompare(b.modelName)
                        });
                    }
                    this.modelComboxBox.source(this.modelList);

                    if (this.rebalanceSettings != null && this.rebalanceSettings.model.name) {
                        const selectedIndex = this.modelList.findIndex(
                            (value, index, items) => value.modelName == this.rebalanceSettings.model.name
                        );

                        this.modelComboxBox.selectedIndex(selectedIndex);
                    }
                }
            });
    }

    openModelDetails() {
        this.rebalanceSettings.rebalanceType = this.selectedType.id;
        if (this.selectedModel != null && this.selectedModel.modelName != '') {
            let context = this.workspaceService.getAppContext();
            window.open(context + '/secure/model/detail/' + this.rebalanceSettings.model.id);
        }
    }

    openTiltParameterDetail() {
        if (this.selectTiltParamName != null) {
            this.workspaceService.getTiltParamterWithSecurities(this.selectTiltParamName).subscribe(result => {
                    if (result.code == 200) {
                        this.tiltParamSecurities = result.responsedata;
                        this.tiltingDetailGrid.refreshGrid(this.tiltParamSecurities);
                        this.tiltParamDetailsModal.open(this.selectTiltParamName);
                    } else {
                        console.log(result.message);
                    }
                }
            );
        }
    }

    openRankDetail() {
        if (this.rebalanceSettings.rankSetID != "") {
            this.workspaceService.getRankSetSecurities(this.rebalanceSettings.rankSetID).subscribe(result => {
                    if (result.code == 200) {
                        this.rankSecurities = result.responsedata;
                        this.rankDetailGrid.refreshGrid(this.rankSecurities);
                        this.rankDetailsModal.open(this.rebalanceSettings.rankSetID);
                    } else {
                        console.log(result.message);
                    }
                }
            );
        }
    }

    closeRankDetails() {
        this.rankDetailsModal.close();
    }

    closeTiltParamDetails() {
        this.tiltParamDetailsModal.close();
    }

    openEquivalenceBuilder() {
        this.equivlenceBuilder.setDBBuyRules(this.rebalanceSettings.equivalenceBuySplitRules);
        this.equivlenceBuilder.setDBSellRules(this.rebalanceSettings.equivalenceSellSplitRules);
        this.equivlenceBuilder.saveEquivalence();
        this.addEquivalenceModalRef.open();
    }

    equivalenceClose() {
        this.addEquivalenceModalRef.close();
        this.rebalanceSettings.equivalenceBuySplitRules = this.equivlenceBuilder.getDBBuyRules();
        this.rebalanceSettings.equivalenceSellSplitRules = this.equivlenceBuilder.getDBSellRules();
    }

    closeReblanceNameTemplateWarningModal() {
        this.rebalanceNameTemplateWarningModal.close();
    }

    getSelectedSubModels() {
        return this.modelSleeveDropDown.elementRef.nativeElement.innerText;
    }


    saveRebalanceRounding() {

        if (this.securityTypesList) {
            for (let type of this.securityTypesList) {
                if (type.roundNearestUnit == "Do not round") {
                    type.roundNearestUnit = 0;
                }
            }
            this.urebalService.post("RebalanceWS/saveSecurityTypeByRebalanceName?rebalanceName=" + this.rebalanceSettings.rebalanceName, this.securityTypesList)
                .subscribe(result => {
                    if (result.code == 200) {
                        this.securityTypesList = result.responsedata;
                    } else {
                        this.errMessage = "Failed to save security type rounding information";
                    }
                });
        }
    }

    saveRebalanceSettings() {

        UILoader.blockUI.start('Saving Settings'); // Start blocking
        this.isSaveProgress = true;
        let rebalanceList = [];
        rebalanceList.push(this.rebalanceSettings.rebalanceId);
        this.rebalanceSettings.rebalanceIdsList = rebalanceList;

        this.rebalanceSettings.rebalanceType = this.selectedType.id;

        this.rebalanceSettings.subModel = this.subModelList.toString();

        if (this.rebalanceSettings.roundNearestUnit == "Do not round") {
            this.rebalanceSettings.roundNearestUnit = 0;
        }
        this.saveTiltingParameter();
        if (this.rebalanceSettings.isSecurityTypeRounding) {

            if (!this.securityTypesList) {

                this.securityTypesList = null;

                let params = {
                    workflowId: this.rebalanceSettings.rebalanceId,
                    modelName: this.rebalanceSettings.model.name,
                    accountIds: this.accountIds
                };

                this.urebalService.post("RebalanceWS/getSecuritiesType", params)
                    .subscribe(result => {
                        if (result.code == 200) {
                            this.securityTypesList = result.responsedata;
                            for (let type of this.securityTypesList) {
                                if (type.roundNearestUnit == "Do not round") {
                                    type.roundNearestUnit = 0;
                                }
                            }

                            this.rebalanceSettings.rebalanceSecTypeRounding = this.securityTypesList;
                            this.savePreparedRebalanceSettings();
                        }
                    });
            } else {

                for (let type of this.securityTypesList) {
                    if (type.roundNearestUnit == "Do not round") {
                        type.roundNearestUnit = 0;
                    }
                }
                this.rebalanceSettings.rebalanceSecTypeRounding = this.securityTypesList;
                this.savePreparedRebalanceSettings();
            }


        } else {
            this.savePreparedRebalanceSettings();
        }


    }

    savePreparedRebalanceSettings() {
        this.workspaceService.saveRebalanceSettings(this.rebalanceSettings)
            .subscribe(result => {
                //this.blockUI.stop();
                UILoader.blockUI.stop();
                console.log(result);
                if (result.code == 200) {
                    this.closeDrawer(() => {
                        this.isSaveProgress = false;
                    });
                    this.errMessage = "";

                } else if (result.code == 400) {
                    this.errMessage = "Bad Request.";

                } else {
                    this.isSaveProgress = false;
                    this.errMessage = result.message;
                    console.error(result.message);
                }
            });
    }


    saveTiltingParameter() {
        if (!this.rebalanceSettings.isObjFunction)
            return;

        this.workspaceService.saveTiltingParameter(this.tiltParameters).subscribe(result => {
            console.log(result);
            if (result.code == 200) {

            } else {
                console.error(result.message);
            }
        });
    }

    closeDrawer(callback = () => {
    }) {
        this.saveTemplateError = "";
        this.saveTemplateName = "";
        this.saveTemplateSuccess = "";
        this.rebalanceTemplateLoaded = false;
        this.rebalanceSettings = null;
        this.selectedModel = undefined;
        this.cachedTemplateSecurityTypesList = null;
        this.onClose.emit(this.rebalanceTemplateList);
    }


    openSecurityTypeRoundingModal() {

        this.cachedRebalanceSecurityTypesList = this.securityTypesList;
        this.securityTypeRoundingModal.open(this.portfolioName);
    }

    getSecurityTypeRoundingValuesForRebalance() {

        let params = {
            workflowId: this.rebalanceSettings.rebalanceId,
            modelName: this.rebalanceSettings.model.name,
            accountIds: this.accountIds
        };

        this.urebalService.post("RebalanceWS/getSecuritiesType", params)
            .subscribe(result => {
                if (result.code == 200) {
                    this.securityTypesList = result.responsedata;
                    for (let type of this.securityTypesList) {
                        if (type.roundNearestUnit == 0) {
                            type.roundNearestUnit = "Do not round";
                        }
                    }
                    this.cachedRebalanceSecurityTypesList = this.securityTypesList;
                }
            });
    }

    getSecurityTypeRoundingValuesForCreateTemplate() {
        let params = {templateId: null}
        this.urebalService.post("RebalanceWS/getSecurityTypesByTemplateId", params)
            .subscribe(result => {
                if (result.code == 200) {
                    this.templateSecurityTypesList = result.responsedata;
                    for (let type of this.templateSecurityTypesList) {
                        if (type.roundNearestUnit == 0) {
                            type.roundNearestUnit = "Do not round";
                        }
                    }

                } else {
                    //display error message here
                }
            });
    }

    openSecurityTypeRoundingModalForCreateTemplate() {

        this.cachedTemplateSecurityTypesList = this.templateSecurityTypesList.valueOf();
        this.templateSecurityTypeRoundingModal.open("template" + this.portfolioName);

    }

    saveTemplateSecurityRounding() {

        this.templateSecurityTypeRoundingModal.close();
    }

    saveSecurityBasedModal() {

        this.securityTypeRoundingModal.close();
    }

    closeSecurityBasedModal() {

        this.securityTypesList = this.cachedRebalanceSecurityTypesList;
        this.cachedRebalanceSecurityTypesList = '';
        this.securityTypeRoundingModal.close();
    }

    removeTiltParameter(index) {
        this.deleteTiltParam = true;
        if (index >= 0) {
            this.tiltParameters[index].parameter = null;
        }
    }

    /**
     * Equivalence breakdown rules code
     * will be moved to a separate component
     */

    /*openEquivalenceBreakDownRules() {
      this.equivalenceBreakDownModal.open();
    }*/


    /**
     * CTG input value validation
     */
    validateCTG(event: any) {
        let value = event.target.value;
        if (value < 0 || value > 100) {
            event.target.value = '';
            this.rebalanceSettings.cashToGenerate = null;
            //(<HTMLInputElement>event.target).value = '';
            return;
        }

    }

    openAccountDetailModal(tabSelected: string) {
        this.accountSettingsModal.open();
        this.accountSettings.initializeModalMode(this.portfolioId, this.isHousehold);
        this.accountSettings.openTab(tabSelected);
    }

    closeAccountDetailModal($event) {
        //this.addModalRef.close();
        // this.closeModal(this.rebModalId);
        this.accountSettingsModal.close();
    }

    openModal(id) {
        let instance = this.accountDetailsModal.toArray().find(modal => modal.id == id);
        if (instance) {
            instance.open();
        }
    }

    closeModal(id) {
        let instance = this.accountDetailsModal.toArray().find(modal => modal.id == id);
        if (instance) {
            instance.close();
        }
    }

    closeTemplateSecurityLevelRoundingModal() {
        this.templateSecurityTypeRoundingModal.close()
    }


    getRebalanceTemplateList(callback = () => {
    }) {
        this.workspaceService.getRebalanceTemplateList().subscribe(
            result => {
                if (result.code == 200) {
                    this.rebalanceTemplateList = result.responsedata;
                    if (this.rebalanceTemplateList && Array.isArray(this.rebalanceTemplateList)) {
                        this.rebalanceTemplateList.sort((a, b) => a.templateName.localeCompare(b.templateName));
                    }
                    for (let rebTemplate of this.rebalanceTemplateList) {
                        if (this.selectedTemplate && rebTemplate.templateName == this.selectedTemplate.templateName) {
                            this.selectedTemplate = rebTemplate;
                        }
                    }
                    if (this.templateDropDown) {
                        this.templateDropDown.refreshDropDown(this.rebalanceTemplateList);
                    }
                } else {
                    console.error(result.message);
                    if (this.templateDropDown) {
                        this.templateDropDown.refreshDropDown();
                    }
                }

                callback();
            },
            err => {
                console.error(err);
            });
    }

    modelOnChange(event) {
        this.assignModel(event);
    }

    assignModel(event?) {
        const selectedItem = this.modelComboxBox.getSelectedItem();
        if (selectedItem) {
            this.selectedModel = selectedItem.originalItem;

            this.disableApplyModelAttribute = false;

            this.rebalanceSettings.model.name = this.selectedModel.modelName;
            this.rebalanceSettings.model.id = this.selectedModel.modelId;
            this.rebalanceSettings.model.modelType = this.selectedModel.modelTypeNum;

            this.errorMessage = "";

            if (this.rebalanceSettings.model.modelType != 1) {
                this.getModelDetails();
            } else {
                this.disableApplyModelAttribute = true;
                if (this.rebalanceSettings.rebalanceType == 4 || this.rebalanceSettings.rebalanceType == 5) {
                    this.rebalanceSettings.rebalanceType = 0;
                    this.selectedType = this.options[0];
                }
                this.options[4].disabled = true;
                this.options[5].disabled = true;
            }
        } else {
            this.unassignModel();
        }
    }

    unassignModel() {
        this.rebalanceSettings.model.name = "";
        this.rebalanceSettings.model.id = null;
        this.rebalanceSettings.model.modelType = null;

        this.errorMessage = "No model is assigned";

        this.selectedModel = undefined;
        this.modelComboxBox.selectedIndex(-1);
        this.modelComboxBox.clearSelection();
    }

    haveModelPermission(modelId, modelTypeNum) {
        let modelTypePermission = modelTypePermissions.find((m) => m.modelType == modelTypeNum);
        return modelTypePermission && this.urebalPermissions.isAllowed(modelTypePermission.permissionName);
    }
}
