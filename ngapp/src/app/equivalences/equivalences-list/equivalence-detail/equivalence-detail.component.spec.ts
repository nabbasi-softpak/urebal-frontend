import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquivalenceDetailComponent } from './equivalence-detail.component';
import {EquivalenceService} from "../../equivalence.service";
import {HttpClientModule} from "@angular/common/http";
import {LocalStorageModule, LocalStorageService} from "angular-2-local-storage";

describe('EquivalenceDetailComponent', () => {
  let component: EquivalenceDetailComponent;
  let fixture: ComponentFixture<EquivalenceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquivalenceDetailComponent ],
      imports: [HttpClientModule, LocalStorageModule.forRoot({
        prefix: 'urebal-app',
        storageType: "localStorage"
      })],
      providers: [EquivalenceService, LocalStorageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquivalenceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
