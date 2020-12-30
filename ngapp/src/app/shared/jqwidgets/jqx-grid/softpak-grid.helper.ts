export class SoftpakGridHelper{
    public static rearrangeGridColumns(gridColumns) {
        //let gridColumns = this.gridColumns;
        let totalColumns: number = gridColumns.length;
        let totalHiddenColumns: number = gridColumns.reduce((total, currentValue) => {
            if (currentValue.hidden) {
                return total + 1;
            }
            return total;
        }, 0);

        let hiddenColTotalWidth: number = gridColumns.reduce((total, currentValue) => {
            if (currentValue.hidden && currentValue.width) {
                return total + Number(currentValue.width.toString().replace('%', ''))
            }
            return total;
        }, 0);

        if (hiddenColTotalWidth > 0) {
            let columnWidth = hiddenColTotalWidth / (totalColumns - totalHiddenColumns);
            gridColumns.forEach((columnObj) => {
                if (columnObj.hidden == undefined || !columnObj.hidden) {
                    if(columnObj.width){
                        if(columnObj.width.toString().includes('%')){
                            columnObj.width = `${Number(columnObj.width.toString().replace('%', '')) + columnWidth}%`;
                        }
                        else{
                            columnObj.width = `${Number(columnObj.width.toString()) + columnWidth}`;
                        }
                    }
                }
            });
        }
    }

    public static mergeGridColumnProperties(originalGridColumnJSONArray: any[], gridColumnsJSONArray: any[]){
        originalGridColumnJSONArray.forEach((column, colIndex) =>
            Object.assign(column, gridColumnsJSONArray[colIndex] || {})
        );
    }
}