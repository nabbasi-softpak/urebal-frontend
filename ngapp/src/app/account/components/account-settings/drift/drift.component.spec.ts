import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriftComponent } from './drift.component';

xdescribe('DriftComponent', () => {
  let component: DriftComponent;
  let fixture: ComponentFixture<DriftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
