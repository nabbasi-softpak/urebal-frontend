import { TestBed, inject } from '@angular/core/testing';
import { CriteriaService } from './criteria.service';
import {HttpClientModule} from "@angular/common/http";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";

describe('CriteriaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CriteriaService, LocalStorageService],
      imports: [HttpClientModule, LocalStorageModule.forRoot({
        prefix: 'urebal-app',
        storageType: "localStorage"
      })]
    });
  });

  it('should create criteria service', inject([CriteriaService], (service: CriteriaService) => {
    expect(service).toBeTruthy();
  }));


});

