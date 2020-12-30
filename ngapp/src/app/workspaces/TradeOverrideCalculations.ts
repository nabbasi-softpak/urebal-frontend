import {TradeOverrideComponent} from "./tradeoverride/tradeoverride.component";
import {TradeSummary} from "../shared/classes/TradeSummary.class";
import {OutputTrades} from "../shared/classes/OutputTrades.class";
import {appConfig} from "../shared/util/config";

export class TradeOverrideCalculations {

    private _totalMarketValue: number;
    private _portfolio: any;
    private _sharesData: any = [];
    private _selectedAccount: string;
    private _errorMessage: string;
    private _cashTrades: any = [];

    constructor(private component: TradeOverrideComponent) {
    }


    get selectedAccount(): string {
        return this._selectedAccount;
    }

    set selectedAccount(value: string) {
        this._selectedAccount = value;
    }

    get portfolio(): any {
        return this._portfolio;
    }

    set portfolio(value: any) {
        this._portfolio = value;
    }

    get sharesData(): any {
        return this._sharesData;
    }

    set sharesData(value: any) {
        this._sharesData = value;
    }

    get totalMarketValue(): number {
        return this._totalMarketValue;
    }

    set totalMarketValue(value: number) {
        this._totalMarketValue = value;
    }

    get errorMessage(): string {
        return this._errorMessage;
    }

    get cashTrades(): any {
        return this._cashTrades;
    }

    set cashTrades(value: any) {
        this._cashTrades = value;
    }

    /**
     * This method check which input field has been edited by user and than calculate change in trade valued accordingly.
     *
     * If user has edited round optimal shares calculation will be done in this flow:
     *      -It calculates change in round optimal value using change in round optimal shares
     *      -Calculates change in round optimal pct wt using change in round optimal value
     *      -Calculates change in round trade pct wt using change in round optimal pct wt (they are always same)
     *      -Calculates change in round trade value using change in round trade pct wt
     *      -Calculates change in round trade shares using change in round trade value
     * If user has edited optimal pct wt calculation will be done in this flow:
     *      -First it calculates change in round optimal shares using optimal pct wt
     *      -Calculates change in round optimal value using change in round optimal shares
     *      -Calculates change in optimal pct wt again (rounded) using change in round optimal value (which is equal to change in trade pct wt)
     *      -Calculates change in round trade value using change in round trade pct wt
     *      -Calculates change in round trade shares using change in round trade value
     * If user has edited round trade shares calculation will be done in this flow:
     *      -Change in round optimal shares will be equal to change in round trade shares
     *      -Calculates change in round optimal value using change in round optimal shares
     *      -Calculates change in optimal pct wt again (rounded) using change in round optimal value (which is equal to change in trade pct wt)
     *      -Calculates change in round trade value using change in round trade pct wt
     * If user has edited round trade value calculation will be done in this flow:
     *      -First it calculates change in round trade shares using change in round trade value
     *      -Change in round optimal shares will be equal to change in round trade shares
     *      -Calculates change in round optimal value using change in round optimal shares
     *      -Calculates change in optimal pct wt again (rounded) using change in round optimal value (which is equal to change in trade pct wt)
     *      -Calculates change in round trade value again (for rounded value) using change in round trade pct wt
     *
     * In case of sell trade, it calculates round gain/loss and tax cost value as well
     *
     * @param inputField Edited column name
     * @param changeValue Newly entered value by user - old value of the column
     * @param rowData Full data of row
     * @returns {OutputTrades}
     */
    calculateTrades(inputField, changeValue, rowData): OutputTrades {

        let updatedOutputTrades: OutputTrades = new OutputTrades();

        if (inputField == "roundTradeValue") {
            updatedOutputTrades.roundTradeValue = changeValue;
            updatedOutputTrades = this.calculateRoundTradeShares(updatedOutputTrades, rowData);
            updatedOutputTrades.roundOptShares = updatedOutputTrades.roundTradeShares;

            updatedOutputTrades = this.calculateProposedValue(updatedOutputTrades, rowData);
            updatedOutputTrades = this.calculateProposedPercent(updatedOutputTrades, rowData);
            updatedOutputTrades = this.calculateTradeValue(updatedOutputTrades, rowData);
        } else if (inputField == "roundTradeShares") {
            updatedOutputTrades.roundTradeShares = changeValue;
            updatedOutputTrades.roundOptShares = changeValue;
            updatedOutputTrades = this.calculateProposedValue(updatedOutputTrades, rowData);
            updatedOutputTrades = this.calculateProposedPercent(updatedOutputTrades, rowData);
            updatedOutputTrades = this.calculateTradeValue(updatedOutputTrades, rowData);
        } else if (inputField == "cash") {
            updatedOutputTrades.roundTradeValue = changeValue;
            updatedOutputTrades = this.calculateTradeShares(inputField, updatedOutputTrades, rowData);
            updatedOutputTrades = this.calculateProposedValue(updatedOutputTrades, rowData);
            updatedOutputTrades = this.calculateProposedPercent(updatedOutputTrades, rowData);
        }

        if (rowData.action == "Sell") {
            updatedOutputTrades = this.calculateGainLoss(updatedOutputTrades, rowData);
        }

        return updatedOutputTrades;
    }

