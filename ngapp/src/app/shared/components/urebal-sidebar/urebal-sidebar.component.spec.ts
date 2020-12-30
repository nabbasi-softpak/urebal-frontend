import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrebalSidebarComponent } from './urebal-sidebar.component';

xdescribe('UrebalSidebarComponent', () => {
  let component: UrebalSidebarComponent;
  let fixture: ComponentFixture<UrebalSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrebalSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrebalSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
