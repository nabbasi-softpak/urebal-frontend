import {inject, TestBed} from '@angular/core/testing';

import { AuditService } from './audit.service';

xdescribe('AuditService', () => {
  let service: AuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditService);
  });

  it('should be created', inject([AuditService],(service:AuditService) => {
    expect(service).toBeTruthy();
  }));
});
