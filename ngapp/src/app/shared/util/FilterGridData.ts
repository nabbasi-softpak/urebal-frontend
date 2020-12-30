export class FilterGridData {
  private gridRealData : any[];
  private gridFilteredData : any[];
  private dataColumns : any[];
  private isDebug : boolean;

  constructor(dataColumns: any[],gridRealData : any[],isDebug?:boolean) {
    this.dataColumns = dataColumns;
    this.gridRealData = gridRealData;
    this.isDebug = isDebug;
  }

  filter(searchString : string) {
    this.gridFilteredData = [];
    if (searchString.trim()) {
      return this.filterData(searchString.trim().toUpperCase())
    }else{
      return this.gridRealData;
    }
  }

  private filterData(searchString : string){
    if(this.gridRealData != undefined){
      for(let row of this.gridRealData){
        for (let ifNull in row){
          if (row[ifNull] == null) {
            row[ifNull] = "";
          }
        }
        for(let column of this.dataColumns){
          if(column.type === 'int'){
            if(row[column.name] == parseInt(searchString)){
              this.gridFilteredData.push(row);
            }
          }else if(column.type === 'float'){
            if(row[column.name] == parseFloat(searchString)){
              this.gridFilteredData.push(row);
            }
          } else if(typeof((row[column.name])) === "string" && (row[column.name]).toUpperCase().indexOf(searchString) != -1){
            this.gridFilteredData.push(row);
            break;
          }
        }
      }

      if(this.isDebug){
        if(this.gridFilteredData.length > 0){
          console.log(this.gridFilteredData);
        }else{
          console.log('No data found at given search value');
        }
      }
    }

    return this.gridFilteredData;
  }
}
