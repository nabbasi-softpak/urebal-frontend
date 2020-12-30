import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdCriteriaComponent } from './household-criteria.component';

xdescribe('HouseholdCriteriaComponent', () => {
  let component: HouseholdCriteriaComponent;
  let fixture: ComponentFixture<HouseholdCriteriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseholdCriteriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
