import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewHouseholdTabComponent } from './overview-household-tab.component';

xdescribe('OverviewHouseholdTabComponent', () => {
  let component: OverviewHouseholdTabComponent;
  let fixture: ComponentFixture<OverviewHouseholdTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewHouseholdTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewHouseholdTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
