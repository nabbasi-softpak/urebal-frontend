import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import { DataImportAccountService } from '../../data-import-account-service';
import {UILoader} from '../../../shared/util/UILoader';
import {URebalService} from "../../../services/urebal.service";


@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent  {

  @Output() btnsArray = new EventEmitter();
  @Output() progressIndicator = new EventEmitter();
  @Output() uploadedFilesArray = new EventEmitter();
  @Output() mappedData = new EventEmitter();
  @Output() columnStrings = new EventEmitter();
  @Output() openAccordion = new EventEmitter();


  private fileObject: any;
  private header = false;
  private dateFormat: string;
  public filesArray = [];
  private rowsInFilesArray = [];
  private fileTypeObj = {"Account":"ACCOUNTS", "Holdings":"HOLDINGS", "Restrictions":"RESTRICTIONS", "Washsales":"WASHSALES"};
  private tempArr = [];
  private fileType: string;
  public errMsg: string;
  private goNext = false;
  mappedArray = [];
  strArr = [];

  @ViewChild('fileUploaderInput') fileUploaderInput: any;
  constructor(public urebalService: URebalService, protected dataImportService: DataImportAccountService) {
  }


  nextBtnPressed() {

    this.setDateFormatForEachFile();
    this.fileValidation();

    if (this.goNext) {
      UILoader.blockUI.start("");

      let files = [];
      let typeArr = [];

      if(!this.isHeaderRowValid())
      {
        return;
      }

      for (let i=0; i<this.filesArray.length; i++) {
        let type = this.filesArray[i].fileType;
        let data = [];
        let vals = [];

        this.extractDataFromCSV(this.filesArray[i].file, type);

        files.push(this.filesArray[i].file);
        typeArr.push({"type":type, "fileName":this.filesArray[i].fileName});
        this.getMappingOfFiles(type,data,vals,i,files,typeArr);
      }
    }

  }

  fileValidation() {
    if (this.filesArray.length != 0) {
      //looping through the number of files uploaded.
      for (let i=0;i<this.filesArray.length;i++) {
        //looping within the current file object, reading out the key to check if filetype/dateformat is undefined, if so, throw an error.
        for (let key in this.filesArray[i]) {
          if (typeof this.filesArray[i][key] == "undefined") {
            this.errMsg = "Please provide the necessary details to continue.";
            this.goNext = false;
            break;
          }else if (!this.containsMandatoryFilesValidation()) {
            this.errMsg = "Account and Holdings files are mandatory.";
            this.goNext = false;
            break;
          }
          else {
            this.errMsg = "";
            this.goNext = true;
          }
        }
      }
    }else {
      this.goNext = false;
      this.errMsg = "You need to upload the file first to continue."
    }
  }

  containsMandatoryFilesValidation() {
    if (this.filesArray.find(file => file.fileType == 'ACCOUNTS')) {
      if (this.filesArray.find(file => file.fileType == 'HOLDINGS')) {
        return true;
      }
    }
    return false;
  }

  getMappingOfFiles(type,data,vals,index,files,typeArr) {
    this.dataImportService.getMapping(type).subscribe(result => {
      for (let j=0; j<result.responsedata.length;j++) {
        for (let key in result.responsedata[j]) {
          data.push(key);
          let temp = result.responsedata[j][key].split(':');
          vals.push(temp[0]);
        }
      }

      this.mappedArray[index] = {
        "type" : type,
        "data" : data,
        "colVals" : vals,
        "filetype" : this.filesArray[index].fileName,
        "containsHeader" : this.filesArray[index].containsHeader,
        "dateFormat" : this.dateFormat,//this.filesArray[index].dateFormat,
        "fileName" : this.filesArray[index].fileName
      };

      if (this.mappedArray.length == this.filesArray.length) {
        this.dataImportService.uploadFile(files,typeArr).subscribe(result => {
          UILoader.blockUI.stop();

          if (result.code === 400) {
            this.errMsg = result.message;
            return;
          }

          if (result.code == 200) {
            this.errMsg = '';
            this.progressIndicator.emit(33);
            this.uploadedFilesArray.emit(this.filesArray);
            this.mappedData.emit(this.mappedArray);
            this.columnStrings.emit(this.strArr);
            this.openAccordion.emit();

            $('#uploadFiles').addClass('slds-hide');
            $('#mapFields').removeClass('slds-hide');
            $('#mapNext').removeClass('slds-hide');
            $('#mapFieldStep').addClass('active');
          }
        });
      }
    });
  }

  private isHeaderRowValid() : boolean
  {
    for (let i=0; i<this.filesArray.length; i++) {
      if (this.filesArray[i].containsHeader === true && this.rowsInFilesArray[i] === 1) {
        this.errMsg = "File [" + this.filesArray[i].fileName + "] only has header row. Please either deselect \"File contains header\" checkbox or upload file with header and data.";
        UILoader.blockUI.stop();
        return false;
      }
    }

    return true;
  }

  private CheckEmptyFile(file) : boolean
  {
    UILoader.blockUI.start('Validating file...');

    let isFileEmpty : boolean = false;
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      let allTextLines = (<string>reader.result).split(/\r\n|\n/);
      let lines = [];
      for (let i=0; i<allTextLines.length; i++) {
        let data = allTextLines[i].split(',');
        let tarr = [];
        for (let j=0; j<data.length; j++) {
          data[j] = data[j].trim();
          if(data[j] !== '')
          {
            tarr.push(data[j]);
          }
        }
        if(tarr.length > 0)
        {
          lines.push(tarr);
        }
      }


      if(reader.readyState === reader.DONE)
      {
        if(lines && lines.length <= 0)
        {
          let index = this.filesArray.indexOf(file);
          this.filesArray.splice(index,1);

          this.errMsg = "Selected file for upload is not valid/empty!";
        }
        else
        {
          this.rowsInFilesArray.push(lines.length);
          this.errMsg = '';
        }
        UILoader.blockUI.stop();
        console.log(this.rowsInFilesArray.length);
      }
    };

    return isFileEmpty;
  }


  private extractDataFromCSV(file,fileType) {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      let csvData = reader.result;
      let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
      let tempStrArr = [];

      tempStrArr.push(csvRecordsArray[0].match(/(".*?"|[^",]+)(?=,|$)/g));

      for(let i = 0; i< tempStrArr[0].length; i++)
      {
        tempStrArr[0][i] = tempStrArr[0][i].replace(/"/g, '');
      }

        for (let i = 0; i< tempStrArr[0].length; i++) {
          if (tempStrArr[0][i] == "") {
            tempStrArr[0].splice(i, 1);
            i--;
          }
        }
        let obj = {"colStrings" : tempStrArr[0],
                  "fileType" : fileType
        };
      this.strArr.push(obj);
    }
  }

  upload(fileInput:any) {


    for (let i =0; i<fileInput.target.files.length; i++) {
      let file = fileInput.target.files[i];
      if (file && (file.name.endsWith(".csv") || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel')) {
        this.CheckEmptyFile(file);
        this.fileObject = {
          "fileName" : file.name,
          "file" : file,
          "fileType" : this.fileType,
          "dateFormat" : this.dateFormat,
          "containsHeader" : this.header
        };
        if (this.filesArray.findIndex(addedFile => addedFile.fileName == file.name) < 0) {
            this.filesArray.push(this.fileObject);
        }
      }else {
        this.errMsg = "Not a valid csv file."
      }
    }
  }

  onChangeFileType(filetype,file) {
    let index = this.filesArray.indexOf(file);
    this.tempArr[index] = filetype.value;
    this.filesArray[index].fileType = filetype.value;
  }

  onChangeDateFormat(dateFormat) {
    this.dateFormat = dateFormat.value;
  }

  setDateFormatForEachFile() {
    for (let i=0; i<this.filesArray.length; i++) {
      this.filesArray[i].dateFormat = this.dateFormat;
    }
  }

  onChangeFileHeader(fileHeader,file) {
    let index = this.filesArray.indexOf(file);
    this.filesArray[index].containsHeader = fileHeader.checked;
  }

  removeUploadedFile(file) {
    this.fileUploaderInput.nativeElement.value = '';
    let index = this.filesArray.indexOf(file);
    this.filesArray.splice(index,1);
    this.rowsInFilesArray.splice(index,1);
    this.tempArr.splice(index,1);
    this.mappedArray.splice(index,1);
    this.strArr.splice(index,1);

    this.errMsg = '';
  }

}
