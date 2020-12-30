import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrebalAccordionComponent } from './urebal-accordion.component';

xdescribe('UrebalAccordionComponent', () => {
  let component: UrebalAccordionComponent;
  let fixture: ComponentFixture<UrebalAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrebalAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrebalAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
