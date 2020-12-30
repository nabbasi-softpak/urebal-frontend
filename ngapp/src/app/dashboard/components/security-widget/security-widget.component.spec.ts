import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityWidgetComponent } from './security-widget.component';

xdescribe('SecurityWidgetComponent', () => {
  let component: SecurityWidgetComponent;
  let fixture: ComponentFixture<SecurityWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
