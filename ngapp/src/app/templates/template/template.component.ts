import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TemplateService} from "../template.service";
import {UILoader} from "../../shared/util/UILoader";
import {
    BREAK_DOWN_RULES_EMPTY,
    directionArray,
    DO_NOT_ROUND,
    EQUIV_BREAKDOWN_RULES_SPLIT_DELIMITER,
    EquivalenceBreakdownRules,
    equivBuyRules,
    equivSellRules,
    ERROR_MSG_ENTER_TEMPLATE_NAME,
    ERROR_MSG_NO_MODEL_SELECTED,
    ERROR_MSG_SAVING_SEC_TYPE_ROUNDING_FAILED,
    ERROR_MSG_SECURITY_MODEL_SELECTED,
    ERROR_MSG_TEMPLATE_NAME_ALREADY_EXIST,
    ERROR_MSG_TEMPLATE_RETRIEVAL_FAILED,
    getModelType,
    getTemplateTabs,
    ModelMeta,
    ModelType,
    rankSetSecuritiesGridColumns,
    rankSetSecuritiesGridDataColumns,
    REBALANCE_SETTINGS_RETRIEVAL_FAILED,
    RebalanceRuleOption,
    rebalanceRuleOptions,
    RebalanceSettings,
    roundDirections,
    roundLotSizeOptions,
    sellLotOrderingStrategies,
    SUCCESS_MSG_TEMPLATE_SAVED,
    taxSortingStrategies,
    TEMPLATE_SECURITY_TYPE_ROUNDING_RETRIEVAL_FAILED,
    TemplateSecurityTypeRounding,
    TemplateTab,
    TemplateTabs,
    transformRebSettingsResponse
} from "./template.datasource";
import {PermissionResolverService, UrebalPermissions} from "../../services/permission-resolver.service";
import {AppConfig} from "../../../app.config";
import {forkJoin, Observable} from "rxjs";
import {concatMap, map} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
import {URebalUtil} from "../../shared/util/URebalUtil";
import {WorkspaceService} from "../../workspaces/workspace.service";
import {RebalanceTemplateObject} from "../../shared/classes/RebalanceTemplate";
import {UrebalDropdownComponent} from "../../shared/components/urebal-dropdown/urebal-dropdown.component";
import {SoftpakDropdownComponent} from "../../shared/jqwidgets/jqx-dropdown/softpak-dropdown.component";
import {ModalComponent} from "../../shared/components/modal/modal.component";
import {SoftpakComboBoxComponent} from "../../shared/jqwidgets/jqx-combobox/softpak-combobox.component";
import {ModelService} from "../../model/model.service";
import {AccountService} from "../../account/account.service";
import {UrebalGridComponent} from "../../shared/components/urebal-grid/urebal-grid.component";


