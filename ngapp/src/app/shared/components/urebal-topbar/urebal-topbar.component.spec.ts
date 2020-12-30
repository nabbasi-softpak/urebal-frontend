import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrebalTopBarComponent } from './urebal-topbar.component';

xdescribe('UrebalNavigationComponent', () => {
  let component: UrebalTopBarComponent;
  let fixture: ComponentFixture<UrebalTopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrebalTopBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrebalTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
