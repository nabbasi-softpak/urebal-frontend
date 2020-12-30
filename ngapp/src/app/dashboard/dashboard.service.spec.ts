import { TestBed, inject } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';

xdescribe('DashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardService]
    });
  });

  it('should ...', inject([DashboardService], (service: DashboardService) => {
    expect(service).toBeTruthy();
  }));
});