@Component({
    selector: 'app-template',
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateComponent extends UrebalPermissions implements OnInit, OnDestroy {

    public isEdit: boolean = false;
    public returnUrl: string = "/secure/templates/list";

    @ViewChild(UrebalDropdownComponent) templateDropDown: UrebalDropdownComponent;
    @ViewChild('modelSleeveDropDownRef') modelSleeveDropDown: SoftpakDropdownComponent;
    @ViewChild('modelComboxBoxRef', {static: true}) modelComboxBox: SoftpakComboBoxComponent;

    @ViewChild("rankDetailModalGrid") rankDetailModalGrid: UrebalGridComponent;

    @ViewChild('templateEditConfirmationMsgModal') templateEditConfirmationMsgModal: ModalComponent;
    @ViewChild('rebalanceWithinModelSleeveModalRef') rebWithinModalSleeveModal: ModalComponent;
    @ViewChild('templateSaveMsgModal') templateSaveMsgModal: ModalComponent;
    @ViewChild('rankDetailsModal') rankDetailsModal: ModalComponent;

    public templateId: number = null;
    public templateName: string;
    public templateErrorMsg: string = "";
    public templateSuccessMsg: string = "";
    public templateNameList: string[] = []; // TODO: Retrieve template names instead of full templates to show in dropdown
    public rebalanceSettings: RebalanceSettings;
    public templateSecurityTypesList: any[];
    public rebalanceTemplateList: RebalanceTemplateObject[] = [];
    public selectedTemplate: RebalanceTemplateObject = null;
    public modelList: ModelMeta[] = [];
    public templateSuccessModalMsg: string;

    public errMessage: string;
    public disableApplyModelAttribute: boolean = false;

    public templateTabs: TemplateTab[] = getTemplateTabs(this.isAllowed.bind(this));
    public activeTemplateTabId: string = TemplateTabs.REBALANCE_SETTINGS;

    public rebalanceRuleOptions: RebalanceRuleOption[] = rebalanceRuleOptions;
    public selectedRebalanceRule: RebalanceRuleOption;
    public harvestGainDollar: number;
    public harvestLossDollar: number;
    public inputValidationErr: boolean = false;

    // Equivalence Breakdown Rules
    public defaultEquivBreakdownBuyRules: EquivalenceBreakdownRules = {};
    public defaultEquivBreakdownSellRules: EquivalenceBreakdownRules = {};

    public equivBreakdownBuyRules: EquivalenceBreakdownRules = {};
    public equivBreakdownSellRules: EquivalenceBreakdownRules = {};

    // Rebalance Within Model Sleeve Modal
    public rebWithinModelSleeveErrorMsg: string;
    public modelSleeves: any[] = [];

    // Objective Function Rebalancing
    public securityRankingList: string[] = [];
    public tiltParameterList: any[] = [];

    public rankSecurities: any[];

    // To make these props accessible in templates
    public roundLotSizeOptions = roundLotSizeOptions;
    public directionArray = directionArray;
    public roundDirections = roundDirections;

    public sellLotOrderingStrategies = sellLotOrderingStrategies;
    public taxSortingStrategies = taxSortingStrategies;

    public REBALANCE_SETTINGS_TAB = TemplateTabs.REBALANCE_SETTINGS;
    public GENERAL_SETTINGS_TAB = TemplateTabs.GENERAL_SETTINGS;
    public TAX_SETTINGS_TAB = TemplateTabs.TAX_SETTINGS;

    public equivBuyRules = equivBuyRules;
    public equivSellRules = equivSellRules;

    get rankSetSecuritiesGridDataColumns(): string {
        return JSON.stringify(rankSetSecuritiesGridDataColumns);
    }

    get rankSetSecuritiesGridColumns(): string {
        return JSON.stringify(rankSetSecuritiesGridColumns);
    }

    public AppConfig = AppConfig;

    constructor(
        private templateService: TemplateService,
        permissionResolverService: PermissionResolverService,
        private workspaceService: WorkspaceService,
        private modelService: ModelService,
        private accountService: AccountService,
        private router: Router,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef
    ) {
        super(permissionResolverService);

        //Hiding Advanced Rebalance Options for Blueleaf Phase I build
        for (let item of this.rebalanceRuleOptions) {
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

        // Setup Equivalence Breakdown Rules
        for (let equivBuyRule of equivBuyRules) {
            if (equivBuyRule.id !== "-1")
                this.equivBreakdownBuyRules[equivBuyRule.id] = "-1";
        }

        for (let equivSellRule of equivSellRules) {
            if (equivSellRule.id !== "-1")
                this.equivBreakdownSellRules[equivSellRule.id] = "-1";
        }
    }

    ngOnInit(): void {
        const routeParams = this.route.snapshot.params;

        if (routeParams.templateId) {
            this.isEdit = true;
            this.templateId = routeParams.templateId;
        } else {
            this.isEdit = false;
        }

        if (routeParams.returnUrl) {
            this.returnUrl = routeParams.returnUrl;
        }

        this.initiateRequests();
    }

    initiateRequests() {
        let requests = [];

        // Default Rebalance Settings Request
        if (!this.isEdit) {
            requests.push(this.loadDefaultRebalanceSettings().pipe(
                concatMap(rebalanceSettings => {
                    if (rebalanceSettings) {
                        const rebRuleIndex = this.rebalanceRuleOptions.findIndex(option =>
                            option.id === rebalanceSettings.rebalanceType
                        );
                        this.selectedRebalanceRule = this.rebalanceRuleOptions[rebRuleIndex];
                        this.rebalanceSettings = rebalanceSettings;
                        this.templateId = rebalanceSettings.templateId;

                        // Initialize equivalence breakdown rules
                        const equivalenceBreakdownRules = this.getEquivBreakdownRules(rebalanceSettings.equivalenceBuySplitRules, rebalanceSettings.equivalenceSellSplitRules);
                        this.equivBreakdownBuyRules = equivalenceBreakdownRules.buyRules;
                        this.equivBreakdownSellRules = equivalenceBreakdownRules.sellRules;

                        this.setDefaultEquivalenceBreakdownRules(
                            equivalenceBreakdownRules.buyRules,
                            equivalenceBreakdownRules.sellRules
                        );

                    } else {
                        this.errMessage = REBALANCE_SETTINGS_RETRIEVAL_FAILED;
                    }

                    return this.getSecurityTypeRoundingValues(this.templateId).pipe(
                        map(templateSecurityTypesList => {
                            if (templateSecurityTypesList) {
                                this.templateSecurityTypesList = templateSecurityTypesList;
                            } else {
                                this.errMessage = TEMPLATE_SECURITY_TYPE_ROUNDING_RETRIEVAL_FAILED;
                            }

                            return templateSecurityTypesList;
                        })
                    );
                }))
            );
        } else {
            // To Initialize Default Breakdown Rules
            // Default Rebalance Settings Request
            requests.push(this.loadDefaultRebalanceSettings().pipe(
                map(rebalanceSettings => {
                    if (rebalanceSettings) {
                        const equivalenceBreakdownRules = this.getEquivBreakdownRules(rebalanceSettings.equivalenceBuySplitRules, rebalanceSettings.equivalenceSellSplitRules);
                        this.setDefaultEquivalenceBreakdownRules(
                            equivalenceBreakdownRules.buyRules,
                            equivalenceBreakdownRules.sellRules
                        );
                    }

                    return rebalanceSettings;
                })
            ));

            requests.push(this.getTemplateById(this.templateId).pipe(map(
                templateRebalanceSettings => {
                    if (templateRebalanceSettings) {
                        const rebRuleIndex = this.rebalanceRuleOptions.findIndex(option =>
                            option.id === templateRebalanceSettings.rebalanceType
                        );

                        this.templateName = templateRebalanceSettings.templateName;
                        this.selectedRebalanceRule = this.rebalanceRuleOptions[rebRuleIndex];
                        this.rebalanceSettings = templateRebalanceSettings;

                        // Initialize equivalence breakdown rules
                        const equivalenceBreakdownRules = this.getEquivBreakdownRules(
                            templateRebalanceSettings.equivalenceBuySplitRules,
                            templateRebalanceSettings.equivalenceSellSplitRules
                        );
                        this.equivBreakdownBuyRules = equivalenceBreakdownRules.buyRules;
                        this.equivBreakdownSellRules = equivalenceBreakdownRules.sellRules;

                    } else {
                        this.errMessage = ERROR_MSG_TEMPLATE_RETRIEVAL_FAILED;
                    }
                }
            )));

            // Security Type Roundings Request
            requests.push(this.getSecurityTypeRoundingValues(this.templateId).pipe(
                map(templateSecurityTypesList => {
                    if (templateSecurityTypesList) {
                        this.templateSecurityTypesList = templateSecurityTypesList;
                    } else {
                        this.errMessage = TEMPLATE_SECURITY_TYPE_ROUNDING_RETRIEVAL_FAILED;
                    }

                    return templateSecurityTypesList;
                })
            ));
        }

        // Template List Request
        requests.push(this.getRebalanceTemplateList().pipe(
            map(rebalanceTemplateList => {
                if (rebalanceTemplateList) {
                    this.rebalanceTemplateList = rebalanceTemplateList;
                    const selectedTemplate = this.rebalanceTemplateList
                                                .find(template =>
                                                    this.selectedTemplate &&
                                                    template.templateName === this.selectedTemplate.templateName
                                                );

                    if (selectedTemplate)
                        this.selectedTemplate = selectedTemplate;

                    if (this.templateDropDown) {
                        this.templateDropDown.refreshDropDown(this.rebalanceTemplateList);
                    }
                }
            })
        ));

        // Models Request
        if (this.isAllowed('workspaceRebalanceTypeSettings')) {
            requests.push(this.getModelsList().pipe(
                map(modelList => {
                    if (modelList) {
                        this.modelList = modelList;
                        this.modelComboxBox.source(modelList);
                    }
                })
            ));
        }

        // Objective Function Rebalancing related Requests
        if (this.isAllowed('workspaceObjectiveFunctionRebalancing')) {
            // Security Ranking List Request
            requests.push(this.getSecurityRankingList().pipe(map(
                securityRankingList => {
                    if (securityRankingList) {
                        this.securityRankingList = securityRankingList;
                    }
                }
            )));

            // Tilt Parameter List Request
            requests.push(this.getTiltParameterList().pipe(map(
                tiltParameterList => {
                    if (tiltParameterList) {
                        this.tiltParameterList = tiltParameterList;
                    }
                }
            )));
        }

        UILoader.blockUI.start("Loading Template...");
        forkJoin(requests).subscribe(() => {
        }, (error) => {
            console.log("Error:", error);

            UILoader.blockUI.stop();
            this.cd.detectChanges();
        }, () => {
            UILoader.blockUI.stop();
            this.cd.detectChanges();
        })
    }

    loadDefaultRebalanceSettings() : Observable<RebalanceSettings | undefined> {
        return this.templateService.getDefaultRebalanceSettings().pipe(
            map(response => {
                if (response.code === 200) {
                    return transformRebSettingsResponse(response.responsedata);
                }

                return undefined;
            })
        );
    }

    getTemplateById(templateId: number): Observable<RebalanceSettings | undefined> {
        return this.templateService.getTemplateById(templateId).pipe(map(
            response => {
                if (response.code == 200) {
                    return transformRebSettingsResponse(response.responsedata);
                }

                return undefined;
            }
        ));
    }

    getSecurityTypeRoundingValues(templateId: Number) : Observable<any | undefined> {
        return this.templateService.getSecurityTypesForTemplate(templateId).pipe(
            map(response => {
                if (response.code === 200) {
                    const templateSecurityTypesList = response.responsedata;
                    let templateSecTypeRoundingList: TemplateSecurityTypeRounding[] = [];

                    for (let type of templateSecurityTypesList) {
                        if (type.roundNearestUnit === 0) {
                            type.roundNearestUnit = DO_NOT_ROUND;
                        }

                        templateSecTypeRoundingList.push({
                            templateId: type.templateId,
                            templateName: type.templateName,
                            roundBuyDirection: type.roundBuyDirection,
                            roundSellDirection: type.roundSellDirection,
                            roundNearestUnit: type.roundNearestUnit,
                            securityType: type.securityType
                        });
                    }

                    return templateSecTypeRoundingList;
                }

                return undefined;
            })
        );
    }

    getRebalanceTemplateList(): Observable<any | undefined> {
        return this.workspaceService.getRebalanceTemplateList().pipe(
            map(response => {
                if (response.code == 200) {
                    let rebalanceTemplateList = response.responsedata;

                    if (rebalanceTemplateList && Array.isArray(rebalanceTemplateList)) {
                        rebalanceTemplateList.sort((a, b) => a.templateName.localeCompare(b.templateName));
                    }

                    return rebalanceTemplateList;
                }

                return undefined;
            })
        );
    }

    getModelsList(): Observable<ModelMeta[] | undefined> {
        return this.templateService.getModelsList().pipe(
            map(response => {
                if (response.code == 200) {
                    let modelList: ModelMeta[] = [];
                    const retrievedModelList = response.responsedata;

                    for (let retrievedModel of retrievedModelList) {
                        modelList.push({
                            id: retrievedModel.modelId,
                            name: retrievedModel.modelName,
                            modelTypeNum: retrievedModel.modelTypeNum,
                        });
                    }

                    if (modelList && Array.isArray(modelList)) {
                        modelList.sort((modelA,modelB) => modelA.name.localeCompare(modelB.name));
                    }

                    return modelList;
                }

                return undefined;
            })
        );
    }

    getModelSleeveList(modelId: number): Observable<any | undefined> {
        return this.modelService.getModelElements(modelId).pipe(
            map(response => {
                if (response.code == 200) {
                    return response.responsedata;
                }

                return undefined;
            })
        );
    }

    getSecurityRankingList(): Observable<any | undefined>  {
        return this.accountService.getSecurityRankingList().pipe(
            map(response => {
                if (response.code == 200) {
                    return response.responsedata;
                }

                return undefined;
            })
        );
    }

    getTiltParameterList(): Observable<any | undefined>  {
        return this.workspaceService.getTiltParameterList().pipe(
            map(response => {
                if (response.code == 200) {
                    return response.responsedata;
                }

                return undefined;
            })
        );
    }

    getRankSetSecurities(rankSetId: string): Observable<any[] | undefined> {
        return this.workspaceService.getRankSetSecurities(rankSetId).pipe(
            map(response => {
                if (response.code == 200) {
                    return response.responsedata;
                }

                return undefined;
            })
        );
    }

    loadRebalanceTemplate() {
        this.templateErrorMsg = "";
        this.templateSuccessMsg = "";

        if (this.selectedTemplate) {
            this.rebalanceSettings.lotOrder = this.selectedTemplate.lotOrder;
            this.selectedRebalanceRule = this.rebalanceRuleOptions[this.selectedTemplate.rebalanceType > 6 ? this.selectedTemplate.rebalanceType - 1 : this.selectedTemplate.rebalanceType];
            this.rebalanceSettings.roundSellDirection = this.selectedTemplate.roundSellDirection;
            this.rebalanceSettings.roundBuyDirection = this.selectedTemplate.roundBuyDirection;

            if (this.selectedTemplate.roundNearestUnit == 0) {
                this.rebalanceSettings.roundNearestUnit = "Do not round";
            } else {
                this.rebalanceSettings.roundNearestUnit = String(this.selectedTemplate.roundNearestUnit);
            }
            this.rebalanceSettings.isSecurityTypeRounding = this.selectedTemplate.isSecurityTypeRounding;
            this.rebalanceSettings.isWashsalesApply = this.selectedTemplate.isWashsaleApply;
            this.rebalanceSettings.isEquivalenceApply = this.selectedTemplate.isEquivalenceApply;
            this.rebalanceSettings.isEquivalenceBuyRulesApply = this.selectedTemplate.isEquivalenceBuyRulesApply ? this.selectedTemplate.isEquivalenceBuyRulesApply : false;
            this.rebalanceSettings.isEquivalenceSellRulesApply = this.selectedTemplate.isEquivalenceSellRulesApply ? this.selectedTemplate.isEquivalenceSellRulesApply : false;

            this.rebalanceSettings.isRestrictionApply = this.selectedTemplate.isRestrictionApply;
            this.rebalanceSettings.isModelAttributesApply = this.selectedTemplate.isModelAttributesApply;
            this.rebalanceSettings.cashToGenerate = this.selectedTemplate.cashToGenerate;
            this.rebalanceSettings.minTradeSize = this.selectedTemplate.minTradeSize;

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
            this.rebalanceSettings.model = this.selectedTemplate.model;
            this.rebalanceSettings.subModel = this.selectedTemplate.subModel;

            const selectedRebalanceType = this.selectedTemplate.rebalanceType;

            if (selectedRebalanceType > 6 && selectedRebalanceType < 9) {
                if (selectedRebalanceType == 7) {
                    this.harvestGainDollar = this.selectedTemplate.gainLossToHarvest;
                } else if (selectedRebalanceType == 8) {
                    this.harvestLossDollar = this.selectedTemplate.gainLossToHarvest;
                }
            }

            const equivalenceBreakdownRules = this.getEquivBreakdownRules(
                this.selectedTemplate.equivalenceBuySplitRules,
                this.selectedTemplate.equivalenceSellSplitRules
            );
            this.equivBreakdownBuyRules = equivalenceBreakdownRules.buyRules;
            this.equivBreakdownSellRules = equivalenceBreakdownRules.sellRules;

            this.changeRebalanceType();

            UILoader.blockUI.start("Loading Template...");
            this.getSecurityTypeRoundingValues(this.selectedTemplate.templateId).subscribe(
                (templateSecTypeRoundingList: TemplateSecurityTypeRounding[]) => {
                    if (templateSecTypeRoundingList) {
                        this.templateSecurityTypesList = templateSecTypeRoundingList;
                        return;
                    }

                    this.errMessage = TEMPLATE_SECURITY_TYPE_ROUNDING_RETRIEVAL_FAILED;
                },
                (err) => {
                    console.log(err);
                    UILoader.blockUI.stop();
                    this.cd.detectChanges();
                }, () => {
                    UILoader.blockUI.stop();
                    this.cd.detectChanges();
                }
            )
        }
    }

    _saveTemplate() {
        if (!this.validateTemplate()) {
            return;
        }

        this.templateErrorMsg = "";

        if (!this.validateEquivalences()) {
            return;
        }

        this.errMessage = "";

        this.updateRebSettingsBreakdownRules();

        // Skip Name Checking when editing template
        if (this.isEdit) {
            this.templateEditConfirmationMsgModal.open();
            return;
        }

        UILoader.blockUI.start("Saving Template...");
        this.workspaceService.getRebalanceTemplateByName(encodeURIComponent(this.templateName.trim()))
            .subscribe(response => {
                    if (response.code == 0) {
                        this.saveTemplate();
                    } else {
                        this.templateErrorMsg = ERROR_MSG_TEMPLATE_NAME_ALREADY_EXIST;
                    }
                },
                (err) => {
                    console.log(err);
                    UILoader.blockUI.stop()
                    this.cd.detectChanges();
                }, () => {
                    UILoader.blockUI.stop();
                    this.cd.detectChanges();
                }
            );
    }

    saveTemplate() {
        let rebalanceTemplate: RebalanceTemplateObject = new RebalanceTemplateObject();

        rebalanceTemplate.templateName = this.templateName.trim();
        rebalanceTemplate.asOfDate = new Date;
        rebalanceTemplate.modificationDate = new Date;
        rebalanceTemplate.rebalanceType = this.selectedRebalanceRule.id;
        rebalanceTemplate.lotOrder = this.rebalanceSettings.lotOrder;
        rebalanceTemplate.roundSellDirection = this.rebalanceSettings.roundSellDirection;
        rebalanceTemplate.roundBuyDirection = this.rebalanceSettings.roundBuyDirection;

        if (this.rebalanceSettings.roundNearestUnit == DO_NOT_ROUND) {
            rebalanceTemplate.roundNearestUnit = 0;
        } else {
            rebalanceTemplate.roundNearestUnit = +this.rebalanceSettings.roundNearestUnit;
        }

        rebalanceTemplate.isSecurityTypeRounding = this.rebalanceSettings.isSecurityTypeRounding;
        rebalanceTemplate.isWashsaleApply = this.rebalanceSettings.isWashsalesApply;
        rebalanceTemplate.isEquivalenceApply = this.rebalanceSettings.isEquivalenceApply;
        rebalanceTemplate.isEquivalenceBuyRulesApply = this.rebalanceSettings.isEquivalenceBuyRulesApply;
        rebalanceTemplate.isEquivalenceSellRulesApply = this.rebalanceSettings.isEquivalenceSellRulesApply;
        rebalanceTemplate.isRestrictionApply = this.rebalanceSettings.isRestrictionApply;
        rebalanceTemplate.isModelAttributesApply = this.rebalanceSettings.isModelAttributesApply;
        rebalanceTemplate.cashToGenerate = this.rebalanceSettings.cashToGenerate;
        rebalanceTemplate.minTradeSize = this.rebalanceSettings.minTradeSize;

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

        let model = null;

        if (this.rebalanceSettings.model) {
            model = {
                id: this.rebalanceSettings.model.id
            };
        }

      // Deep copying security type roundings list
      let securityTypesList = this.templateSecurityTypesList.map(
        (securityTypeRounding) => ({...securityTypeRounding}));

      for (let type of securityTypesList) {
        if (type.roundNearestUnit == DO_NOT_ROUND) {
          type.roundNearestUnit = 0;
        }
      }


      rebalanceTemplate.model = model;
        rebalanceTemplate.subModel = this.rebalanceSettings.subModel;
        rebalanceTemplate.templateSecTypeRounding=securityTypesList;

        UILoader.blockUI.start("Saving Template...");
        this.templateService.saveTemplate(rebalanceTemplate, this.isEdit).subscribe(response => {
            if (response.code !== 200) {
                UILoader.blockUI.stop();
                this.templateErrorMsg = response.message;
                this.cd.detectChanges();
                return;
            }

          this.onSaveTemplateComplete();


        }, (err) => {
            console.log(err);
            UILoader.blockUI.stop();
            this.cd.detectChanges();
        }
          , () => {
            UILoader.blockUI.stop();
            this.cd.detectChanges();
        });
    }

    getEquivBreakdownRules(equivalenceBuySplitRules: string, equivalenceSellSplitRules: string) {
        const retrievedEquivBuyRuleIds: string[] = equivalenceBuySplitRules.split(EQUIV_BREAKDOWN_RULES_SPLIT_DELIMITER);
        const retrievedEquivSellRuleIds: string[] = equivalenceSellSplitRules.split(EQUIV_BREAKDOWN_RULES_SPLIT_DELIMITER);

        const eqBuySplitRulesObject: EquivalenceBreakdownRules = {};
        const eqSellSplitRulesObject: EquivalenceBreakdownRules = {};

        for (let equivBuyRule of equivBuyRules) {
            if (equivBuyRule.id !== "-1")
                eqBuySplitRulesObject[equivBuyRule.id] = "-1";
        }

        for (let equivSellRule of equivSellRules) {
            if (equivSellRule.id !== "-1")
                eqSellSplitRulesObject[equivSellRule.id] = "-1";
        }

        for (let ruleIndex=0; ruleIndex < retrievedEquivBuyRuleIds.length; ruleIndex++) {
            const equivBuyRuleId = retrievedEquivBuyRuleIds[ruleIndex];
            const actualEquivBuyRule = equivBuyRules.find(rule => rule.id !== "-1" && rule.id === equivBuyRuleId);

            if (actualEquivBuyRule) {
                eqBuySplitRulesObject[String(ruleIndex)] = equivBuyRuleId;
            }
        }

        for (let ruleIndex=0; ruleIndex < retrievedEquivSellRuleIds.length; ruleIndex++) {
            const equivSellRuleId = retrievedEquivSellRuleIds[ruleIndex];
            const actualEquivSellRule = equivSellRules.find(rule => rule.id !== "-1" && rule.id === equivSellRuleId);

            if (actualEquivSellRule) {
                eqSellSplitRulesObject[String(ruleIndex)] = equivSellRuleId;
            }
        }

        return {
            buyRules: {...eqBuySplitRulesObject},
            sellRules: {...eqSellSplitRulesObject},
        };
    }

    setDefaultEquivalenceBreakdownRules(buyRules: any, sellRules: any) {
        this.defaultEquivBreakdownBuyRules = {...buyRules};
        this.defaultEquivBreakdownSellRules = {...sellRules};
    }

    updateRebSettingsBreakdownRules() {
        const equivalenceBreakdownBuyRules = this.rebalanceSettings.isEquivalenceBuyRulesApply ?
            this.equivBreakdownBuyRules : this.defaultEquivBreakdownBuyRules;

        const equivalenceBreakdownSellRules = this.rebalanceSettings.isEquivalenceSellRulesApply ?
            this.equivBreakdownSellRules : this.defaultEquivBreakdownSellRules;

        let appliedEquivalenceBreakdownBuyRules = [];
        let appliedEquivalenceBreakdownSellRules = [];

        for (const key of this.getObjectKeys(equivalenceBreakdownBuyRules)) {
            const ruleId = equivalenceBreakdownBuyRules[key];
            if (ruleId !== "-1")
                appliedEquivalenceBreakdownBuyRules.push(ruleId);
        }

        for (const key of this.getObjectKeys(equivalenceBreakdownSellRules)) {
            const ruleId = equivalenceBreakdownSellRules[key];
            if (ruleId !== "-1")
                appliedEquivalenceBreakdownSellRules.push(ruleId);
        }

        this.rebalanceSettings.equivalenceBuySplitRules = appliedEquivalenceBreakdownBuyRules.join(EQUIV_BREAKDOWN_RULES_SPLIT_DELIMITER);
        this.rebalanceSettings.equivalenceSellSplitRules = appliedEquivalenceBreakdownSellRules.join(EQUIV_BREAKDOWN_RULES_SPLIT_DELIMITER);
    }

    validateTemplate(): boolean {
        if (!this.templateName || this.templateName.trim() == "") {
            this.templateErrorMsg = ERROR_MSG_ENTER_TEMPLATE_NAME;
            return false;
        }

        return true;
    }

    validateEquivalences(): boolean {
        if (!this.rebalanceSettings.isEquivalenceApply) {
            return true;
        }

        if (this.rebalanceSettings.isEquivalenceBuyRulesApply) {
            // If no rule/"-" is applied to all available buy rules
            if (this.isNoEquivBreakdownRuleApplied(this.equivBreakdownBuyRules, this.equivBuyRules.length - 1)) {
                this.errMessage = BREAK_DOWN_RULES_EMPTY;
                return false;
            }
        }

        if (this.rebalanceSettings.isEquivalenceSellRulesApply) {
            // If no rule/"-" is applied to all available sell rules
            if (this.isNoEquivBreakdownRuleApplied(this.equivBreakdownSellRules, this.equivSellRules.length - 1)) {
                this.errMessage = BREAK_DOWN_RULES_EMPTY;
                return false;
            }
        }

        return true;
    }

    onSaveTemplateComplete() {
        this.templateSuccessModalMsg = SUCCESS_MSG_TEMPLATE_SAVED;
        this.templateSaveMsgModal.open();
        this.cd.detectChanges();
    }

    isNoEquivBreakdownRuleApplied(breakdownRulesObject, totalRulesCount: number): boolean {
        let noRuleAppliedCount = 0;

        for (const ruleId of this.getObjectKeys(breakdownRulesObject)) {
            if (breakdownRulesObject[ruleId] === "-1") {
                noRuleAppliedCount += 1;
            }
        }

        return noRuleAppliedCount == totalRulesCount;
    }

    changeTemplateTab(selectedTemplateTabId: string) {
        this.activeTemplateTabId = selectedTemplateTabId;

        // Add Margin to Security Level Rounding Settings Header,
        // if a scroll-bar is present in its body
        if (this.activeTemplateTabId == this.GENERAL_SETTINGS_TAB) {
            setTimeout(() => {
                const secLvlRoundingSettingsBody = $("#security-level-roundings-settings-body");
                const totalScrollableHeight = secLvlRoundingSettingsBody.prop("scrollHeight");
                const visibleHeight = secLvlRoundingSettingsBody.height();

                if (totalScrollableHeight > visibleHeight) {
                    $("#security-level-roundings-settings-head").css("padding-right", 16);
                }
            }, 0);
        }
    }

    changeRebalanceType() {
        this.inputValidationErr = false;
        switch (this.selectedRebalanceRule.id) {
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
        this.inputValidationErr = true;

        if (this.rebalanceSettings.cashToGenerate > 0) {
            this.inputValidationErr = false;
        }
    }

    equivRuleChanged(type: string, selectedRuleIndex: string, value: string) {
        if (type === 'Buy') {
            this.equivBreakdownBuyRules[selectedRuleIndex] = value;

            for (const key of Object.keys(this.equivBreakdownBuyRules)) {
                const keyValue = this.equivBreakdownBuyRules[key];

                if (key !== selectedRuleIndex && keyValue === value) {
                    this.equivBreakdownBuyRules[key] = "-1";
                }
            }
        } else {
            this.equivBreakdownSellRules[selectedRuleIndex] = value;

            for (const key of Object.keys(this.equivBreakdownSellRules)) {
                const keyValue = this.equivBreakdownSellRules[key];

                if (key !== selectedRuleIndex && keyValue === value) {
                    this.equivBreakdownSellRules[key] = "-1";
                }
            }
        }
    }

    onTemplateSaveMsgModalOkButtonClicked() {
        this.templateSaveMsgModal.close();
        this.router.navigate([this.returnUrl]).then();
    }

    onCancelClicked() {
        this.router.navigate([this.returnUrl]).then();
    }

    /* Template Edit Confirmation Modal - Start */
    onBtnYesClicked_templateEditConfirmationMsgModal() {
        this.templateEditConfirmationMsgModal.close();
        this.saveTemplate();
    }

    onBtnNoClicked_templateEditConfirmationMsgModal() {
        this.templateEditConfirmationMsgModal.close();
    }
    /* Template Edit Confirmation Modal - End */

    /* Rebalance Within Model Sleeve Modal - Start */
    initializeModelSleeves(model: any, subModel: string) {
        this.modelComboxBox.selectedIndex(-1);

        if (!model) {
            return;
        }

        const {name: modelName} = model;
        this.modelComboxBox.selectedIndex(this.modelList.findIndex(model => model.name === modelName));
    }

    openRebalanceWithinModelSleeveModal() {
        this.initializeModelSleeves(this.rebalanceSettings.model, this.rebalanceSettings.subModel);
        this.rebWithinModalSleeveModal.open();
    }

    onModelChanged() {
        const selectedModel = this.modelComboxBox.getSelectedItem();

        if (selectedModel) {
            this.modelSelected(selectedModel.originalItem);
        } else {
            this.modelRemoved();
        }
    }

    modelSelected(selectedModel: any) {
        const modelType: ModelType = getModelType(selectedModel.modelTypeNum);

        if (modelType == ModelType.ASSET_ALLOCATION_MODEL || modelType == ModelType.COMPOSITE_MODEL) {
            this.rebWithinModelSleeveErrorMsg = "";
            this.modelSleeveDropDown.disabled(false);

            const {id, name} = selectedModel;

            UILoader.blockUI.start("Loading Sleeves...");
            this.loadSleeves(id, name, this.rebalanceSettings.subModel?.split(",") || []).subscribe(modelSleeves => {
                if (modelSleeves) {
                    this.modelSleeves = modelSleeves;
                    this.modelSleeveDropDown.source(this.modelSleeves);

                    this.modelSleeveDropDown.getItems().forEach(item => {
                        if (item.checked) {
                            this.modelSleeveDropDown.checkItem(item);
                        }
                    });
                }
            }, (error) => {
                console.log(error);
                UILoader.blockUI.stop();
                this.cd.detectChanges();
            }, () => {
                UILoader.blockUI.stop();
                this.cd.detectChanges();
            });
        } else {
            this.rebWithinModelSleeveErrorMsg = ERROR_MSG_SECURITY_MODEL_SELECTED;
            this.modelSleeveDropDown.uncheckAll();
            this.modelSleeveDropDown.disabled(true);
            this.cd.detectChanges();
        }
    }

    loadSleeves(modelId: number, modelName: string, selectedSleeveIds: string[]): Observable<any | undefined> {
        return this.getModelSleeveList(modelId).pipe(
            map(modelsList => {
                const modelSleeves = [];

                if (modelsList) {
                    for (const model of modelsList) {
                        if (model.ratio == 0) {
                            continue;
                        }

                        const sleeve = {
                            id: model.sleeve.id,
                            name: model.sleeve.name.split("_" + modelName)[0],
                            ratio: model.ratio,
                            checked: selectedSleeveIds.includes(model.sleeve.id.toString())
                        };

                        modelSleeves.push(sleeve);
                    }

                    return modelSleeves;
                }

                return undefined;
            })
        );
    }

    modelRemoved() {
        this.modelComboxBox.selectedIndex(-1);
        this.modelComboxBox.clearSelection();
        this.modelSleeveDropDown.disabled(true);

        this.rebWithinModelSleeveErrorMsg = ERROR_MSG_NO_MODEL_SELECTED;
    }

    onBtnSaveClicked_rebWithinModalSleeveModal() {
        const selectedModelItem = this.modelComboxBox.getSelectedItem();

        if (selectedModelItem) {
            this.rebalanceSettings.model = selectedModelItem.originalItem;
        } else {
            this.rebalanceSettings.model = null;
        }

        const checkedSleeves = this.modelSleeveDropDown.getCheckedItems().map((checkedItem: any) => {
            if (checkedItem.originalItem) {
                return checkedItem.originalItem.id;
            }
        });

        this.rebalanceSettings.subModel = checkedSleeves.join(",");
        this.rebWithinModalSleeveModal.close();
    }

    onBtnCancelClicked_rebWithinModalSleeveModal() {
        this.rebWithinModalSleeveModal.close();
    }
    /* Rebalance Within Model Sleeve Modal - End */

    /* Rank Detail Modal - Start */
    openRankDetailModal() {
        if (this.rebalanceSettings.rankSetID != "") {
            UILoader.blockUI.start("Loading Rank Set Securities...");
            this.getRankSetSecurities(this.rebalanceSettings.rankSetID).subscribe(rankSetSecurities => {
                if (rankSetSecurities) {
                    this.rankSecurities = rankSetSecurities;
                    this.rankDetailModalGrid.refreshGrid(this.rankSecurities);
                    this.rankDetailsModal.open(this.rebalanceSettings.rankSetID);
                }
            }, (error) => {
                console.log(error);
                UILoader.blockUI.stop();
                this.cd.detectChanges();
            }, () => {
                UILoader.blockUI.stop();
                this.cd.detectChanges();
            });
        }
    }

    closeRankDetailModal() {
        this.rankDetailsModal.close();
    }
    /* Rank Detail Modal - End */

    getObjectKeys(object) {
        return URebalUtil.getObjectKeys(object);
    }

    ngOnDestroy(): void {
        this.templateName = "";
        this.rebalanceSettings = undefined;
    }
}
