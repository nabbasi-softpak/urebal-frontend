import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataImportSupportComponent } from './data-import-support.component';

xdescribe('DataImportSupportComponent', () => {
  let component: DataImportSupportComponent;
  let fixture: ComponentFixture<DataImportSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataImportSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataImportSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
