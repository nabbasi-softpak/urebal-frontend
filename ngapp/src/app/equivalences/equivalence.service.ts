import { Injectable } from '@angular/core';
import { URebalService } from '../services/urebal.service';
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "angular-2-local-storage";
import {
  AccountId
} from "../drifts/apply-equivalence-modal/apply-equivalence-modal.derivedclass";

@Injectable()
export class EquivalenceService extends URebalService {
  //AF20191211: Changed the endpoint as this endpoint handles special characters correctly
  EQUIVALENCE_EXISTS = "equivalences/equivalence?equivalenceName=";
  EQUIVALENCES_BY_ACCOUNT = "equivalences/account/";
  ACCOUNT_EQUIVALENCE_ASSIGNMENT = "equivalences/account-equivalence-assignment";
  EQUIVALENCE = "equivalences/";
  UPDATE_EQUIVALENCE_ASSIGNMENT = "equivalences/save-equivalence-assignment/";
  APPLY_EQUIVALENCE_ALL_ACCOUNT = "equivalences/apply-equivalence-all-account/";
  EQUIVALENCE_SECURITY_MATCHES = "equivalences/equivalencevalid?equivalenceName=";

  constructor(http: HttpClient, localStorage: LocalStorageService) {
    super(http, localStorage);
  }

  getEquivalencesList(){
    //return this.get("equivalence/getEquivalences");
    return this.get(this.EQUIVALENCE);
  }

  getEquivalence(equivalenceId){
    return this.get(this.EQUIVALENCE + equivalenceId);
  }

  createUpdateEquivalence(equivalenceId, isEdit, equivalence) {
    if(isEdit)
      return this.put(this.EQUIVALENCE + equivalenceId,equivalence);
    else
      return this.postForm(this.EQUIVALENCE ,equivalence);
  }


  deleteEquivalence(equivalenceId) {
    return this.delete(this.EQUIVALENCE + equivalenceId);
  }

  checkEquivalenceExists(equivalenceName) {
    const encodedName = this.escapeFilterFieldWithoutSingleQuotes(equivalenceName);
    return this.get(this.EQUIVALENCE_EXISTS + encodedName);
  }

  checkEquivalenceNameValid(equivalenceName) {
    const encodedName = this.escapeFilterFieldWithoutSingleQuotes(equivalenceName);
    return this.get(this.EQUIVALENCE_SECURITY_MATCHES + encodedName);
  }

  getEquivalencesByAccount(accountId: String) {
      return this.get(this.EQUIVALENCES_BY_ACCOUNT + accountId);
  }

  getAccountEquivalenceAssignment(accountIds: String[]) {
    let queryParam: String = "?accountIds=" + accountIds.join(",");
    return this.get(this.ACCOUNT_EQUIVALENCE_ASSIGNMENT + queryParam)
  }

  filterResponse(response) {
    if (response.code == 200 && response.responsedata) return response.responsedata;
    return [];
  }

  applyEquivalenceToSelectedAccounts(equivalenceId: String, accountIds: AccountId[]) {
    let url = this.UPDATE_EQUIVALENCE_ASSIGNMENT + equivalenceId;
    return this.put(url, accountIds);
  }

  applyEquivalenceAllAccounts(equivalenceId: any) {
    let url = this.APPLY_EQUIVALENCE_ALL_ACCOUNT + equivalenceId;
    return this.put(url, null);
  }
}
