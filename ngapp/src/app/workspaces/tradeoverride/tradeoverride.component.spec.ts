import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeOverrideComponent } from './tradeoverride.component';

xdescribe('TradeoverrideComponent', () => {
  let component: TradeOverrideComponent;
  let fixture: ComponentFixture<TradeOverrideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeOverrideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeOverrideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