    /**
     * Calculates change in round optimal/proposed value using change in round optimal shares
     *
     * @param changeTrades
     * @param rowData
     * @returns {OutputTrades}
     */
    calculateProposedValue(changeTrades: OutputTrades, rowData): OutputTrades {

        changeTrades.roundOptValue = changeTrades.roundOptShares * rowData.price;

        return changeTrades;
    }

    /**
     * Calculates change in round trade shares using change in round trade value and than round the value to nearest value
     *
     * @param changeTrades
     * @param rowData
     * @returns {OutputTrades}
     */
    calculateRoundTradeShares(changeTrades: OutputTrades, rowData): OutputTrades {

        changeTrades.roundTradeShares = changeTrades.roundTradeValue / rowData.price;

        let roundedTradeShares = changeTrades.roundTradeShares;

        console.log("Rounded Trade Shares:" + roundedTradeShares);
        console.log("Rounded Trade Diff:" + (changeTrades.roundTradeShares - roundedTradeShares));

        changeTrades.roundTradeShares = roundedTradeShares;

        return changeTrades;
    }

    /**
     * Calculates change in round optimal/proposed pct weight using change in round optimal value
     * Change in Round trade pct weight is always equal to change in round optimal pct weight
     *
     * @param changeTrades
     * @param rowData
     * @returns {OutputTrades}
     */
    calculateProposedPercent(changeTrades: OutputTrades, rowData): OutputTrades {

        changeTrades.roundOptPctWt = parseFloat(((changeTrades.roundOptValue / this.totalMarketValue) * 100).toFixed(13));

        changeTrades.roundTradePercent = changeTrades.roundOptPctWt;

        return changeTrades;
    }

    /**
     * Calculates change in round trade value using change in round trade pct weight
     *
     * @param changeTrades
     * @param rowData
     * @returns {OutputTrades}
     */
    calculateTradeValue(changeTrades: OutputTrades, rowData): OutputTrades {

        changeTrades.roundTradeValue = (changeTrades.roundTradePercent / 100) * this.totalMarketValue;

        return changeTrades;
    }

    /**
     * Calculates change in round trade shares using change in round trade value
     * Change in Round optimal shares is always equal to change in round trade shares
     *
     * @param inputField
     * @param changeTrades
     * @param rowData
     * @returns {OutputTrades}
     */
    calculateTradeShares(inputField, changeTrades: OutputTrades, rowData): OutputTrades {

        if (inputField != "cash") {
            changeTrades.roundTradeShares = Math.round(changeTrades.roundTradeValue / rowData.price);
        } else {
            changeTrades.roundTradeShares = changeTrades.roundTradeValue / rowData.price;
        }

        if (inputField != "roundOptShares") {
            changeTrades.roundOptShares = changeTrades.roundTradeShares;
        }

        return changeTrades;
    }

    /**
     * Calculates change in gain/loss value using change in round trade shares and
     * than using gain/loss value calculates change in round tax cost value
     *
     * @param changeTrades
     * @param rowData
     * @returns {OutputTrades}
     */
    calculateGainLoss(changeTrades: OutputTrades, rowData): OutputTrades {
        changeTrades.roundGainLossValue = changeTrades.roundTradeShares * (rowData.price - rowData.basisPrice);

        changeTrades.roundTaxCostValue = changeTrades.roundGainLossValue * rowData.taxRate / 100;

        return changeTrades;
    }

