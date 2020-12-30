import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataImportAccountComponent } from './data-import-account.component';

xdescribe('DataImportAccountComponent', () => {
  let component: DataImportAccountComponent;
  let fixture: ComponentFixture<DataImportAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataImportAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataImportAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
