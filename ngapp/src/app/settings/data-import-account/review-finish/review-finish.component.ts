import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import { DataImportAccountService } from '../../data-import-account-service';
import {ModalComponent} from "../../../shared/components/modal/modal.component";
import {Router } from '@angular/router';
import {UILoader} from "../../../shared/util/UILoader";
import {URebalService} from "../../../services/urebal.service";


@Component({
  selector: 'app-review-finish',
  templateUrl: './review-finish.component.html',
  styleUrls: ['./review-finish.component.css']
})
export class ReviewFinishComponent implements OnInit {

  @Input() mappedData: any;
  @ViewChildren('startImportModal') startImportModal: QueryList<ModalComponent>;
  @Output() progressIndicator = new EventEmitter();
  @Output() animateAccordion = new EventEmitter();


  public importMsg: string;
  private responseData: any;

  constructor(public urebalService: URebalService, protected dataImportService: DataImportAccountService, protected router: Router) {}

  ngOnInit() {
  }

  reviewFinishAccordionAnimate(accordion_index) {
    this.animateAccordion.emit({"id" : "rfAccordionid","divHeight_id": "rfDivHeightid", "index":accordion_index,"max_height" : 2000})
  }

  startImport() {
    UILoader.blockUI.start();
    this.dataImportService.startImport().subscribe(result => {
      this.responseData = result;
        this.importMsg = result.message;
        this.startImportModal.forEach(instance => {
          if (instance.id == "reviewFinishModal") {
            instance.open();
            UILoader.blockUI.stop();
         }
        });
    });
  }

  bckBtnPressed() {
    this.progressIndicator.emit(66);
    $('#verifyData').removeClass('slds-hide');
    $('#reviewFinish').addClass('slds-hide');
    $('#reviewFinishStep').removeClass('active');
  }

  cancelBtnPressed() {
    location.reload();
  }

  navigateToAccountsList() {
    if (this.responseData.code == 400) {
      this.startImportModal.forEach(instance => {
        if (instance.id == "reviewFinishModal") {
          instance.close();
        }
      });
    }else {
      this.router.navigate(['/secure/drift/list']);
    }
  }



}
