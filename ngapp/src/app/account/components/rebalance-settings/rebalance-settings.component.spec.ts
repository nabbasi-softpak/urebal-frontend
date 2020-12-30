import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RebalanceSettingsComponent } from './rebalance-settings.component';

xdescribe('RebalanceSettingsComponent', () => {
  let component: RebalanceSettingsComponent;
  let fixture: ComponentFixture<RebalanceSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RebalanceSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RebalanceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
