import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTableComponent } from './daily-table.component';

describe('DailyTableComponent', () => {
  let component: DailyTableComponent;
  let fixture: ComponentFixture<DailyTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
