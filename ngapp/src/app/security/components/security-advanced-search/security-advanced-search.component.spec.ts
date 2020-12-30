import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityAdvancedSearchComponent } from './security-advanced-search.component';

xdescribe('SecurityAdvancedSearchComponent', () => {
  let component: SecurityAdvancedSearchComponent;
  let fixture: ComponentFixture<SecurityAdvancedSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityAdvancedSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityAdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
