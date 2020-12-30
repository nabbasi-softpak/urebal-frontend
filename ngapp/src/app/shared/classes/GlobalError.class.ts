export class GlobalErrorClass{
  static errorMessage: string = 'Unknown error occurred';
  static setToDefault(){
    GlobalErrorClass.errorMessage = 'Unknown error occurred';
  }
}

export class AccountListErrors
{
   static readonly AccountLoadingDataError = `Some error(s) occurred while loading Account List data`;
   static readonly InitializeFiltersError = `Some error(s) occurred while initializing filter(s)`;
   static readonly ApplyingFiltersError = `Some error(s) occurred while applying filter(s)`;
   static readonly RunDriftError = `Some error(s) occurred while trying to run drift`;
   static readonly AccountUnLoadingScreenError = `Some error(s) occurred while unloading Account List screen`;
}

export class ModelErrors
{
  static readonly LoadingGridDataError = `Error loading data for Model: {0}.`;
  static readonly LoadingChartDataError = `Error loading chart data for Model: {0}.`
}
