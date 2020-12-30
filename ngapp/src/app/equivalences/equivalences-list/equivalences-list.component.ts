import {Component, OnInit, ViewChildren, QueryList} from '@angular/core';
import {Router} from '@angular/router';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {URebalUtil} from '../../shared/util/URebalUtil';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import {EquivalenceService} from '../equivalence.service';
import {UrebalPermissions, PermissionResolverService} from '../../services/permission-resolver.service';
import {URebalService} from "../../services/urebal.service";


@Component({
  selector: 'app-equivalences-list',
  templateUrl: './equivalences-list.component.html',
  styles: [],

})
export class EquivalencesListComponent extends UrebalPermissions implements OnInit{
  @BlockUI() blockUI: NgBlockUI;
  @ViewChildren(ModalComponent) equivalenceModal: QueryList<ModalComponent>;

  constructor(public urebalService: URebalService, private equivalenceService:EquivalenceService ,
              private router: Router,
              permissionResolverService: PermissionResolverService) { super(permissionResolverService); }

  public equivalenceList : any;
  public tempList : any;
  public searchedList : any;
  public keepEquivalenceList : any;
  public deleteResponseMsg: string;
  public searchText: string = "";
  public itemCountPerPage: number = 10;
  public listLength: number = 0;
  public totalItemsCount: number = 0;
  public itemIndex = 0;
  public equivalenceIdToBeDeleted: any;

  public equivalenceActions = [
    {
      name: 'Delete',
      icon: 'delete',
      action: this.delEquivalence.bind(this),
      classes: "ur-delete-icon",
      isAllowed: this.isAllowed('equivalenceDelete')
    },
    {
      name: 'Edit',
      icon: 'edit',
      action: this.editEquivalence.bind(this),
      classes: "ur-edit-icon",
      isAllowed: this.isAllowed('equivalenceModify')
    },
  ];

  ngOnInit() {
    setTimeout(()=>{
      this.getEquivalenceList();
    },200);


  }

  getEquivalenceList() {
    this.equivalenceService.getEquivalencesList().subscribe(result =>{

        if(result.code == 200){
          /* If first item on the last page got deleted and getEquivalenceList is called,
             then we have to move the item index such that it show the last available page. */
          if (result.responsedata.length == 0) {
            this.itemIndex = 0;
          } else if (this.itemIndex >= result.responsedata.length) {
            this.itemIndex -= this.itemCountPerPage;
          }

          this.equivalenceList = result.responsedata.slice(this.itemIndex, this.itemIndex + this.itemCountPerPage);
          this.listLength = this.equivalenceList.length;
          this.tempList = result.responsedata;
          this.searchedList = [...this.tempList];
          this.totalItemsCount = this.tempList.length;
          this.searchEquivalencesWithName(this.searchText);
        }else {
          this.equivalenceList = [];
          this.listLength = 0;
          this.tempList = [];
          this.searchedList = [];
          this.totalItemsCount = 0;
        }
      });

  }

  editEquivalence(equivalenceId) {
    this.navigateToEditEquivalence(equivalenceId, "Edit");
  }

  navigateToEditEquivalence(equivalenceId,equivalenceType){
    equivalenceType = 'Edit';
    this.router.navigate(['/secure/equivalences/edit-equivalence',equivalenceId, URebalUtil.encodeparams(equivalenceType)]);
  }

  navigateToCreateEquivalence(equivalenceType){
    equivalenceType = 'Create';
    this.router.navigate(['/secure/equivalences/create-equivalence', URebalUtil.encodeparams(equivalenceType)]);
  }

  filterEquivalences(event) {
    let value = event.target.value
    this.equivalenceList = new Array<string>();
      value = value.trim().toUpperCase();

      if(value.length == 0){
        this.equivalenceList = this.keepEquivalenceList;
        return;
      }

      for(let portfolio of this.keepEquivalenceList) {
        if(portfolio.portfolioName.indexOf(value) != -1){
          this.equivalenceList.push(portfolio);
        }
      }
  }

  delEquivalence(equivalenceId) {
    this.deleteEquivalence(equivalenceId);
  }

  deleteEquivalence(equivalenceId) {
      this.equivalenceIdToBeDeleted = equivalenceId;

    this.equivalenceModal.forEach(instance => {
      if (instance.id == 'confirmationModal') {
        instance.open();
      }
    });
  }

  confirmDeleteEquivalence() {

    this.equivalenceModal.forEach(instance => {
      if (instance.id == 'confirmationModal') {
        instance.close();
      }
    });

    this.equivalenceService.deleteEquivalence(this.equivalenceIdToBeDeleted).subscribe(result => {
      if (result.code == 200) {
      this.deleteResponseMsg = result.message;
      this.equivalenceModal.forEach(instance => {
          if (instance.id == 'deletedModal') {
            instance.open();
          }
        });
      this.getEquivalenceList();
      }
    });
  }

  searchEquivalences(event) {
    this.searchEquivalencesWithName(event.target.value);
  }

  searchEquivalencesWithName(equivalenceName: string) {
    this.searchText =  equivalenceName;
    this.searchText = this.searchText.trim();

    if(this.tempList != undefined){
      this.equivalenceList = [];
      this.searchedList = [];
      if (this.searchText.length == 0) {
        this.searchedList = [...this.tempList];
        this.equivalenceList = this.tempList.slice(this.itemIndex,this.itemIndex + this.itemCountPerPage);
        this.listLength = this.equivalenceList.length;
        this.totalItemsCount = this.tempList.length;
        return;
      }

      for (let equivalence of this.tempList) {
        if (equivalence.name.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1) {
          this.searchedList.push(equivalence);
        }
      }

      this.itemIndex = 0;
      this.equivalenceList = this.searchedList.slice(this.itemIndex, this.itemCountPerPage);
      this.listLength = this.equivalenceList.length;

      this.totalItemsCount = this.searchedList.length;
    }
  }

  pagination(direction) {
    if(this.searchedList != undefined && this.searchedList.length > 0){
      // $("#text-input-01").val('');
      if(direction === 'next')
      {
        let ceiling = (Math.ceil(this.searchedList.length/this.itemCountPerPage) * this.itemCountPerPage)-this.itemCountPerPage;
        this.itemIndex = (this.itemIndex < ceiling) ? this.itemIndex + this.itemCountPerPage : ceiling;
      } else {
        this.itemIndex = (this.itemIndex > 0) ? this.itemIndex - this.itemCountPerPage : 0;
      }

      if(this.itemIndex >= 0) {
        this.equivalenceList = this.searchedList.slice(this.itemIndex, this.itemIndex + this.itemCountPerPage);
      }
      this.listLength = this.equivalenceList.length;
      this.totalItemsCount = this.searchedList.length;
    }
  }

  reloadEquivalences() {
    this.itemIndex = 0;
    this.searchText = "";
    this.getEquivalenceList();
    $("#text-input-01").val('');
  }

  closeModal() {
    this.equivalenceModal.forEach(instance => {
      instance.close();
    })
  }
}
