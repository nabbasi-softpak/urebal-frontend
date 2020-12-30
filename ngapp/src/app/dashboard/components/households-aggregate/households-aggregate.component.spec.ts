import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdsAggregateComponent } from './households-aggregate.component';

xdescribe('HouseholdsAggregateComponent', () => {
  let component: HouseholdsAggregateComponent;
  let fixture: ComponentFixture<HouseholdsAggregateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseholdsAggregateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdsAggregateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
