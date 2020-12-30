import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrebalWidgetComponent } from './urebal-widget.component';

xdescribe('UrebalWidgetComponent', () => {
  let component: UrebalWidgetComponent;
  let fixture: ComponentFixture<UrebalWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrebalWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrebalWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
