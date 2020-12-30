import {Component, ViewChild} from '@angular/core';
import {DataImportService} from '../data-imports/data-import.service';
import {MapFieldsComponent} from "./map-fields/map-fields.component";
import {ReviewFinishComponent} from "./review-finish/review-finish.component";
import {UploadFileComponent} from "./upload-file/upload-file.component";
import {URebalService} from "../../services/urebal.service";


@Component({
  selector: 'app-data-import',
  templateUrl: './data-import-account.component.html',
  styleUrls: ['./data-import-account.component.css']
})


export class DataImportAccountComponent {

  @ViewChild('mapFieldComp') mapFieldComp: MapFieldsComponent;
  @ViewChild('reviewFinishComp') reviewFinishComp: ReviewFinishComponent;
  @ViewChild('uploadFileComp') uploadFileComp: UploadFileComponent;


  public progressIndicationVal = 0;
  public uploadedFiles = [];
  public mappedData = [];
  public successData = [];
  public errorData = [];
  public warningData = [];


  constructor(public urebalService: URebalService, private service: DataImportService) { }

  progressIndicatorValue(value) {
    this.progressIndicationVal = value;
  }


  getUploadedFiles(value) {
    this.uploadedFiles = value;
  }

  getMappedData(value) {
    this.mappedData = value;

    for (let i =0;i<this.mappedData.length;i++) {
      let arr = [];
      let withoutUnderscoreFieldArr = [];
      let UnderscoreFieldArr = [];
      this.mappedData[i]["rules"] = [];
      this.mappedData[i]["mappedColumns"] = [];

      for (let j=0; j<this.mappedData[i].data.length; j++) {
        arr.push('');
        this.mappedData[i]["csvFields"] = arr;
        this.mappedData[i]["preview"] = arr;
        let x = this.mappedData[i].data[j].split(':');
        UnderscoreFieldArr.push(x[0]);
        withoutUnderscoreFieldArr.push(x[1]);
        this.mappedData[i]["urebalFields"] = withoutUnderscoreFieldArr;
        this.mappedData[i]["urebal_Fields"] = UnderscoreFieldArr;
      }
    }
  }

  getColumnStrs(columnsObj) {
    //columbObj contains the array of columnStrings extracted from the csv against each file.

    //this outer loops, loops through all the files.
    for (let i=0;i<this.mappedData.length;i++) {
      //this inner loops, loops through the array of columnstrings against each file.
      for(let j=0; j<columnsObj.length;j++) {
        // checks if the columnStrings extracted from csv matches the filetype? if so, attach it with the exact file object.
        if (this.mappedData[i].type == columnsObj[j].fileType) {
          let tempObj= {};
          for (let k=0;k<columnsObj[j].colStrings.length;k++) {
            tempObj['Column'+k] = columnsObj[j].colStrings[k];
          }
          this.mappedData[i]["cols"] = tempObj;
          break;
        }
      }
    }
  }

  getSuccessData(data) {
    this.successData = data;
  }

  getErrorData(data) {
    this.errorData = data;
  }

  getWarningData(data) {
    this.warningData = data;
  }

  openMapFieldAccordion() {
    this.mapFieldComp.accordionAnimate(0);
  }

  openReviewFinishAccordion() {
    this.reviewFinishComp.reviewFinishAccordionAnimate(0);
  }

  emptyMappedData() {
    this.uploadFileComp.mappedArray = [];
    this.uploadFileComp.strArr = [];
  }



  animateAccordion(accordionObj) {
    //timeout to give delay of .01 seconds so that it animates after the screen loads.
    setTimeout(() => {
    if ($('#'+accordionObj.id+accordionObj.index).hasClass('open')) {
      $('#'+accordionObj.id+accordionObj.index).removeClass('open');
      $('#'+accordionObj.divHeight_id+accordionObj.index).css('max-height',0 + 'px');
    }else {
      $('#'+accordionObj.id+accordionObj.index).addClass('open');
      $('#'+accordionObj.divHeight_id+accordionObj.index).css('max-height',accordionObj.max_height + 'px');
    }
    },100);
  }


}
