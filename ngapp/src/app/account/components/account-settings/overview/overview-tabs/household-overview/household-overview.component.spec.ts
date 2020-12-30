import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdOverviewComponent } from './household-overview.component';

xdescribe('HouseholdOverviewComponent', () => {
  let component: HouseholdOverviewComponent;
  let fixture: ComponentFixture<HouseholdOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseholdOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
