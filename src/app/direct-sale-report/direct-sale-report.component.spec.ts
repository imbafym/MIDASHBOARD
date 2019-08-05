import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectSaleReportComponent } from './direct-sale-report.component';

describe('DirectSaleReportComponent', () => {
  let component: DirectSaleReportComponent;
  let fixture: ComponentFixture<DirectSaleReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectSaleReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectSaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
