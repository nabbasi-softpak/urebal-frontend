import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrebalCytoscapeComponent } from './urebal-cytoscape.component';

xdescribe('UrebalCytoscapeComponent', () => {
  let component: UrebalCytoscapeComponent;
  let fixture: ComponentFixture<UrebalCytoscapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrebalCytoscapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrebalCytoscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
