import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquivalencesComponent } from './equivalences.component';
import {HttpClientModule} from "@angular/common/http";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";
import {EquivalenceService} from "../../equivalence.service";

xdescribe('EquivalencesComponent', () => {
  let component: EquivalencesComponent;
  let fixture: ComponentFixture<EquivalencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquivalencesComponent ],
      imports: [HttpClientModule, LocalStorageModule.forRoot({
          prefix: 'urebal-app',
          storageType: "localStorage"
      })],
      providers: [EquivalenceService, LocalStorageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquivalencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