    /**
     * This method is called by @see TradeOverrideComponent when user enters the edited value
     * and calls @see calculateTrades method to calculate changes for trade values
     *
     * @param gridData Contain details of all the changes in the grid like edited column name, new row data and old row data
     * @param dataField Edited column name (Round Optimal Shares/Round Optimal Pct Wt/Round Trade Value/Round Trade Shares)
     */
    editTrades(gridData, dataField) {
        //let changeValue = this.gridData.newRowData[dataField] - this.gridData.oldRowData[dataField];
        let changeValue = gridData.changeValue;
        const newRowData = gridData.rowData;

        //Whenever trade type is 'Zero Trade' of edited row it will always change to 'Sell' trade type
        if (newRowData.action == "Zero Trade") {
            newRowData.action = newRowData.shareLotId == '{BUY LOT}' ? 'Buy' : 'Sell';
        }

        if (this.portfolio.isHouseHold) {
            this.totalMarketValue = this.component.householdTradeSummary.sleeveMarketValue;
        } else {
            this.totalMarketValue = this.component.accountsTradeSummary[this.selectedAccount].sleeveMarketValue;
        }

        let outputTradesChange: OutputTrades = this.calculateTrades(dataField, changeValue, newRowData);
        let cashOutputTradesChange: OutputTrades = new OutputTrades;

        let lotCashRecord = null;

        //Iterate lots data and look for the edited row to update it according to the calculated changes
        for (let lotRecord of this.sharesData) {

            //Cash lot calculation and changes
            if (lotCashRecord == null && lotRecord.accountId == newRowData.accountId && lotRecord.ticker == appConfig.CASH) {
                cashOutputTradesChange = this.calculateTrades("cash", outputTradesChange.roundTradeValue, lotRecord);

                if (newRowData.action == "Buy") {
                    lotRecord.roundOptShares -= cashOutputTradesChange.roundOptShares;
                    lotRecord.roundOptValue -= cashOutputTradesChange.roundOptValue;
                    lotRecord.roundOptPctWt -= cashOutputTradesChange.roundOptPctWt;
                } else {
                    lotRecord.roundOptShares += cashOutputTradesChange.roundOptShares;
                    lotRecord.roundOptValue += cashOutputTradesChange.roundOptValue;
                    lotRecord.roundOptPctWt += cashOutputTradesChange.roundOptPctWt;
                }

                lotRecord.roundTradeShares = Math.abs(lotRecord.roundOptShares - lotRecord.initShares);
                lotRecord.roundTradeValue = Math.abs(lotRecord.roundOptValue - lotRecord.initValue);
                lotRecord.roundTradePercent = Math.abs(lotRecord.roundOptPctWt - lotRecord.initPercent);
                this.cashTrades[lotRecord.accountId] = lotRecord;
            }

            //Checks for edited row
            if (lotRecord.accountId == newRowData.accountId && lotRecord.shareLotId == newRowData.shareLotId && lotRecord.ticker == newRowData.ticker) {
                lotRecord.edited = true;
                lotRecord.action = newRowData.action;

                /*
                -In case of 'Buy' trade, trade values and optimal values are directly proportional to each other
                so if trade increases, optimal values will also increase

                -In case of 'Sell' trade, trade values and optimal values are inversely proportional to each other
                 so if trade increases, optimal values will decrease and vice versa
                */

                if (lotRecord.action == "Buy") {
                    lotRecord.roundTradeShares += outputTradesChange.roundTradeShares;
                    lotRecord.roundTradeValue += outputTradesChange.roundTradeValue;

                    lotRecord.roundOptPctWt += outputTradesChange.roundOptPctWt;
                    lotRecord.roundOptShares += outputTradesChange.roundOptShares;

                    lotRecord.roundTradePercent += outputTradesChange.roundTradePercent;
                    lotRecord.roundOptValue += outputTradesChange.roundOptValue;

                } else if (lotRecord.action == "Sell") {
                    lotRecord.roundTradeShares += outputTradesChange.roundTradeShares;
                    lotRecord.roundTradeValue += outputTradesChange.roundTradeValue;

                    lotRecord.roundOptPctWt -= outputTradesChange.roundOptPctWt;
                    lotRecord.roundOptShares -= outputTradesChange.roundOptShares;

                    lotRecord.roundTradePercent += outputTradesChange.roundTradePercent;
                    lotRecord.roundOptValue -= outputTradesChange.roundOptValue;

                    lotRecord.roundTaxCostValue += outputTradesChange.roundTaxCostValue;
                    lotRecord.roundGainLossValue += outputTradesChange.roundGainLossValue;
                }

                //If the final trade value is zero, change the trade type to 'Zero Trade'
                if (lotRecord.roundTradeShares == 0 || lotRecord.roundTradeValue == 0) {
                    lotRecord.action = "Zero Trade";
                }

                this.modelRestrictionsValidations(lotRecord, this.sharesData);
                break;
            }
        }

        return this.sharesData;
    }

