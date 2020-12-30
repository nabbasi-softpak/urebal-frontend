import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewAccountTabComponent } from './overview-account-tab.component';

xdescribe('OverviewAccountTabComponent', () => {
  let component: OverviewAccountTabComponent;
  let fixture: ComponentFixture<OverviewAccountTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewAccountTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewAccountTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
