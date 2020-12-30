import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnInit,
  ChangeDetectionStrategy, ChangeDetectorRef, Input
} from '@angular/core';
import { UrebalAccordionComponent } from '../urebal-accordion/urebal-accordion.component';

@Component({
  selector: 'urebal-accordion-group',
  templateUrl: './urebal-accordion-group.component.html',
  styleUrls: ['./urebal-accordion-group.component.css'],
  changeDetection: ChangeDetectionStrategy.Default // TODO: use OnPush
})
export class UrebalAccordionGroupComponent implements OnInit, AfterContentInit {
  @Input() autoClose: boolean = true;
  @ContentChildren(UrebalAccordionComponent) accordions: QueryList<UrebalAccordionComponent>;
  private subscriptions = [];

  private _accordions: QueryList<UrebalAccordionComponent>;

  constructor(private ref: ChangeDetectorRef) {}

  ngAfterContentInit() {
    this._accordions = this.accordions;
    this.removeSubscriptions();
    this.addSubscriptions();

    this.accordions.changes.subscribe(rex => {
      this._accordions = rex;
      this.removeSubscriptions();
      this.addSubscriptions();
    });
  }

  addSubscriptions() {
    this._accordions.forEach(a => {
      let subscription = a.toggleAccordion.subscribe(e => {
        this.toggleAccordion(a);

      });
      this.subscriptions.push(subscription);
    });
  }

  removeSubscriptions() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  toggleAccordion(accordion) {
    if (this.autoClose && !accordion.active) {
      this.accordions.forEach(a => a.active = false);
    }
    accordion.active = !accordion.active;
  }

  ngOnDestroy() {
    this.removeSubscriptions();
  }

  ngOnInit() {}
}