    loadTradeSummaryData(accountId){
        let tradeSummary : TradeSummary = new TradeSummary();

        let tickers = [];

        tradeSummary.availableCash = this.cashTrades[accountId].roundOptValue;
        tradeSummary.cashBeforeRebalance = this.cashTrades[accountId].initValue;

        for (let shareLot of this.sharesData) {
            if (tickers.indexOf(shareLot.ticker) < 0) {
                tickers.push(shareLot.ticker);
            }

            if (shareLot.ticker == appConfig.CASH && accountId == shareLot.accountId) {
                tradeSummary.sleeveMarketValue += shareLot.initValue;
            } else if (accountId == shareLot.accountId) {
                tradeSummary.sleeveMarketValue += shareLot.initValue;
            }
        }

        tradeSummary.numberOfSecurities = tickers.length;

        this.component.currentTradeSummary = tradeSummary;
    }

    calculateTradeSummary() {
        this.component.accountsTradeSummary = [];
        this.component.householdTradeSummary = new TradeSummary();

        let householdTrades: TradeSummary = new TradeSummary();
        for (let account of this.portfolio.accounts) {
            let accountTradeSummary: TradeSummary = new TradeSummary();
            accountTradeSummary = this.calculateIndividualAccountTradeSummary(account);
            this.component.accountsTradeSummary[account.id] = accountTradeSummary;

            if (this.portfolio.isHouseHold) {
                householdTrades.sleeveMarketValue += accountTradeSummary.sleeveMarketValue;
                householdTrades.numberOfSecurities += accountTradeSummary.numberOfSecurities;
                householdTrades.availableCash += accountTradeSummary.availableCash;
                householdTrades.cashBeforeRebalance += accountTradeSummary.cashBeforeRebalance;
                householdTrades.realizedGainLoss += accountTradeSummary.realizedGainLoss;
                householdTrades.realizedStGainLoss += accountTradeSummary.realizedStGainLoss;
                householdTrades.realizedLtGainLoss += accountTradeSummary.realizedLtGainLoss;
                householdTrades.taxCost += accountTradeSummary.taxCost;
                householdTrades.ytdRealizedGainLoss += accountTradeSummary.ytdRealizedGainLoss;

                if (householdTrades.ytdRealizedLtGainLoss != null) {
                    householdTrades.ytdRealizedStGainLoss += accountTradeSummary.ytdRealizedStGainLoss;
                    householdTrades.ytdRealizedLtGainLoss += accountTradeSummary.ytdRealizedLtGainLoss;
                }

                householdTrades.ytdTaxCost += accountTradeSummary.ytdTaxCost;

                this.component.householdTradeSummary = householdTrades;
            }
        }

        if (this.selectedAccount == "HOUSEHOLD") {
            this.component.currentTradeSummary = householdTrades;
        } else {
            this.component.currentTradeSummary = this.component.accountsTradeSummary[this.selectedAccount];
        }
    }

