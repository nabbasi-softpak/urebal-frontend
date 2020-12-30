import {isDefined} from "@angular/compiler/src/util";
import {isUndefined} from "util";

const matcherColumn: jasmine.CustomMatcherFactories = {

  toEqualEachCellInColumn: (actual) => {
    return {
      compare: (columnLabel) => {
        if (isUndefined(columnLabel)) columnLabel = '';
        let result: jasmine.CustomMatcherResult = {
          pass: false,
          message: ''
        };

        var jqxColContentsDiv = this.getJqxWidgetColContentsDiv(columnLabel);
        jqxColContentsDiv.count().then(function (size) {
          for (var i = 0; i < size; i++) {
            var cellValue = jqxColContentsDiv.get(i).getText();
            cellValue.then(console.log);
            if (cellValue === actual) {
              result.pass = true;
              console.log(result.pass);

            }

          }
        });

        return result;
      }
    }
  }
};
export {matcherColumn};
