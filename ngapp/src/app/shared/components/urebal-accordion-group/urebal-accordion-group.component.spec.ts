import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrebalAccordionGroupComponent } from './urebal-accordion-group.component';

xdescribe('UrebalAccordionGroupComponent', () => {
  let component: UrebalAccordionGroupComponent;
  let fixture: ComponentFixture<UrebalAccordionGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrebalAccordionGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrebalAccordionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
