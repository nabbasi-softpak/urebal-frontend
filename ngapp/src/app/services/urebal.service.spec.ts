import { TestBed, inject } from '@angular/core/testing';

import { URebalService } from '../services/urebal.service';

xdescribe('URebalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [URebalService]
    });
  });

  it('should ...', inject([URebalService], (service: URebalService) => {
    expect(service).toBeTruthy();
  }));
});
