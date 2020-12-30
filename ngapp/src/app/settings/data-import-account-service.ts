import { Injectable } from '@angular/core';
import { URebalService } from '../services/urebal.service';
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "angular-2-local-storage";

@Injectable()
export class DataImportAccountService extends URebalService{

  constructor(http: HttpClient, localStorage: LocalStorageService) {
    super(http, localStorage);
  }

  uploadFile(files,fileType) {
    const formData = new FormData();
    for (var i = 0 ; i < files.length ; i ++){
      formData.append('files', files[i]);
    }

    let type = '';
    for (var i = 0 ; i < fileType.length ; i ++){
      if(i == 0){
        type = '[';
      }
      type = type.concat('{"type":"'+fileType[i].type+'","fileName":"'+fileType[i].fileName+'"},');

      if(i == fileType.length -1){
        type = type.replace(/,\s*$/, "").concat(']');

      }
    }

    formData.append('type',type);

    return this.postFormData("imports/upload",formData);
  }

  getMapping(type) {
    return this.get("imports/getMappingByType?type="+type);
  }

  mapFields(data) {
    let obj = {"mapping" : data};
    return this.post("imports/mapping",obj);
  }

  validateMapping() {
    return this.post("imports/validateMapping","");
  }

  startImport() {
    return this.post("imports/processBulkImport","");
  }

}
