import {Component, ViewChild} from '@angular/core';
import {DataImportService} from './data-import.service';
import {ModalComponent} from '../../shared/components/modal/modal.component';
import {UrebalPermissions, PermissionResolverService} from '../../services/permission-resolver.service';
import {URebalService} from "../../services/urebal.service";


@Component({
  selector: 'app-imports',
  styleUrls: ['./data-import.component.css'],
  templateUrl: './data-import.component.html'
})
export class DataImportComponent extends UrebalPermissions{
  @ViewChild('dataImportModal') dataImportModal: ModalComponent;
  public DEFAULT_UPLOAD_MESSAGE = "Choose file";
  public portfolioName : string;
  public type : string;
  public attributeName : string;
  public modelName : string;
  public attributeNameForModel = '';
  public attributeTypeForModel = '';
  public modalMessage : string;
  public tiltingParamName : string;
  public rankSetId : string;
  public bDeleteAllSec = false;

  constructor(private service: DataImportService,permissionResolverService: PermissionResolverService, public urebalService:URebalService){ super(permissionResolverService); }

  private getCurrentElement(event) {
    let target = event.target || event.srcElement || event.currentTarget;
    return $(target)
  }

  private getCardElements(event) {
    let card = this.getCurrentElement(event).closest("article.card");
    let file = card.find("input[type=file]").get(0)['files'];
    let uploadMessage = card.find(".upload-message");

    return [card, file, uploadMessage];
  }

  uploadAccount(event){
    let [card, file, uploadMessage] = this.getCardElements(event);
    const fd = new FormData();
    fd.append('file',  file[0]);
    fd.append('portfolioName', this.portfolioName);
    this.clearUploadMessage(event);

    if (this.portfolioName != undefined){
      this.service.uploadAccount(fd).subscribe(response => {
        uploadMessage.html(response.message).attr("title",response.message);
      });
    } else {
      this.modalMessage = 'Please provide account name';
      this.dataImportModal.open('dataImportModal');
    }
  }

  uploadModel(event){
    let [card, file, uploadMessage] = this.getCardElements(event);
    const fd = new FormData();
    fd.append('file', file[0]);
    fd.append('modelName', this.modelName);
    fd.append('attributeName', this.attributeNameForModel);
    fd.append('attributeType', this.attributeTypeForModel);
    this.clearUploadMessage(event);

    if(typeof this.modelName === "undefined") {
      this.modalMessage = 'Please provide model name';
      this.dataImportModal.open('dataImportModal');
    } else if(this.modelName.trim() === "") {
      this.modalMessage = 'Please provide model name';
      this.dataImportModal.open('dataImportModal');
    } else if (typeof this.modelName !== "undefined"){
      this.service.uploadModel(fd).subscribe(response => {
        uploadMessage.html(response.message).attr("title",response.message);
      });
    }
  }

  uploadAttribute(event){
    let [card, file, uploadMessage] = this.getCardElements(event);
    const fd = new FormData();
    fd.append('file', file[0]);
    fd.append('type', this.type);
    fd.append('attributename', this.attributeName);
    this.clearUploadMessage(event);

    if (typeof this.type === "undefined" || typeof this.attributeName === "undefined") {
      this.modalMessage = 'Please provide attribute type and attribute name';
      this.dataImportModal.open('dataImportModal');
    } else if (this.type.trim() === "" || this.attributeName.trim() === "") {
      this.modalMessage = 'Please provide attribute type and attribute name';
      this.dataImportModal.open('dataImportModal');
    } else if (typeof this.type !== "undefined" && typeof this.attributeName !== "undefined") {
      this.service.uploadAttribute(fd).subscribe(response => {
        uploadMessage.html(response.message).attr("title",response.message);
      });
    }
  }

  uploadPrice(event){
    let [card, file, uploadMessage] = this.getCardElements(event);
    const fd = new FormData();
    fd.append('file', file[0]);
    this.clearUploadMessage(event);
    this.service.uploadPrice(fd).subscribe(response => {
      uploadMessage.html(response.message).attr("title",response.message);
    });
  }

  uploadTiltParameter(event){
    let [card, file, uploadMessage] = this.getCardElements(event);

    const fd = new FormData();
    fd.append('file', file[0]);
    fd.append('tiltingParamName', this.tiltingParamName);
    this.clearUploadMessage(event);

    if (typeof this.tiltingParamName === "undefined"){
      this.modalMessage = 'Please provide tilting parameter name';
      this.dataImportModal.open('dataImportModal');
    } else if (this.tiltingParamName.trim() === ""){
      this.modalMessage = 'Please provide tilting parameter name';
      this.dataImportModal.open('dataImportModal');
    } else if (typeof this.tiltingParamName !== "undefined") {
      this.service.uploadTiltingParamter(fd).subscribe(response => {
        uploadMessage.html(response.message).attr("title",response.message);
      });
    }
  }

  uploadSecurityRanks(event){
    let [card, file, uploadMessage] = this.getCardElements(event);

    const fd = new FormData();
    fd.append('file', file[0]);
    fd.append('setId', this.rankSetId);
    this.clearUploadMessage(event);

    if (typeof this.rankSetId === "undefined") {
      this.modalMessage = 'Please provide rank set id';
      this.dataImportModal.open('dataImportModal');
    } else if (this.rankSetId.trim() === "") {
      this.modalMessage = 'Please provide rank set id';
      this.dataImportModal.open('dataImportModal');
    } else if (typeof this.rankSetId !== "undefined") {
      this.service.uploadRankParamter(fd).subscribe(response => {
        uploadMessage.html(response.message).attr("title",response.message);
      });
    }
  }

  uploadSecurityMaster(event){
    let [card, file, uploadMessage] = this.getCardElements(event);

    const fd = new FormData();
    fd.append('file', file[0]);
    fd.append('deleteAllSecurities', String(this.bDeleteAllSec));
    this.clearUploadMessage(event);

    this.service.uploadSecMaster(fd).subscribe(response => {
      uploadMessage.html(response.message).attr("title",response.message);
    });
  }

  closeModal() {
    this.dataImportModal.close();
  }

  cleanFile(event) {
    let [card, file, uploadMessage] = this.getCardElements(event);

    card.find(".remove-file").css("display", "none");
    card.find("button").attr("disabled", "true")
    card.find("input[type=file]").val("");

    uploadMessage.html(this.DEFAULT_UPLOAD_MESSAGE).attr("title",this.DEFAULT_UPLOAD_MESSAGE);
  }

  selectFile(event) {
    let [card, file, uploadMessage] = this.getCardElements(event);

    const fileName = file[0].name;
    if (fileName.indexOf(".csv") == -1) {
      const message = "<span class='error-text-red'>ERROR: This is not a .csv file.</span>";
      uploadMessage.html(message).attr("title", message);
      card.find("button").attr("disabled", "disabled");
    }
    else {
      uploadMessage.text(file[0].name).attr("title", file[0].name);
      card.find("button").removeAttr("disabled");
    }
    card.find(".remove-file").css("display", "inline");
  }

  clearUploadMessage(event) {
    let [card, file, uploadMessage] = this.getCardElements(event);

    card.find("button").attr("disabled", true);
    card.find(".remove-file").css("display", "none");
    card.find("input[type=file]").val("");

    uploadMessage.html(this.DEFAULT_UPLOAD_MESSAGE).attr("title",this.DEFAULT_UPLOAD_MESSAGE);
  }
}
