import { TestBed, inject } from '@angular/core/testing';

import { EquivalenceService } from './equivalence.service';

xdescribe('EquivalenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EquivalenceService]
    });
  });

  it('should ...', inject([EquivalenceService], (service: EquivalenceService) => {
    expect(service).toBeTruthy();
  }));
});
