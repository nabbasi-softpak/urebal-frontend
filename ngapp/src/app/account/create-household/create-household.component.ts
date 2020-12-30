import {Component, ViewChildren, Inject, QueryList, AfterViewInit, AfterContentChecked} from '@angular/core';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import {Router} from "@angular/router";
import {URebalUtil} from "../../shared/util/URebalUtil";
import {GridLinkInfo} from '../../shared/classes/GridLinkInfo.class';
import {UILoader} from '../../shared/util/UILoader';

import { AccountService} from '../account.service';
import {DriftService} from "../../drifts/drift.service";


@Component({
  selector: 'app-create-household',
  templateUrl: './create-household.component.html',
  styleUrls: ['./create-household.component.css']
})
export class CreateHouseHoldComponent implements AfterViewInit,AfterContentChecked{

  private tempArray:any = [];
  private selectedRow:any = [];
  public portfolioName: string;
  public errMsg: string = '';
  public responseMsg: string;
  private responseCode;

  @ViewChildren(ModalComponent) modalComponent: QueryList<ModalComponent>;

  constructor(private accountService:AccountService,private router:Router) { }

  ngAfterViewInit()
  {
    $('#singleAccountList').parents('.myContainer').eq(0).css("padding-left", "1rem").css("padding-right", "1rem")
      .removeClass("slds-p-around--medium").addClass("slds-p-around--small");
    $('#houseHoldName').focus();
  }

  ngAfterContentChecked() {
    $(".jqx-checkbox").parent().attr("title", "");
  }

  select(event:any) {
    if (event != null) {
      this.selectedRow.push(event);
    }
    else {
      this.selectedRow = []; // Called when select is deSelected
    }

      if(this.selectedRow.length < 2) {
        this.errMsg = 'You need at-least two accounts to create a household.'
        $(window).scrollTop($('#houseHoldName').offset().top - 100);
      } else {
        this.errMsg = ''
      }

    }

  deSelect(event:any) {
    let index = this.selectedRow.indexOf(event);

    if (index >= 0){
      this.selectedRow.splice(index,1);
    }

    if(this.selectedRow.length < 2) {
      this.errMsg = 'You need at-least two accounts to create a household.'
      $(window).scrollTop($('#houseHoldName').offset().top - 100);
    } else {
      this.errMsg = ''
    }
  }

  checkHouseHoldName() {
    this.errMsg = '';
    if(typeof this.portfolioName != 'undefined') {
      this.portfolioName = this.portfolioName.replace(/(^\s+|\s+$)/g,'');
      if(this.portfolioName) {
        UILoader.blockUI.start();
        this.accountService.getPortfolioDetailsByName(this.portfolioName).subscribe(result => {
          UILoader.blockUI.stop();
          if (result.code !== 200) {
            this.errMsg = '';
          } else {
            this.errMsg = 'Household name already exist.';
            //$('#houseHoldName').focus({preventScroll:false});
            $(window).scrollTop($('#houseHoldName').offset().top - 30);
          }
        });
      }
    }
  }

  createHousehold() {

    if(this.selectedRow.length>15) {
      this.modalComponent.forEach((modalInstance) => {
        if (modalInstance.id == 'modal3') {
          modalInstance.open();
        }
      });
    }else {
      setTimeout(()=> {
        if (this.errMsg === '') {
          if (typeof this.portfolioName == 'undefined' || this.portfolioName == '') {
            this.errMsg = 'Household name is required!';
            $(window).scrollTop($('#houseHoldName').offset().top - 30);
          } else {
            this.errMsg = '';
            if (this.selectedRow.length > 1) {
              this.modalComponent.forEach((modalInstance) => {
                if (modalInstance.id == 'modal1') {
                  modalInstance.open();
                }
              });

              this.errMsg = '';
            } else {
              this.errMsg = 'You need at-least two accounts to create a household.'
              //$('#houseHoldName').focus({preventScroll:false});
              $(window).scrollTop($('#houseHoldName').offset().top - 30);
            }
          }
        }
      }, 300);
    }
  }

  mergeAccounts() {

    this.modalComponent.forEach((modalInstance) => {
      if (modalInstance.id == 'modal1'){
        modalInstance.close();
      }
    });


    for (let i =0; i < this.selectedRow.length; i++ ) {
      delete this.selectedRow[i]["boundindex"];
      delete this.selectedRow[i]["uid"];
      delete this.selectedRow[i]["uniqueid"];
      delete this.selectedRow[i]["visibleindex"];
    }

    let portfolio = {"portfolioName" : this.portfolioName, "accounts" : this.selectedRow};

    this.accountService.createHousehold(portfolio).subscribe(result => {
	this.responseCode = result.code;
        if (result.code == 200) {
          this.responseMsg = result.message;
        }else  {
          this.responseMsg = result.message;
          console.error(result.message);
        }

      this.modalComponent.forEach((modalInstance) =>{
        if (modalInstance.id == 'modal2'){
          modalInstance.open();
        }
      });

      });
  }

  closeModal(){
    this.modalComponent.forEach((modalInstance) => {
        modalInstance.close();
    });
  }

  redirectToAccounts(){
    this.router.navigate(['/secure/drift/list']);
  }

  OnLinkActive(event:GridLinkInfo){
    // Call the relevant method as per data in event object
    if(event.linkType == "routeToAccount"){
      this.routeToAccount(event.linkParams["accountName"]);
    }
  }

  routeToAccount(value:string){
    this.router.navigate(['account',URebalUtil.encodeparams(value),URebalUtil.encodeparams("false")]);
  }

}