    calculateIndividualAccountTradeSummary(account?): TradeSummary {
        let tradeSummary: TradeSummary = new TradeSummary();
        let longTermGainLoss = 0;
        let shortTermGainLoss = 0;
        let realizedGainLoss = 0;
        let netTaxCostValue = 0;
        let tickers = [];

        if(this.cashTrades[account.id] !== undefined){
          tradeSummary.availableCash = this.cashTrades[account.id].roundOptValue;
          tradeSummary.cashBeforeRebalance = this.cashTrades[account.id].initValue;
        } else {
          tradeSummary.availableCash = 0;
          tradeSummary.cashBeforeRebalance = 0;
        }

        for (let shareLot of this.sharesData) {
            if (tickers.indexOf(shareLot.ticker) < 0) {
                tickers.push(shareLot.ticker);
            }

            if (shareLot.ticker == appConfig.CASH && account.id == shareLot.accountId) {
                tradeSummary.sleeveMarketValue += shareLot.initValue;
            } else if (account.id == shareLot.accountId) {
                tradeSummary.sleeveMarketValue += shareLot.initValue;

                if (TradeOverrideCalculations.isLongTerm(shareLot.purchaseDate)) {
                    longTermGainLoss += shareLot.roundGainLossValue;
                } else {
                    shortTermGainLoss += shareLot.roundGainLossValue;
                }
                realizedGainLoss += shareLot.roundGainLossValue;
                netTaxCostValue += shareLot.roundTaxCostValue;
            }
        }

        tradeSummary.numberOfSecurities = tickers.length;
        tradeSummary.realizedGainLoss = realizedGainLoss;
        tradeSummary.taxCost = netTaxCostValue;
        tradeSummary.realizedStGainLoss = shortTermGainLoss;
        tradeSummary.realizedLtGainLoss = longTermGainLoss;

        if (account.isMcgSlSeparation) {
            tradeSummary.ytdRealizedGainLoss = realizedGainLoss + account.ytdLtGainLoss + account.ytdStGainLoss;
            tradeSummary.ytdRealizedLtGainLoss = longTermGainLoss + account.ytdLtGainLoss;
            tradeSummary.ytdRealizedStGainLoss = shortTermGainLoss + account.ytdStGainLoss;
        } else {
            tradeSummary.ytdRealizedGainLoss = realizedGainLoss + account.ytdNetGainLoss;
            tradeSummary.ytdRealizedLtGainLoss = null;
            tradeSummary.ytdRealizedStGainLoss = null;
        }

        // YTD Net Tax Cost Calculation
        let ytdNetTaxCost = 0;
        let totalGainLoss = tradeSummary.ytdRealizedLtGainLoss + tradeSummary.ytdRealizedStGainLoss;

        if (tradeSummary.ytdRealizedLtGainLoss == null && tradeSummary.ytdRealizedStGainLoss == null && tradeSummary.ytdRealizedGainLoss > 0) {
            ytdNetTaxCost = account.ltTaxRate * tradeSummary.ytdRealizedGainLoss;
        } else if (tradeSummary.ytdRealizedLtGainLoss > 0 && tradeSummary.ytdRealizedStGainLoss > 0) {
            ytdNetTaxCost = (tradeSummary.ytdRealizedStGainLoss * account.stTaxRate) + (tradeSummary.ytdRealizedLtGainLoss * account.ltTaxRate);
        } else if (tradeSummary.ytdRealizedLtGainLoss < 0 && tradeSummary.ytdRealizedStGainLoss < 0) {
            ytdNetTaxCost = 0;
        } else if (tradeSummary.ytdRealizedStGainLoss < 0 && totalGainLoss > 0) {
            ytdNetTaxCost = totalGainLoss * account.ltTaxRate;
        } else if (tradeSummary.ytdRealizedLtGainLoss < 0 && totalGainLoss > 0) {
            ytdNetTaxCost = totalGainLoss * account.stTaxRate;
        }

        tradeSummary.ytdTaxCost = ytdNetTaxCost / 100;

        return tradeSummary;
    }

    modelRestrictionsValidations(lotRecord, lotData) {
        const accountTicker = lotRecord.ticker;
        const securityLots = lotData.filter((item) => item.ticker == accountTicker);

        let adjustedMin = securityLots[0].adjustedMinPct;
        let adjustedMax = securityLots[0].adjustedMaxPct;
        let roundProposed = 0;

        for (let lot of securityLots) {
            roundProposed += parseFloat(lot.roundOptPctWt);
        }

        let warningMessage = '';
        if (roundProposed < adjustedMin) {
            warningMessage = `Given lot value violates adjusted min for ${lotRecord.ticker} security`;
        } else if (roundProposed > adjustedMax) {
            warningMessage = `Given lot value violates adjusted max for ${lotRecord.ticker} security`;
        }

        // Set warning for all lot of given security
        lotData.forEach((item) => {
            if (item.ticker == lotRecord.ticker) {
                item.warningMessage = warningMessage;
            }
        });
    }

    static isLongTerm(date): boolean {
        const milliSecondsInDay = 1000 * 60 * 60 * 24;
        let systemDate = new Date();
        let purchaseDate = new Date(date);
        let timeDiff = systemDate.getTime() - purchaseDate.getTime();
        let daysDiff = Math.floor(timeDiff / milliSecondsInDay);

        // let isLeapYear = new Date(systemDate.getFullYear(), 1, 29).getDate() === 29;
        // return (isLeapYear && daysDiff > 366) || daysDiff > 365;

        return daysDiff > 366;
    }
}
