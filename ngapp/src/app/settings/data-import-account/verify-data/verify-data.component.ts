import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ModalComponent} from "../../../shared/components/modal/modal.component";
import {UrebalGridComponent} from "../../../shared/components/urebal-grid/urebal-grid.component";
import {URebalService} from "../../../services/urebal.service";


@Component({
  selector: 'app-verify-data',
  templateUrl: './verify-data.component.html',
  styleUrls: ['./verify-data.component.css']
})
export class VerifyDataComponent implements OnInit {

  @Input() successData: any;
  @Input() errorData: any;
  @Input() warningData: any;
  @Output() progressIndicator = new EventEmitter();
  @Output() openAccordion = new EventEmitter();
  @ViewChild('verifyDataModalRef') verifyDataModalRef: ModalComponent;
  @ViewChild('verifyImportDataGrid') verifyGrid: UrebalGridComponent;

  private modalMessage = [];
  public notificationTitle: string = '';
  constructor(public urebalService: URebalService) { }

  ngOnInit() {}

  nextBtnPressed() {
    this.progressIndicator.emit(99);
    this.openAccordion.emit();
    $('#verifyData').addClass('slds-hide');
    $('#reviewFinish').removeClass('slds-hide');
    $('#reviewFinishStep').addClass('active');
  }

  openModal(data,title) {
    this.notificationTitle = 'Data Import: ' + title;
    this.modalMessage = [];
    for (let i =0; i<data.length; i++) {
      let obj = {
        'fileType' : data[i].fileType,
        'message' : data[i].message,
        'reason' : data[i].reason,
        'index' : i+1
      }
      this.modalMessage.push(obj);
    }
    this.verifyGrid.refreshGrid(this.modalMessage)
    this.verifyDataModalRef.open();
  }

  backBtnPressed() {
    $('#mapFields').removeClass('slds-hide');
    $('#verifyData').addClass('slds-hide');
    $('#mapNext').removeClass('slds-hide');
    $('#verifyDataStep').removeClass('active');
    this.progressIndicator.emit(33);
  }

  cancelBtnPressed() {
    location.reload();
  }

}
