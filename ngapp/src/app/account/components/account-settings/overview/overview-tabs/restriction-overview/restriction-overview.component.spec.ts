import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictionOverviewComponent } from './restriction-overview.component';

xdescribe('RestrictionOverviewComponent', () => {
  let component: RestrictionOverviewComponent;
  let fixture: ComponentFixture<RestrictionOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestrictionOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
