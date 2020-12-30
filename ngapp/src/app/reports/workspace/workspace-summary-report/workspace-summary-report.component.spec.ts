import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceSummaryReportComponent } from './workspace-summary-report.component';

xdescribe('WorkspaceSummaryReportComponent', () => {
  let component: WorkspaceSummaryReportComponent;
  let fixture: ComponentFixture<WorkspaceSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
